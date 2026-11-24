export const blockDoc = {
  slug: "invoice-credit",
  english: "Invoice & Credit Note",
  title: "发票与贷项通知单",
  description: "在层叠的发票和贷项通知单之间切换。逐项选择抵扣内容、调整金额并核对税额，签发后可重新编辑。",
  usage: `"use client";

import { KalosInvoiceCredit } from "@/components/blocks/invoice-credit";

export function Billing() {
  return (
    <KalosInvoiceCredit
      invoiceNo="INV-2041"
      creditNo="CN-0117"
      currency="USD"
      lines={[
        { id: "plan", name: "Growth plan", qty: 1, rate: 1250, tax: 0.2 },
        { id: "api", name: "API calls", qty: 120, rate: 0.42, tax: 0.2, group: "Metered usage" },
      ]}
      onIssue={(credits, total) => console.log(credits, total)}
    />
  );
}`,
  props: [
    ["seller / buyer", "{ name: string; lines: string[] }", "内置账单双方", "开票方和付款方的名称与多行地址。"],
    ["invoiceNo / creditNo", "string", "INV-2041 / CN-0117", "发票号码与关联贷项单号码。"],
    ["invoiceDate / dueDate / period", "string", "内置演示日期", "开票日、到期日与账期。传空字符串可隐藏相应条目。"],
    ["lines", "InvoiceLine[]", "内置三行明细", "每行包含唯一 id、name、qty、rate、tax，可选 group。税率用小数表示，负单价可用于折扣。"],
    ["currency", "string", '"$"', "金额前缀或 ISO 4217 代码。传入代码时使用相应币种的精度。"],
    ["onIssue", "(credits: Record<string, number>, total: number) => void", "—", "签发时接收所选明细 ID 对应的税前抵扣额，以及含税抵扣总额。"],
    ["payHref", "string", "—", "在线付款地址。未提供地址时，演示按钮显示本地说明。"],
    ["onDownload", '(sheet: "invoice" | "credit") => void', "浏览器打印", "接入 PDF 下载服务。默认打开浏览器打印窗口，可另存当前单据为 PDF。"],
    ["appearance", '"clean" | "classic"', '"clean"', "切换单据、表格和金额输入区的外观。"],
    ["className", "string", "—", "附加到单据容器的类名。"],
  ],
  keyboard: [
    ["Tab", "在文档切换器、操作按钮、勾选框和金额输入之间移动。"],
    ["← / → / Home / End", "在切换器内切换或跳到首尾文档。"],
    ["Space", "勾选或取消抵扣明细。"],
    ["Enter / Esc", "在金额输入框中确认修改或恢复输入前的金额。"],
  ],
} as const;
