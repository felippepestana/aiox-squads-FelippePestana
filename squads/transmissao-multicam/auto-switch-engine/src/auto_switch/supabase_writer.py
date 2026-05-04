"""Optional Supabase switch-log writer for the F6 auto-switch engine.

Writes to the ``switch_logs`` table using the service-role key so RLS
policies do not block the insert.  If the ``supabase`` package is not
installed or the env vars are missing the writer degrades silently so the
engine keeps running in offline mode.
"""

from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    pass

LOG = logging.getLogger("tx-auto-switch.supabase")


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class SupabaseWriter:
    """Thin wrapper around the Supabase Python client for switch-log inserts."""

    def __init__(self) -> None:
        self._client = None
        self._enabled = False

        url = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
        key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

        if not url or not key:
            LOG.debug("Supabase env vars not set — switch-log persistence disabled.")
            return

        try:
            from supabase import create_client  # type: ignore[import]

            self._client = create_client(url, key)
            self._enabled = True
            LOG.info("Supabase writer initialised (url=%s…)", url[:40])
        except ImportError:
            LOG.warning(
                "supabase package not installed. "
                "Run: pip install supabase[async]  to enable persistent switch logs."
            )

    @property
    def enabled(self) -> bool:
        return self._enabled

    def log_switch(
        self,
        *,
        from_scene: str | None,
        to_scene: str,
        trigger: str,
        latency_ms: int | None = None,
        event_id: str | None = None,
        operator_name: str | None = None,
    ) -> None:
        """Insert a row into ``switch_logs``.  Failures are logged, not raised."""
        if not self._enabled or self._client is None:
            return

        row: dict = {
            "switched_at": _now_iso(),
            "from_scene": from_scene,
            "to_scene": to_scene,
            "trigger": trigger,
        }
        if latency_ms is not None:
            row["latency_ms"] = latency_ms
        if event_id is not None:
            row["event_id"] = event_id
        if operator_name is not None:
            row["operator_name"] = operator_name

        try:
            self._client.table("switch_logs").insert(row).execute()
        except Exception:  # noqa: BLE001
            LOG.exception("Failed to write switch log to Supabase")


# Module-level singleton — created once at engine startup.
_writer: SupabaseWriter | None = None


def get_writer() -> SupabaseWriter:
    global _writer  # noqa: PLW0603
    if _writer is None:
        _writer = SupabaseWriter()
    return _writer
