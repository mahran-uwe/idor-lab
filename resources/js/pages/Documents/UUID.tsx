import { Head, usePage } from "@inertiajs/react";
import { useMemo } from "react";
import { AccessDemoColumn } from "@/components/access-demo-column";
import type { AccessDemoItem } from "@/lib/access-demo";
import { ownerFromUserId } from "@/lib/access-demo";
import { index as uuid } from "@/routes/uuid";
import { show as showInsecureUUID } from "@/routes/insecure/uuid";
import { show as showSecureUUID } from "@/routes/secure/uuid";

type BackendDocument = {
	uuid: string;
	user_id: number;
	title: string;
};

interface UUIDIndexProps {
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
					? showSecureUUID.url(document.uuid)
					: showInsecureUUID.url(document.uuid);

			return {
				id: document.uuid,
				label: document.title,
				owner,
				url: documentUrl,
				previewUrl: documentUrl,
			};
		})
		.filter((document): document is AccessDemoItem => document !== null);
}

export default function UUIDIndex({
	documents: serverDocuments,
}: UUIDIndexProps) {
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
			<Head title="UUID Access Demo" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						UUID Access Demo
					</h1>
					<p className="text-sm text-muted-foreground">
						Demonstrates that UUIDs alone is insufficient
						to prevent IDOR attacks. Security through obscurity fails when
						authorization checks are not enforced on the server.
					</p>
				</div>

				<div className="grid gap-4 xl:grid-cols-2">
					<AccessDemoColumn
						type="insecure"
						title="IDOR with UUID"
						description="Using UUIDs without authorization checks. The server returns any document when given a valid UUID, regardless of ownership."
						items={idorDocuments}
						prioritizeOwner={prioritizedOwner}
						accent="text-amber-700 dark:text-amber-300"
						resourceLabelPlural="Documents"
						previewAreaTitle="PDF preview area"
						previewHint="Try accessing other users' documents by their UUID—the insecure endpoint will return them."
					/>

					<AccessDemoColumn
						type="secure"
						title="Secure with UUID"
						description="Using UUIDs with proper authorization checks. The server verifies ownership before returning the document."
						items={secureDocuments}
						prioritizeOwner={prioritizedOwner}
						accent="text-emerald-700 dark:text-emerald-300"
						resourceLabelPlural="Documents"
						previewAreaTitle="PDF preview area"
						previewHint="Only documents you own will load. Attempting to access other users' UUIDs will fail securely."
					/>
				</div>
			</div>
		</>
	);
}

UUIDIndex.layout = {
	breadcrumbs: [
		{
			title: "UUID Demo",
			href: uuid(),
		},
	],
};
