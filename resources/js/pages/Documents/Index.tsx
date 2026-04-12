import { Head } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { index as documents, show as showDocument } from "@/routes/documents";

type BackendDocument = {
	id: number;
	user_id: number;
	title: string;
};

interface DocumentsIndexProps {
	documents: BackendDocument[];
}

type DemoDocument = {
	id: number;
	label: string;
	owner: "User A" | "User B";
	url: string;
	previewUrl: string;
};

function ownerFromUserId(userId: number): DemoDocument["owner"] | null {
	if (userId === 1) {
		return "User A";
	}

	if (userId === 2) {
		return "User B";
	}

	return null;
}

function mapDocumentsToDemo(
	serverDocuments: BackendDocument[],
	mode: "idor" | "secure",
): DemoDocument[] {
	return serverDocuments
		.map((document) => {
			const owner = ownerFromUserId(document.user_id);

			if (!owner) {
				return null;
			}

			const documentUrl = showDocument.url(document.id);
			const url =
				mode === "secure" ? `${documentUrl}?scope=owned` : documentUrl;

			return {
				id: document.id,
				label: document.title,
				owner,
				url,
				previewUrl: documentUrl,
			};
		})
		.filter((document): document is DemoDocument => document !== null);
}

function DemoColumn({
	title,
	description,
	docs,
	accent,
}: {
	title: string;
	description: string;
	docs: DemoDocument[];
	accent: string;
}) {
	const [selectedId, setSelectedId] = useState<number | null>(
		docs[0]?.id ?? null,
	);
	const [manualUrlInputValue, setManualUrlInputValue] = useState<string | null>(
		null,
	);
	const [manualPreviewUrl, setManualPreviewUrl] = useState<string | null>(null);

	const selectedDocument = useMemo(
		() => docs.find((doc) => doc.id === selectedId) ?? docs[0],
		[docs, selectedId],
	);

	const urlInputValue = manualUrlInputValue ?? selectedDocument?.url ?? "";
	const activePreviewUrl =
		manualPreviewUrl ?? selectedDocument?.previewUrl ?? "#";

	const groupedByOwner = useMemo(
		() => ({
			userA: docs.filter((doc) => doc.owner === "User A"),
			userB: docs.filter((doc) => doc.owner === "User B"),
		}),
		[docs],
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
						User A Documents
					</h3>
					{groupedByOwner.userA.length > 0 ? (
						groupedByOwner.userA.map((doc) => (
							<button
								key={doc.id}
								type="button"
								onClick={() => {
									setSelectedId(doc.id);
									setManualUrlInputValue(doc.url);
									setManualPreviewUrl(doc.previewUrl);
								}}
								className="block text-left text-sm text-foreground underline decoration-dotted underline-offset-4 hover:text-primary"
							>
								{doc.label}
							</button>
						))
					) : (
						<p className="text-sm text-muted-foreground">No documents.</p>
					)}
				</div>

				<div className="space-y-2 rounded-xl border border-sidebar-border/70 p-3 dark:border-sidebar-border">
					<h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
						User B Documents
					</h3>
					{groupedByOwner.userB.length > 0 ? (
						groupedByOwner.userB.map((doc) => (
							<button
								key={doc.id}
								type="button"
								onClick={() => {
									setSelectedId(doc.id);
									setManualUrlInputValue(doc.url);
									setManualPreviewUrl(doc.previewUrl);
								}}
								className="block text-left text-sm text-foreground underline decoration-dotted underline-offset-4 hover:text-primary"
							>
								{doc.label}
							</button>
						))
					) : (
						<p className="text-sm text-muted-foreground">No documents.</p>
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
						className="h-10 w-full rounded-lg border border-sidebar-border/70 bg-muted/40 px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-sidebar-border"
					/>
					<button
						type="button"
						onClick={() => {
							setManualPreviewUrl(urlInputValue.trim() || "#");
						}}
						className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/70 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 dark:border-sidebar-border"
					>
						<ArrowRight className="size-4" aria-hidden="true" />
						<span className="sr-only">Go</span>
					</button>
				</div>
			</div>

			<div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-muted/20 dark:border-sidebar-border">
				{selectedDocument && activePreviewUrl !== "#" ? (
					<iframe
						src={activePreviewUrl}
						title={`${selectedDocument.label} preview`}
						className="h-full min-h-80 w-full"
					/>
				) : (
					<div className="flex h-full min-h-80 items-center justify-center p-6">
						<div className="max-w-sm rounded-xl border border-dashed border-sidebar-border/70 bg-background/80 p-4 text-center dark:border-sidebar-border">
							<p className={`text-sm font-medium ${accent}`}>
								PDF preview area
							</p>
							<p className="mt-2 text-xs text-muted-foreground">
								Selected: {selectedDocument?.label}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Set each link to a real PDF URL when ready.
							</p>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}

export default function DocumentsIndex({
	documents: serverDocuments,
}: DocumentsIndexProps) {
	const idorDocuments = useMemo(
		() => mapDocumentsToDemo(serverDocuments, "idor"),
		[serverDocuments],
	);
	const secureDocuments = useMemo(
		() => mapDocumentsToDemo(serverDocuments, "secure"),
		[serverDocuments],
	);

	return (
		<>
			<Head title="Documents" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Document Access Demo
					</h1>
					<p className="text-sm text-muted-foreground">
						Compare insecure object access behavior against a secure
						implementation side by side.
					</p>
				</div>

				<div className="grid gap-4 xl:grid-cols-2">
					<DemoColumn
						title="IDOR Demonstration"
						description="Direct object references are shown without ownership-based filtering."
						docs={idorDocuments}
						accent="text-amber-700 dark:text-amber-300"
					/>

					<DemoColumn
						title="Secure Implementation"
						description="Document access is represented with ownership-scoped references."
						docs={secureDocuments}
						accent="text-emerald-700 dark:text-emerald-300"
					/>
				</div>
			</div>
		</>
	);
}

DocumentsIndex.layout = {
	breadcrumbs: [
		{
			title: "Documents",
			href: documents(),
		},
	],
};
