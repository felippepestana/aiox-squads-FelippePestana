"""Stripe payment integration for Legal Analyst Squad."""
from __future__ import annotations

import os
import time
import hmac
import hashlib
from typing import Any

import stripe
from pydantic import BaseModel, Field

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID", "")
APP_URL = os.getenv("APP_URL", "http://localhost:3000")

stripe.api_key = STRIPE_SECRET_KEY


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class CheckoutRequest(BaseModel):
    price_id: str = ""
    customer_email: str = ""
    plan: str = "pro"


class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str


class SubscriptionStatus(BaseModel):
    active: bool = False
    plan: str = ""
    customer_email: str = ""
    current_period_end: int = 0
    cancel_at_period_end: bool = False


class AccessToken(BaseModel):
    token: str
    email: str
    plan: str
    expires_at: int


# ---------------------------------------------------------------------------
# Plans configuration
# ---------------------------------------------------------------------------

PLANS = {
    "starter": {
        "name": "Starter",
        "price_monthly": 97,
        "analyses_per_month": 10,
        "agents": 5,
        "features": [
            "5 Agentes Especializados",
            "10 Analises/mes",
            "Upload ate 20MB",
            "Relatorios basicos",
        ],
    },
    "pro": {
        "name": "Profissional",
        "price_monthly": 197,
        "analyses_per_month": 50,
        "agents": 15,
        "features": [
            "15 Agentes Especializados",
            "50 Analises/mes",
            "Upload ate 50MB",
            "Relatorios estrategicos",
            "Minutas automaticas",
            "Jurimetria avancada",
        ],
    },
    "enterprise": {
        "name": "Enterprise",
        "price_monthly": 497,
        "analyses_per_month": -1,
        "agents": 15,
        "features": [
            "15 Agentes + Custom",
            "Analises ilimitadas",
            "Upload ate 100MB",
            "API dedicada",
            "Suporte prioritario",
            "Treinamento personalizado",
            "SLA 99.9%",
        ],
    },
}

# In-memory store for access tokens (use DB in production)
_access_tokens: dict[str, AccessToken] = {}


# ---------------------------------------------------------------------------
# Checkout
# ---------------------------------------------------------------------------

def create_checkout_session(req: CheckoutRequest) -> CheckoutResponse:
    """Create a Stripe Checkout session."""
    price_id = req.price_id or STRIPE_PRICE_ID
    if not price_id:
        raise ValueError("STRIPE_PRICE_ID not configured")

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        success_url=f"{APP_URL}/app?session_id={{CHECKOUT_SESSION_ID}}&success=true",
        cancel_url=f"{APP_URL}/#pricing",
        customer_email=req.customer_email or None,
        metadata={"plan": req.plan},
        allow_promotion_codes=True,
    )
    return CheckoutResponse(checkout_url=session.url, session_id=session.id)


def create_one_time_checkout(amount_cents: int, description: str, email: str = "") -> CheckoutResponse:
    """Create a one-time payment checkout."""
    session = stripe.checkout.Session.create(
        payment_method_types=["card", "boleto", "pix"],
        line_items=[{
            "price_data": {
                "currency": "brl",
                "product_data": {"name": description},
                "unit_amount": amount_cents,
            },
            "quantity": 1,
        }],
        mode="payment",
        success_url=f"{APP_URL}/app?session_id={{CHECKOUT_SESSION_ID}}&success=true",
        cancel_url=f"{APP_URL}/#pricing",
        customer_email=email or None,
        payment_intent_data={"description": description},
    )
    return CheckoutResponse(checkout_url=session.url, session_id=session.id)


# ---------------------------------------------------------------------------
# Subscription management
# ---------------------------------------------------------------------------

def get_subscription_status(customer_email: str) -> SubscriptionStatus:
    """Check subscription status by email."""
    customers = stripe.Customer.list(email=customer_email, limit=1)
    if not customers.data:
        return SubscriptionStatus()

    customer = customers.data[0]
    subscriptions = stripe.Subscription.list(customer=customer.id, status="active", limit=1)
    if not subscriptions.data:
        return SubscriptionStatus()

    sub = subscriptions.data[0]
    plan = sub.metadata.get("plan", "pro")
    return SubscriptionStatus(
        active=True,
        plan=plan,
        customer_email=customer_email,
        current_period_end=sub.current_period_end,
        cancel_at_period_end=sub.cancel_at_period_end,
    )


def cancel_subscription(customer_email: str) -> dict[str, Any]:
    """Cancel subscription at period end."""
    customers = stripe.Customer.list(email=customer_email, limit=1)
    if not customers.data:
        return {"error": "Customer not found"}

    subscriptions = stripe.Subscription.list(customer=customers.data[0].id, status="active", limit=1)
    if not subscriptions.data:
        return {"error": "No active subscription"}

    sub = stripe.Subscription.modify(subscriptions.data[0].id, cancel_at_period_end=True)
    return {"status": "cancelling", "cancel_at": sub.current_period_end}


# ---------------------------------------------------------------------------
# Webhook processing
# ---------------------------------------------------------------------------

def process_webhook(payload: bytes, sig_header: str) -> dict[str, Any]:
    """Process Stripe webhook event."""
    if STRIPE_WEBHOOK_SECRET:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    else:
        import json
        event = stripe.Event.construct_from(json.loads(payload), stripe.api_key)

    event_type = event["type"]
    data = event["data"]["object"]

    if event_type == "checkout.session.completed":
        email = data.get("customer_email", "")
        plan = data.get("metadata", {}).get("plan", "pro")
        _grant_access(email, plan)
        return {"status": "access_granted", "email": email, "plan": plan}

    elif event_type == "customer.subscription.deleted":
        customer_id = data.get("customer")
        if customer_id:
            customer = stripe.Customer.retrieve(customer_id)
            _revoke_access(customer.email)
        return {"status": "access_revoked"}

    elif event_type == "invoice.payment_failed":
        customer_id = data.get("customer")
        if customer_id:
            customer = stripe.Customer.retrieve(customer_id)
            return {"status": "payment_failed", "email": customer.email}

    return {"status": "unhandled", "type": event_type}


# ---------------------------------------------------------------------------
# Access management
# ---------------------------------------------------------------------------

def _grant_access(email: str, plan: str) -> str:
    """Grant access token after payment."""
    token = hmac.new(
        (STRIPE_SECRET_KEY or "secret").encode(),
        f"{email}:{plan}:{int(time.time())}".encode(),
        hashlib.sha256,
    ).hexdigest()
    _access_tokens[token] = AccessToken(
        token=token,
        email=email,
        plan=plan,
        expires_at=int(time.time()) + 30 * 24 * 3600,
    )
    return token


def _revoke_access(email: str) -> None:
    """Revoke access for email."""
    to_remove = [k for k, v in _access_tokens.items() if v.email == email]
    for k in to_remove:
        del _access_tokens[k]


def validate_access(token: str) -> AccessToken | None:
    """Validate access token."""
    at = _access_tokens.get(token)
    if not at:
        return None
    if at.expires_at < int(time.time()):
        del _access_tokens[token]
        return None
    return at


def get_plans() -> dict:
    """Return available plans."""
    return PLANS
