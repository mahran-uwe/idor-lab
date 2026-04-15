import { Head, usePage } from "@inertiajs/react";
import { useMemo } from "react";
import { AccessDemoColumn } from "@/components/access-demo-column";
import type { AccessDemoItem } from "@/lib/access-demo";
import { ownerFromUserId } from "@/lib/access-demo";
import { index as documents } from "@/routes/documents";
import { show as showInsecureDocument } from "@/routes/insecure/documents";
import { show as showSecureDocument } from "@/routes/secure/documents";

type BackendDocument = {
	id: number;
	user_id: number;
	title: string;
};

interface DocumentsIndexProps {
	documents: BackendDocument[];
}

function mapDocumentsToDemo(
	serverDocuments: BackendDocument[],
	mode: "idor" | "secure",
): AccessDemoItem[] {
	return serverDocuments
		.map((document) => {
			const owner = ownerFromUserId(document.user_id);

			if (!owner) {
				return null;
			}

			const documentUrl =
				mode === "secure"
					? showSecureDocument.url(document.id)
					: showInsecureDocument.url(document.id);

			return {
				id: document.id,
				label: document.title,
				owner,
				url: documentUrl,
				previewUrl: documentUrl,
			};
		})
		.filter((document): document is AccessDemoItem => document !== null);
}

export default function DocumentsIndex({
	documents: serverDocuments,
}: DocumentsIndexProps) {
	const { auth } = usePage().props;
	const prioritizedOwner = ownerFromUserId(auth.user.id);

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
					<AccessDemoColumn
						type="insecure"
						title="IDOR Demonstration"
						description="Direct object references are shown without authorisation checks."
						items={idorDocuments}
						prioritizeOwner={prioritizedOwner}
						accent="text-amber-700 dark:text-amber-300"
						resourceLabelPlural="Documents"
						previewAreaTitle="PDF preview area"
						previewHint="Set each link to a real PDF URL when ready."
					/>

					<AccessDemoColumn
						type="secure"
						title="Secure Implementation"
						description="Document access is represented with authorisation checks."
						items={secureDocuments}
						prioritizeOwner={prioritizedOwner}
						accent="text-emerald-700 dark:text-emerald-300"
						resourceLabelPlural="Documents"
						previewAreaTitle="PDF preview area"
						previewHint="Set each link to a real PDF URL when ready."
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
