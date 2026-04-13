import { Head, Link } from "@inertiajs/react";
import { index as invoices } from "@/routes/invoices";

type InvoiceItem = {
	id: number;
	product_id: number;
	quantity: number;
	unit_price: string | number;
	line_total: string | number;
	product?: {
		id: number;
		name: string;
	};
};

type Invoice = {
	id: number;
	user_id: number;
	invoice_number: string;
	due_date: string;
	status: number;
	subtotal: string | number;
	gst: string | number;
	total: string | number;
	items: InvoiceItem[];
};

interface InvoiceShowProps {
	invoice: Invoice;
}

function formatCurrency(amount: string | number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	}).format(Number(amount));
}

function formatDate(date: string): string {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	}).format(new Date(date));
}

function statusLabel(status: number): string {
	if (status === 1) {
		return "Paid";
	}

	if (status === 2) {
		return "Overdue";
	}

	return "Unpaid";
}

function statusClasses(status: number): string {
	if (status === 1) {
		return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
	}

	if (status === 2) {
		return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
	}

	return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
}

export default function InvoicesShow({ invoice }: InvoiceShowProps) {
	return (
		<>
			<Head title={`Invoice ${invoice.invoice_number}`} />

			<div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
				<div className="flex flex-col gap-4 rounded-2xl border border-sidebar-border/70 bg-background p-5 shadow-sm md:flex-row md:items-start md:justify-between dark:border-sidebar-border">
					<div>
						<p className="text-sm font-medium text-muted-foreground">Invoice</p>
						<h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
							{invoice.invoice_number}
						</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Detailed billing summary and line items.
						</p>
					</div>

					<div className="flex flex-col items-start gap-3 md:items-end">
						<span
							className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(invoice.status)}`}
						>
							{statusLabel(invoice.status)}
						</span>
						<Link
							href={invoices()}
							className="inline-flex items-center rounded-lg border border-sidebar-border/70 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/60 dark:border-sidebar-border"
						>
							Back to Invoices
						</Link>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
					<section className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-background shadow-sm dark:border-sidebar-border">
						<div className="border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
							<h2 className="text-base font-semibold">Line Items</h2>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full min-w-140 text-left text-sm">
								<thead className="bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
									<tr>
										<th className="px-5 py-3 font-semibold">Item</th>
										<th className="px-5 py-3 font-semibold">Qty</th>
										<th className="px-5 py-3 font-semibold">Unit Price</th>
										<th className="px-5 py-3 font-semibold">Line Total</th>
									</tr>
								</thead>
								<tbody>
									{invoice.items.map((item) => (
										<tr
											key={item.id}
											className="border-t border-sidebar-border/60 dark:border-sidebar-border"
										>
											<td className="px-5 py-3 font-medium">
												{item.product?.name ?? `Product #${item.product_id}`}
											</td>
											<td className="px-5 py-3">{item.quantity}</td>
											<td className="px-5 py-3">
												{formatCurrency(item.unit_price)}
											</td>
											<td className="px-5 py-3 font-medium">
												{formatCurrency(item.line_total)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</section>

					<aside className="space-y-4">
						<div className="rounded-2xl border border-sidebar-border/70 bg-background p-5 shadow-sm dark:border-sidebar-border">
							<h2 className="text-base font-semibold">Invoice Summary</h2>
							<dl className="mt-4 space-y-3 text-sm">
								<div className="flex items-center justify-between">
									<dt className="text-muted-foreground">Invoice #</dt>
									<dd className="font-medium">{invoice.invoice_number}</dd>
								</div>
								<div className="flex items-center justify-between">
									<dt className="text-muted-foreground">Due Date</dt>
									<dd className="font-medium">
										{formatDate(invoice.due_date)}
									</dd>
								</div>
								<div className="flex items-center justify-between">
									<dt className="text-muted-foreground">Customer Ref</dt>
									<dd className="font-medium">User #{invoice.user_id}</dd>
								</div>
							</dl>
						</div>

						<div className="rounded-2xl border border-sidebar-border/70 bg-background p-5 shadow-sm dark:border-sidebar-border">
							<h2 className="text-base font-semibold">Totals</h2>
							<dl className="mt-4 space-y-3 text-sm">
								<div className="flex items-center justify-between">
									<dt className="text-muted-foreground">Subtotal</dt>
									<dd className="font-medium">
										{formatCurrency(invoice.subtotal)}
									</dd>
								</div>
								<div className="flex items-center justify-between">
									<dt className="text-muted-foreground">GST</dt>
									<dd className="font-medium">{formatCurrency(invoice.gst)}</dd>
								</div>
								<div className="mt-3 border-t border-sidebar-border/70 pt-3 text-base dark:border-sidebar-border">
									<div className="flex items-center justify-between">
										<dt className="font-semibold">Total</dt>
										<dd className="font-semibold">
											{formatCurrency(invoice.total)}
										</dd>
									</div>
								</div>
							</dl>
						</div>
					</aside>
				</div>
			</div>
		</>
	);
}

InvoicesShow.layout = {
	breadcrumbs: [],
};
