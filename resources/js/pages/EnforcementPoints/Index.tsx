import { Head } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { index as enforcementPoints } from "@/routes/enforcement-points";

const diagram = `flowchart LR
 subgraph E["Enforcement layer"]
        Gd@{ label: "Authorise Document Access" }
        Gi@{ label: "Authorise Invoice Access" }
        Pd["DocumentPolicy"]
        Pi["InvoicePolicy"]
        D{"Authorised?"}
  end
    A(["Client request"]) --> MW1["Web"] & MW2["API"]
    MW1 --> W1["/secure/documents/{document}"] & W2["/secure/documents/uuid/{uuid}"] & W3["/secure/invoices/{invoice_number}"]
    MW2 --> A1["/api/secure/invoices/{invoice_number}"]
    Gd --> Pd
    Gi --> Pi
    Pd --> D
    Pi --> D
    W1 --> Gd
    W2 --> Gd
    W3 --> Gi
    A1 --> Gi
    D -- Yes --> OD["Object retrieval"] & OI["Object retrieval:<br>Invoice"]
    D -- No --> X(["Deny: 403"])
    OD --> RD(["Allow: file response"])
    OI --> RI(["Allow: Web/API response"])

    Gd@{ shape: rect}
    Gi@{ shape: rect}`;

export default function EnforcementPointsIndex() {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function renderDiagram() {
			const mermaid = (await import("mermaid")).default;

			mermaid.initialize({
				startOnLoad: false,
				securityLevel: "strict",
				theme: "neutral",
			});

			const { svg } = await mermaid.render(
				"enforcement-points-diagram",
				diagram,
			);

			if (isMounted && containerRef.current) {
				containerRef.current.innerHTML = svg;
			}
		}

		renderDiagram();

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<>
			<Head title="Enforcement Points" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Enforcement Points
					</h1>
					<p className="text-sm text-muted-foreground">
						Authorization flow for secure routes and their policy enforcement.
					</p>
				</div>

				<div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background/80 p-3 dark:border-sidebar-border">
					<div className="overflow-x-auto rounded-lg bg-white p-3">
						<div ref={containerRef} className="min-w-225" />
					</div>
				</div>
			</div>
		</>
	);
}

EnforcementPointsIndex.layout = {
	breadcrumbs: [
		{
			title: "Enforcement Points",
			href: enforcementPoints(),
		},
	],
};
