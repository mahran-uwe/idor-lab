import { Head, usePage } from "@inertiajs/react";
import { useMemo } from "react";
import { AccessDemoColumn } from "@/components/access-demo-column";
import type { AccessDemoItem } from "@/lib/access-demo";
import { ownerFromUserId } from "@/lib/access-demo";
import { index as api } from "@/routes/api";

type BackendInvoice = {
	id: number;
	user_id: number;
	invoice_number: string;
	due_date: string;
	status: number;
	total: string | number;
};

interface InvoicesApiProps {
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

			const encodedInvoiceNumber = encodeURIComponent(invoice.invoice_number);
			const apiUrl =
				mode === "secure"
					? `/api/secure/invoices/${encodedInvoiceNumber}`
					: `/api/insecure/invoices/${encodedInvoiceNumber}`;

			return {
				id: invoice.id,
				label: `${invoice.invoice_number}`,
				owner,
				url: apiUrl,
				previewUrl: apiUrl,
			};
		})
		.filter((invoice): invoice is AccessDemoItem => invoice !== null);
}

export default function InvoicesApi({
	invoices: serverInvoices,
}: InvoicesApiProps) {
	const { auth } = usePage().props;
	const prioritizedOwner = ownerFromUserId(auth.user.id);

	const insecureApiInvoices = useMemo(
		() => mapInvoicesToDemo(serverInvoices, "idor"),
		[serverInvoices],
	);
	const secureApiInvoices = useMemo(
		() => mapInvoicesToDemo(serverInvoices, "secure"),
		[serverInvoices],
	);

	return (
		<>
			<Head title="API Demo" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">API Demo</h1>
					<p className="text-sm text-muted-foreground">
						Compare insecure and secure invoice API endpoints. The secure
						endpoint enforces authorization.
					</p>
				</div>

				<div className="grid gap-4 xl:grid-cols-2">
					<AccessDemoColumn
						type="insecure"
						title="Insecure API"
						description="Returns invoice JSON by invoice number with no ownership check."
						items={insecureApiInvoices}
						prioritizeOwner={prioritizedOwner}
						accent="text-amber-700 dark:text-amber-300"
						resourceLabelPlural="Invoices"
						previewAreaTitle="JSON response preview"
						previewHint="Try another user's invoice number to observe the IDOR in the insecure API."
					/>

					<AccessDemoColumn
						type="secure"
						title="Secure API"
						description="Returns invoice JSON only after policy-based authorization checks."
						items={secureApiInvoices}
						prioritizeOwner={prioritizedOwner}
						accent="text-emerald-700 dark:text-emerald-300"
						resourceLabelPlural="Invoices"
						previewAreaTitle="JSON response preview"
						previewHint="Cross-user invoice numbers are blocked with a forbidden response."
					/>
				</div>
			</div>
		</>
	);
}

InvoicesApi.layout = {
	breadcrumbs: [
		{
			title: "Invoice API Demo",
			href: api(),
		},
	],
};
