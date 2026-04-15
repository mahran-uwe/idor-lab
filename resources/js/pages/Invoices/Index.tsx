import { Head, usePage } from "@inertiajs/react";
import { useMemo } from "react";
import { AccessDemoColumn } from "@/components/access-demo-column";
import type { AccessDemoItem } from "@/lib/access-demo";
import { ownerFromUserId } from "@/lib/access-demo";
import { show as showInsecureInvoice } from "@/routes/insecure/invoices";
import { index as invoices } from "@/routes/invoices";
import { show as showSecureInvoice } from "@/routes/secure/invoices";

type BackendInvoice = {
	id: number;
	user_id: number;
	invoice_number: string;
	due_date: string;
	status: number;
	subtotal: string | number;
	gst: string | number;
	total: string | number;
};

interface InvoicesIndexProps {
	invoices: BackendInvoice[];
}

function mapInvoicesToDemo(
	serverInvoices: BackendInvoice[],
	mode: "idor" | "secure",
): AccessDemoItem[] {
	return serverInvoices
		.map((invoice) => {
			const owner = ownerFromUserId(invoice.user_id);

			if (!owner) {
				return null;
			}

			const invoiceUrl =
				mode === "secure"
					? showSecureInvoice.url(invoice.invoice_number)
					: showInsecureInvoice.url(invoice.invoice_number);

			return {
				id: invoice.id,
				label: `${invoice.invoice_number}`,
				owner,
				url: invoiceUrl,
				previewUrl: invoiceUrl,
			};
		})
		.filter((invoice): invoice is AccessDemoItem => invoice !== null);
}

export default function InvoicesIndex({
	invoices: serverInvoices,
}: InvoicesIndexProps) {
	const { auth } = usePage().props;
	const prioritizedOwner = ownerFromUserId(auth.user.id);

	const idorInvoices = useMemo(
		() => mapInvoicesToDemo(serverInvoices, "idor"),
		[serverInvoices],
	);
	const secureInvoices = useMemo(
		() => mapInvoicesToDemo(serverInvoices, "secure"),
		[serverInvoices],
	);

	return (
		<>
			<Head title="Invoices" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Invoice Access Demo
					</h1>
					<p className="text-sm text-muted-foreground">
						Compare insecure invoice access behavior against a secure
						implementation side by side.
					</p>
				</div>

				<div className="grid gap-4 xl:grid-cols-2">
					<AccessDemoColumn
						type="insecure"
						title="IDOR Demonstration"
						description="Direct invoice references are shown without authorisation checks."
						items={idorInvoices}
						prioritizeOwner={prioritizedOwner}
						accent="text-amber-700 dark:text-amber-300"
						resourceLabelPlural="Invoices"
						previewAreaTitle="Invoice preview area"
						previewHint="Set each link to a real invoice URL when ready."
					/>

					<AccessDemoColumn
						type="secure"
						title="Secure Implementation"
						description="Invoice access is represented with authorisation checks."
						items={secureInvoices}
						prioritizeOwner={prioritizedOwner}
						accent="text-emerald-700 dark:text-emerald-300"
						resourceLabelPlural="Invoices"
						previewAreaTitle="Invoice preview area"
						previewHint="Set each link to a real invoice URL when ready."
					/>
				</div>
			</div>
		</>
	);
}

InvoicesIndex.layout = {
	breadcrumbs: [
		{
			title: "Invoices",
			href: invoices(),
		},
	],
};
