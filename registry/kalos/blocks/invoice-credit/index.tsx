"use client";

import { Button } from "@base-ui/react/button";
import { Checkbox } from "@base-ui/react/checkbox";
import { Tabs } from "@base-ui/react/tabs";
import { Check, Download, Undo2 } from "lucide-react";
import { Fragment, useRef, useState, type ReactNode } from "react";
import "../shared/inter";
import "./styles.css";

type Sheet = "invoice" | "credit";
export interface InvoiceLine { id: string; name: string; qty: number; rate: number; tax: number; group?: string }
export interface InvoiceParty { name: string; lines: string[] }
export interface InvoiceCreditProps {
  seller?: InvoiceParty;
  buyer?: InvoiceParty;
  invoiceNo?: string;
  creditNo?: string;
  invoiceDate?: string;
  dueDate?: string;
  period?: string;
  lines?: InvoiceLine[];
  currency?: string;
  onIssue?: (credits: Record<string, number>, total: number) => void;
  payHref?: string;
  onDownload?: (sheet: Sheet) => void;
  appearance?: "clean" | "classic";
  className?: string;
}

const demoLines: InvoiceLine[] = [
  { id: "plan", name: "Growth plan", qty: 1, rate: 1250, tax: .2 },
  { id: "seats", name: "Extra seats", qty: 12, rate: 40, tax: .2 },
  { id: "api", name: "API calls (per 1k)", qty: 18420, rate: .42, tax: .2, group: "Metered usage" },
];
const demoSeller = { name: "Lumen Labs, Inc.", lines: ["48 Harbour Street", "Bristol", "BS1 4RN", "United Kingdom"] };
const demoBuyer = { name: "Northwind Logistics GmbH", lines: ["Speicherstraße 12", "Hamburg", "20457", "Germany"] };

function moneyFormat(currency: string) {
  const isCode = /^[a-z]{3}$/i.test(currency);
  const format = new Intl.NumberFormat("en-US", isCode ? { style: "currency", currency } : { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const precision = format.resolvedOptions().maximumFractionDigits ?? 2;
  const numbers = new Intl.NumberFormat("en-US", { minimumFractionDigits: precision, maximumFractionDigits: precision });
  const code = isCode ? currency.toUpperCase() : ({ "$": "USD", "£": "GBP", "€": "EUR", "¥": "JPY" } as Record<string,string>)[currency];
  return {
    code, precision, symbol: isCode ? format.formatToParts(0).find(part => part.type === "currency")?.value ?? currency : currency,
    number: (n: number) => numbers.format(n),
    round: (n: number) => Math.round((n + Number.EPSILON) * 10 ** precision) / 10 ** precision,
    money: (n: number) => isCode ? format.format(n) : `${n < 0 ? "-" : ""}${currency}${numbers.format(Math.abs(n))}`,
  };
}

function valid(n: number) { return Number.isFinite(n) ? n : 0; }
function clampCredit(amount: number, total: number) {
  return Math.max(Math.min(total, 0), Math.min(Math.max(total, 0), amount));
}

function Party({ party, label }: { party: InvoiceParty; label: string }) {
  return <div><h3 className="ki-label">{label}</h3><strong>{party.name}</strong>{party.lines.map((line,i) => <p key={i}>{line}</p>)}</div>;
}

function Terms({ fields }: { fields: [string, ReactNode][] }) {
  return <section className="ki-terms"><h3 className="ki-label">Terms</h3><dl>{fields.map(([label, value]) => value ? <div key={label}><dt>{label}</dt><dd>{value}</dd></div> : null)}</dl></section>;
}

function SheetHead({ title, brand, children }: { title: string; brand: string; children: ReactNode }) {
  return <header className="ki-head"><div><h2>{title}</h2><div className="ki-sub">{children}</div></div><div className="ki-brand"><i aria-hidden="true" />{brand}</div></header>;
}

function CreditInput({ amount, total, name, disabled, format, onCommit }: {
  amount: number; total: number; name: string; disabled: boolean; format: ReturnType<typeof moneyFormat>; onCommit: (value: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const canceled = useRef(false);
  const display = draft ?? format.number(amount);
  return (
    <label className="ki-field" data-disabled={disabled ? "" : undefined}>
      <span aria-hidden="true">{format.symbol}</span>
      <input aria-label={`Credit amount for ${name}`} type="text" inputMode="decimal" disabled={disabled} value={display}
        style={{ width: `${Math.min(15, Math.max(1, display.length + .35))}ch` }}
        onFocus={event => { canceled.current = false; event.currentTarget.select(); }}
        onChange={event => setDraft(event.target.value)}
        onBlur={() => {
          if (draft !== null && !canceled.current) {
            const numeric = Number(draft.replace(/,/g, "").trim());
            if (Number.isFinite(numeric)) onCommit(format.round(clampCredit(numeric, total)));
          }
          setDraft(null);
        }}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === "Escape") {
            event.preventDefault();
            canceled.current = event.key === "Escape";
            event.currentTarget.blur();
          }
        }}
      />
    </label>
  );
}

function InvoiceDocument({
  seller = demoSeller, buyer = demoBuyer, invoiceNo = "INV-2041", creditNo = "CN-0117", invoiceDate = "1 Oct 2026",
  dueDate = "31 Oct 2026", period = "1 Sep – 30 Sep 2026", lines = demoLines, currency = "$", onIssue,
  payHref, onDownload, appearance = "clean", className,
}: InvoiceCreditProps) {
  const [sheet, setSheet] = useState<Sheet>("invoice");
  const [issued, setIssued] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState(false);
  const [edits, setEdits] = useState<Record<string, { selected?: boolean; amount?: number }>>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const invoiceTab = useRef<HTMLButtonElement>(null);
  const creditTab = useRef<HTMLButtonElement>(null);
  const format = moneyFormat(currency);
  const rows = lines.map(line => {
    const total = format.round(valid(line.qty) * valid(line.rate));
    const selected = edits[line.id]?.selected ?? true;
    return { ...line, total, selected, amount: clampCredit(edits[line.id]?.amount ?? total, total) };
  });
  const subtotal = format.round(rows.reduce((sum, row) => sum + row.total, 0));
  const tax = format.round(rows.reduce((sum, row) => sum + row.total * valid(row.tax), 0));
  const credits = rows.filter(row => row.selected);
  const creditSubtotal = format.round(credits.reduce((sum, row) => sum + row.amount, 0));
  const creditTax = format.round(credits.reduce((sum, row) => sum + row.amount * valid(row.tax), 0));
  const creditTotal = format.round(creditSubtotal + creditTax);

  function switchSheet(value: Sheet) {
    setSheet(value);
    (value === "invoice" ? invoiceTab : creditTab).current?.focus({ preventScroll: true });
  }

  function updateLine(id: string, change: { selected?: boolean; amount?: number }) {
    setEdits(current => ({ ...current, [id]: { ...current[id], ...change } }));
  }

  function download() {
    if (onDownload) { onDownload(sheet); return; }
    const root = rootRef.current;
    if (!root) return;
    root.dataset.printing = "";
    try { window.print(); } finally { delete root.dataset.printing; }
  }

  return (
    <Tabs.Root ref={rootRef} className={["kalos-invoice",className].filter(Boolean).join(" ")} data-appearance={appearance}
      value={sheet} onValueChange={value => setSheet(value as Sheet)}>
      <div className="ki-bar">
        <Tabs.List className="ki-tabs" aria-label="Document" activateOnFocus>
          <Tabs.Indicator className="ki-tab-chip" />
          <Tabs.Tab value="invoice" ref={invoiceTab}>Invoice</Tabs.Tab><Tabs.Tab value="credit" ref={creditTab}>Credit note</Tabs.Tab>
        </Tabs.List>
        <div className="ki-actions">
          <Button className="ki-btn" onClick={download}><Download />PDF</Button>
          {sheet === "invoice" && <Button className="ki-btn" onClick={() => switchSheet("credit")}><Undo2 />Credit invoice</Button>}
        </div>
      </div>
      <div className="ki-stack">
        <Tabs.Panel value="invoice" keepMounted hidden={false} className="ki-sheet" data-front={sheet === "invoice"} aria-hidden={sheet !== "invoice"} tabIndex={-1}>
          <SheetHead title={format.money(subtotal + tax)} brand={seller.name}>
            {dueDate && <span>Due {dueDate}</span>}
            {payHref ? <a className="ki-link" href={payHref}>Pay online</a> : <Button className="ki-link" onClick={() => setPaymentNotice(true)}>Pay online</Button>}
            {paymentNotice && <span role="status">Demo invoice · no payment required</span>}
          </SheetHead>
          <div className="ki-parties"><Party party={seller} label="From" /><Party party={buyer} label="To" /></div>
          <Terms fields={[
            ["Invoice no", invoiceNo && <span className="ki-ref">{invoiceNo}</span>], ["Invoice date", invoiceDate], ["Due date", dueDate], ["Billing period", period],
          ]} />
          <table className="ki-items" aria-label="Invoice items">
            <thead><tr><th>Name</th><th>Qty</th><th className="ki-extra">Rate</th><th className="ki-extra">Tax</th><th>Price</th></tr></thead>
            <tbody>{rows.map((row,i) => (
              <Fragment key={row.id}>
                {row.group && row.group !== rows[i-1]?.group && <tr className="ki-group"><th colSpan={5} scope="rowgroup">{row.group}</th></tr>}
                <tr><td className={row.group ? "ki-nested" : undefined}>{row.name}</td><td>{valid(row.qty).toLocaleString("en-US")}</td><td className="ki-extra">{Number.isFinite(row.rate) ? format.money(row.rate) : "—"}</td>
                  <td className="ki-extra">{Number.isFinite(row.tax) ? `${Number((row.tax * 100).toFixed(3))}%` : "—"}</td><td>{format.money(row.total)}</td></tr>
              </Fragment>
            ))}</tbody>
          </table>
          <div className="ki-totals"><div><span>Subtotal</span>{format.money(subtotal)}</div><div><span>Tax</span>{format.money(tax)}</div><div className="ki-total"><span>Total</span>{format.money(subtotal + tax)}</div></div>
        </Tabs.Panel>
        <Tabs.Panel value="credit" keepMounted hidden={false} className="ki-sheet" data-front={sheet === "credit"} aria-hidden={sheet !== "credit"} tabIndex={-1}>
          <SheetHead title="Credit note" brand={seller.name}>
            <span>{format.money(creditTotal)} credited{invoiceDate && ` on ${invoiceDate}`}</span>{issued && <span className="ki-issued" role="status">Issued</span>}
          </SheetHead>
          <Terms fields={[
            ["Credit note no", creditNo && <span className="ki-ref">{creditNo}</span>],
            ["Related invoice", invoiceNo && <Button className="ki-link" onClick={() => switchSheet("invoice")}>{invoiceNo}</Button>],
            ["Billing period", period], ["Date of issue", invoiceDate],
          ]} />
          <section className="ki-credits">
            <h3 className="ki-label">Lines to credit</h3>
            <div className="ki-tray">
            <div className="ki-credit-row ki-credit-columns"><span>Name</span><span>Total</span><span>Credit amount</span></div>
            {rows.map(row => (
              <div key={row.id} className="ki-credit-row" data-deselected={!row.selected || undefined}>
                <label className="ki-pick">
                  <Checkbox.Root className="ki-check" aria-label={`Credit ${row.name}`} checked={row.selected} disabled={issued}
                    onCheckedChange={selected => updateLine(row.id, { selected })}>
                    <Checkbox.Indicator><Check aria-hidden="true" /></Checkbox.Indicator>
                  </Checkbox.Root><span>{row.name}</span>
                </label>
                <span className="ki-line-total">{format.money(row.total)}</span>
                <CreditInput amount={row.selected ? row.amount : 0} name={row.name} total={row.total} format={format}
                  disabled={issued || !row.selected} onCommit={amount => updateLine(row.id, { amount })} />
              </div>
            ))}
            </div>
          </section>
          <div className="ki-totals"><div><span>Subtotal</span>{format.money(creditSubtotal)}</div><div><span>Tax</span>{format.money(creditTax)}</div>
            <div className="ki-total"><span>Adjustment total</span>{format.money(-creditTotal)}</div>
            <div className="ki-applied"><span>Applied to invoice</span>{format.money(-creditTotal)} {format.code}</div>
          </div>
          <footer className="ki-footer"><Button className="ki-btn" data-primary={!issued || undefined} disabled={!issued && creditTotal <= 0}
            onClick={() => {
              if (!issued) onIssue?.(Object.fromEntries(credits.map(row => [row.id, row.amount])), creditTotal);
              setIssued(!issued);
            }}>{issued ? "Edit credit note" : "Issue credit note"}</Button></footer>
        </Tabs.Panel>
      </div>
    </Tabs.Root>
  );
}

export function KalosInvoiceCredit(props: InvoiceCreditProps) {
  return <InvoiceDocument key={JSON.stringify([props.invoiceNo, props.creditNo, props.currency])} {...props} />;
}

export function KalosInvoiceCreditPreview({ appearance = "clean" }: Pick<InvoiceCreditProps, "appearance">) {
  return <div className="ki-preview"><div className="ki-preview-inner"><KalosInvoiceCredit appearance={appearance} /></div></div>;
}
