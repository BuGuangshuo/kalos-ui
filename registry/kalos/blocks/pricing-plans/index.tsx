"use client";

import { Button } from "@base-ui/react/button";
import { Collapsible } from "@base-ui/react/collapsible";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Check, ChevronDown, Eye, Folder, Minus, Users } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { IntegrationMarks } from "./integration-marks";
import "../shared/inter";
import "./styles.css";

export type Billing = "monthly" | "yearly";

export interface Plan {
  id?: string;
  name: string;
  monthly: number | null;
  yearly: number | null;
  badge?: string;
  limits?: { label: string; value: string | number; icon?: ReactNode }[];
  sync?: string;
  integrations?: { label: string; choice?: string; icons?: ReactNode };
  features?: { label: string; included: boolean }[];
  cta?: string;
  onSelect?: (billing: Billing) => void;
}

export interface PricingPlansProps {
  plans?: Plan[];
  title?: string;
  subtitle?: string;
  defaultBilling?: Billing;
  currency?: string;
  appearance?: "clean" | "classic";
  className?: string;
}

const demoFeatures = ["Unlimited dashboards", "Custom domains", "API access", "Scheduled reports", "SSO", "Dedicated onboarding"];

function demoPlan(name: string, monthly: number, yearly: number, limits: string[], sync: string, slots: number, features: boolean[], support: string): Plan {
  return {
    name, monthly, yearly, sync,
    badge: name === "Growth" ? "Popular" : undefined,
    limits: [
      { label: "Monthly visitors", value: limits[0], icon: <Eye /> },
      { label: "Seats", value: limits[1], icon: <Users /> },
      { label: "Workspaces", value: limits[2], icon: <Folder /> },
    ],
    integrations: { label: "Native sync", choice: `Choose ${slots} of 7`, icons: <IntegrationMarks /> },
    features: [
      ...demoFeatures.map((label, i) => ({ label, included: features[i] })),
      { label: support, included: true },
    ],
  };
}

const demoPlans: Plan[] = [
  demoPlan("Starter", 29, 24, ["10k", "2", "1"], "Hourly", 2, [true, false, false, true, false, false], "Email support"),
  demoPlan("Growth", 99, 79, ["100k", "10", "3"], "Every 15 min", 4, [true, true, true, true, false, false], "Chat + Email support"),
  demoPlan("Scale", 249, 199, ["1M", "Unlimited", "10"], "Real-time", 7, [true, true, true, true, false, true], "Priority support + Slack channel"),
];

function formatPrice(value: number | null, currency: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Custom";
  const digits = Number.isInteger(value) ? 0 : 2;
  const options = { minimumFractionDigits: digits, maximumFractionDigits: digits };
  if (/^[a-z]{3}$/i.test(currency)) {
    return value.toLocaleString("en-US", { ...options, style: "currency", currency });
  }
  return currency + value.toLocaleString("en-US", options);
}

const digitStrip = Array.from({ length: 10 }, (_, digit) => <span key={digit}>{digit}</span>);

function RollingPrice({ value }: { value: string }) {
  return (
    <span className="kp-price" aria-label={value}>
      {Array.from(value, (character, i) => /[0-9]/.test(character) ? (
        <span className="kp-digit" key={value.length - i} aria-hidden="true">
          <span style={{ transform: `translateY(-${Number(character) * 10}%)`, transitionDelay: `${i * 18}ms` }}>{digitStrip}</span>
        </span>
      ) : <span aria-hidden="true" key={value.length - i}>{character}</span>)}
    </span>
  );
}

function PlanCard({ plan, billing, currency, demo, appearance }: { plan: Plan; billing: Billing; currency: string; demo: boolean; appearance: "clean" | "classic" }) {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<Billing | null>(null);
  const price = formatPrice(plan[billing], currency);
  const cta = demo && selected === billing ? "Plan selected" : plan.cta ?? "Start free trial";

  const action = (<Button className="kp-cta kp-clip" title={cta} onClick={() => { if (demo) setSelected(billing); plan.onSelect?.(billing); }}>{cta}</Button>);

  return (
    <article className="kp-card" data-featured={plan.badge ? "" : undefined}>
      <div className="kp-row kp-name"><span className="kp-clip" title={plan.name}>{plan.name}</span>{plan.badge && <span className="kp-badge kp-clip" title={plan.badge}>{plan.badge}</span>}</div>
      <div className="kp-price-row"><RollingPrice value={price} />{price !== "Custom" && <span>{appearance === "classic" ? "/per month" : "per month"}</span>}</div>
      <p className="kp-billed">Billed {billing}</p>
      {appearance === "clean" && action}
      {!!plan.limits?.length && <ul className="kp-limits">{plan.limits.map(limit => (
        <li className="kp-row" key={limit.label}><span className="kp-limit-label">{limit.icon && <span aria-hidden="true">{limit.icon}</span>}<span className="kp-clip" title={limit.label}>{limit.label}</span></span><span className="kp-clip" title={String(limit.value)}>{limit.value}</span></li>
      ))}</ul>}
      {appearance === "classic" && action}
      {(plan.integrations || plan.sync || !!plan.features?.length) && (
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger className="kp-disclosure">{open ? "Hide details" : "Show details"}<ChevronDown size={12} aria-hidden="true" /></Collapsible.Trigger>
          <Collapsible.Panel className="kp-fold">
            <div className="kp-details">
              {(plan.sync || plan.integrations) && <div className="kp-row kp-integration-line"><span className="kp-eyebrow">Integrations</span><span className="kp-clip" title={plan.sync}>{plan.sync}</span></div>}
              {plan.integrations && <>
                <div className="kp-row kp-integration-sub"><span className="kp-badge kp-clip" title={plan.integrations.label}>{plan.integrations.label}</span><span className="kp-clip" title={plan.integrations.choice}>{plan.integrations.choice}</span></div>
                {plan.integrations.icons}
              </>}
              {!!plan.features?.length && <ul className="kp-features">{plan.features.map(feature => (
                <li data-missing={!feature.included ? "" : undefined} key={feature.label}>
                  {feature.included ? <Check aria-hidden="true" /> : <Minus aria-hidden="true" />}
                  <span>{feature.label}<span className="kp-sr">{feature.included ? " (included)" : " (not included)"}</span></span>
                </li>
              ))}</ul>}
            </div>
          </Collapsible.Panel>
        </Collapsible.Root>
      )}
    </article>
  );
}

export function KalosPricingPlans({
  plans = demoPlans, title = "Choose your plan", subtitle, defaultBilling = "yearly", currency = "$", appearance = "clean", className,
}: PricingPlansProps) {
  const [billing, setBilling] = useState<Billing>(defaultBilling);
  const savings = plans.reduce((largest, plan) => {
    if (typeof plan.monthly !== "number" || !Number.isFinite(plan.monthly) || plan.monthly <= 0 || typeof plan.yearly !== "number" || !Number.isFinite(plan.yearly)) return largest;
    return Math.max(largest, Math.round((1 - plan.yearly / plan.monthly) * 100));
  }, 0);
  const description = subtitle ?? (plans === demoPlans ? "Find the right plan for your team. Start with a 14-day free trial." : undefined);
  const columns = plans.length > 3 ? 2 : Math.max(plans.length, 1);

  return (
    <section data-appearance={appearance} aria-label={title} className={["kalos-pricing", className].filter(Boolean).join(" ")}>
      <header className="kp-head"><h2>{title}</h2>{description && <p>{description}</p>}</header>
      {plans.length ? <>
        <RadioGroup aria-label="Billing period" className="kp-period" value={billing} onValueChange={setBilling} data-billing={billing}>
          <span aria-hidden="true" className="kp-period-chip" />
          <Radio.Root value="monthly" className="kp-option">Monthly</Radio.Root>
          <Radio.Root value="yearly" className="kp-option">Yearly {appearance === "clean" && savings > 0 && <span className="kp-badge">−{savings}%</span>}</Radio.Root>
        </RadioGroup>
        <div className="kp-grid" style={{ "--kp-columns": columns } as CSSProperties}>
          {plans.map(plan => <PlanCard key={plan.id ?? plan.name} plan={plan} billing={billing} currency={currency} demo={plans === demoPlans} appearance={appearance} />)}
        </div>
      </> : <p className="kp-empty">No plans available.</p>}
    </section>
  );
}

export function KalosPricingPlansPreview({ appearance = "clean" }: Pick<PricingPlansProps, "appearance">) {
  return <div className="kp-preview"><div className="kp-preview-inner"><KalosPricingPlans appearance={appearance} /></div></div>;
}
