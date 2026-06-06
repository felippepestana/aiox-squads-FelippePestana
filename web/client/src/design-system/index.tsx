// Apex-Talent Design System — lightweight, token-driven React components.
// Zero heavy dependencies; styling via tokens.css + components.css.
import React from "react";
import "./tokens.css";
import "./components.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "default" | "ghost";
};
export function Button({ variant = "default", className = "", ...rest }: ButtonProps) {
  const v = variant === "primary" ? "ds-btn--primary" : variant === "ghost" ? "ds-btn--ghost" : "";
  return <button className={`ds-btn ${v} ${className}`.trim()} {...rest} />;
}

export function Card({
  title,
  children,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="ds-card">
      {title ? <h3 className="ds-card__title">{title}</h3> : null}
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="ds-field">
      <span className="ds-field__label">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="ds-input" {...props} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="ds-textarea" {...props} />;
}

type BadgeTone = "success" | "warn" | "info" | "muted";
export function Badge({ tone = "muted", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return <span className={`ds-badge ds-badge--${tone}`}>{children}</span>;
}

export interface Step {
  label: string;
}
export function Stepper({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <div className="ds-stepper">
      {steps.map((s, i) => {
        const state = i < current ? "ds-step--done" : i === current ? "ds-step--active" : "";
        return (
          <div key={s.label} className={`ds-step ${state}`.trim()}>
            <span className="ds-step__num">{i < current ? "✓" : i + 1}</span>
            {s.label}
          </div>
        );
      })}
    </div>
  );
}
