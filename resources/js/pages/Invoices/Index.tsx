import { Head } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { index as invoices, show as showInvoice } from "@/routes/invoices";

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

type DemoInvoice = {
	id: number;
	label: string;
	owner: "User A" | "User B";
	url: string;
	previewUrl: string;
};

function ownerFromUserId(userId: number): DemoInvoice["owner"] | null {
	if (userId === 1) {
		return "User A";
	}

	if (userId === 2) {
		return "User B";
	}

	return null;
}

function mapInvoicesToDemo(
	serverInvoices: BackendInvoice[],
	mode: "idor" | "secure",
): DemoInvoice[] {
	return serverInvoices
		.map((invoice) => {
			const owner = ownerFromUserId(invoice.user_id);

			if (!owner) {
				return null;
			}

			const invoiceUrl = showInvoice.url(invoice.id);
			const url = mode === "secure" ? `${invoiceUrl}?scope=owned` : invoiceUrl;

			return {
				id: invoice.id,
				label: `${invoice.invoice_number} • Total ${invoice.total}`,
				owner,
				url,
				previewUrl: invoiceUrl,
			};
		})
		.filter((invoice): invoice is DemoInvoice => invoice !== null);
}

function DemoColumn({
	title,
	description,
	invoices,
	accent,
}: {
	title: string;
	description: string;
	invoices: DemoInvoice[];
	accent: string;
}) {
	const [selectedId, setSelectedId] = useState<number | null>(
		invoices[0]?.id ?? null,
	);
	const [manualUrlInputValue, setManualUrlInputValue] = useState<string | null>(
		null,
	);
	const [manualPreviewUrl, setManualPreviewUrl] = useState<string | null>(null);

	const selectedInvoice = useMemo(
		() => invoices.find((invoice) => invoice.id === selectedId) ?? invoices[0],
		[invoices, selectedId],
	);

	const urlInputValue = manualUrlInputValue ?? selectedInvoice?.url ?? "";
	const activePreviewUrl =
		manualPreviewUrl ?? selectedInvoice?.previewUrl ?? "#";

	const applyUrlToPreview = () => {
		setManualPreviewUrl(urlInputValue.trim() || "#");
	};

	const groupedByOwner = useMemo(
		() => ({
			userA: invoices.filter((invoice) => invoice.owner === "User A"),
			userB: invoices.filter((invoice) => invoice.owner === "User B"),
		}),
		[invoices],
	);

	return (
		<section className="flex min-h-170 flex-col gap-4 rounded-2xl border border-sidebar-border/70 bg-background/95 p-4 shadow-sm dark:border-sidebar-border">
			<div className="space-y-1">
				<h2 className="text-xl font-semibold tracking-tight">{title}</h2>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2 rounded-xl border border-sidebar-border/70 p-3 dark:border-sidebar-border">
					<h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
						User A Invoices
					</h3>
					{groupedByOwner.userA.length > 0 ? (
						groupedByOwner.userA.map((invoice) => (
							<button
								key={invoice.id}
								type="button"
								onClick={() => {
									setSelectedId(invoice.id);
									setManualUrlInputValue(invoice.url);
									setManualPreviewUrl(invoice.previewUrl);
								}}
								className="block text-left text-sm text-foreground underline decoration-dotted underline-offset-4 hover:text-primary"
							>
								{invoice.label}
							</button>
						))
					) : (
						<p className="text-sm text-muted-foreground">No invoices.</p>
					)}
				</div>

				<div className="space-y-2 rounded-xl border border-sidebar-border/70 p-3 dark:border-sidebar-border">
					<h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
						User B Invoices
					</h3>
					{groupedByOwner.userB.length > 0 ? (
						groupedByOwner.userB.map((invoice) => (
							<button
								key={invoice.id}
								type="button"
								onClick={() => {
									setSelectedId(invoice.id);
									setManualUrlInputValue(invoice.url);
									setManualPreviewUrl(invoice.previewUrl);
								}}
								className="block text-left text-sm text-foreground underline decoration-dotted underline-offset-4 hover:text-primary"
							>
								{invoice.label}
							</button>
						))
					) : (
						<p className="text-sm text-muted-foreground">No invoices.</p>
					)}
				</div>
			</div>

			<div className="space-y-2">
				<label
					htmlFor={`${title.replace(/\s+/g, "-").toLowerCase()}-url`}
					className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
				>
					URL
				</label>
				<div className="flex items-center gap-2">
					<input
						id={`${title.replace(/\s+/g, "-").toLowerCase()}-url`}
						type="text"
						value={urlInputValue}
						onChange={(event) => {
							setManualUrlInputValue(event.target.value);
						}}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								applyUrlToPreview();
							}
						}}
						className="h-10 w-full rounded-lg border border-sidebar-border/70 bg-muted/40 px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-sidebar-border"
					/>
					<button
						type="button"
						onClick={applyUrlToPreview}
						className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 dark:border-sidebar-border"
					>
						<ArrowRight className="size-4" aria-hidden="true" />
						<span className="sr-only">Go</span>
					</button>
				</div>
			</div>

			<div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-muted/20 dark:border-sidebar-border">
				{selectedInvoice && activePreviewUrl !== "#" ? (
					<iframe
						src={activePreviewUrl}
						title={`${selectedInvoice.label} preview`}
						className="h-full min-h-80 w-full"
					/>
				) : (
					<div className="flex h-full min-h-80 items-center justify-center p-6">
						<div className="max-w-sm rounded-xl border border-dashed border-sidebar-border/70 bg-background/80 p-4 text-center dark:border-sidebar-border">
							<p className={`text-sm font-medium ${accent}`}>
								Invoice preview area
							</p>
							<p className="mt-2 text-xs text-muted-foreground">
								Selected: {selectedInvoice?.label}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Set each link to a real invoice URL when ready.
							</p>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}

export default function InvoicesIndex({
	invoices: serverInvoices,
}: InvoicesIndexProps) {
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
					<DemoColumn
						title="IDOR Demonstration"
						description="Direct invoice references are shown without ownership-based filtering."
						invoices={idorInvoices}
						accent="text-amber-700 dark:text-amber-300"
					/>

					<DemoColumn
						title="Secure Implementation"
						description="Invoice access is represented with ownership-scoped references."
						invoices={secureInvoices}
						accent="text-emerald-700 dark:text-emerald-300"
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
