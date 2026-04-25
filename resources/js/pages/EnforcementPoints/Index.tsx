import { Head } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
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
	Gi@{ shape: rect}

	linkStyle default stroke:#94a3b8,stroke-width:1.5px,color:#334155
	linkStyle 6,7,8,9,10,11,12,13 stroke:#6366f1,stroke-width:2px,color:#3730a3
	linkStyle 14,15,17,18 stroke:#16a34a,stroke-width:2.5px,color:#166534
	linkStyle 16 stroke:#e11d48,stroke-width:2.5px,color:#9f1239

	classDef entry fill:#f8fafc,stroke:#64748b,color:#0f172a,stroke-width:1.5px
	classDef route fill:#f8fafc,stroke:#94a3b8,color:#0f172a,stroke-width:1.5px
	classDef policy fill:#e0e7ff,stroke:#6366f1,color:#312e81,stroke-width:2px
	classDef allow fill:#dcfce7,stroke:#16a34a,color:#14532d,stroke-width:2px
	classDef deny fill:#ffe4e6,stroke:#e11d48,color:#881337,stroke-width:2px

	class A,MW1,MW2 entry
	class W1,W2,W3,A1 route
	class Gd,Gi,Pd,Pi,D policy
	class OD,OI,RD,RI allow
	class X deny
	`;

const protectedRoutes = [
	{
		route: "/secure/documents/{document}",
		channel: "Web",
		policy: "DocumentPolicy@view",
		allow: "File response",
		deny: "403 Forbidden",
	},
	{
		route: "/secure/documents/uuid/{uuid}",
		channel: "Web",
		policy: "DocumentPolicy@view",
		allow: "File response",
		deny: "403 Forbidden",
	},
	{
		route: "/secure/invoices/{invoice_number}",
		channel: "Web",
		policy: "InvoicePolicy@view",
		allow: "Invoice page response",
		deny: "403 Forbidden",
	},
	{
		route: "/api/secure/invoices/{invoice_number}",
		channel: "API",
		policy: "InvoicePolicy@view",
		allow: "JSON API response",
		deny: "403 Forbidden",
	},
] as const;

const policyCount = new Set(protectedRoutes.map((route) => route.policy)).size;

export default function EnforcementPointsIndex() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [isDiagramLoading, setIsDiagramLoading] = useState(true);
	const [diagramLoadError, setDiagramLoadError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function renderDiagram() {
			setIsDiagramLoading(true);
			setDiagramLoadError(null);

			try {
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
					setIsDiagramLoading(false);
				}
			} catch {
				if (isMounted) {
					setDiagramLoadError("Unable to load diagram.");
					setIsDiagramLoading(false);
				}
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
						Authorization flow for secure routes, policy checks, and final
						access outcomes.
					</p>
				</div>

				<div className="grid gap-3 md:grid-cols-4">
					<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
						<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Protected Routes
						</p>
						<p className="mt-2 text-2xl font-bold text-foreground">
							{protectedRoutes.length}
						</p>
					</div>
					<div className="rounded-xl border border-indigo-200/70 bg-indigo-50/60 p-4 dark:border-indigo-900 dark:bg-indigo-950/20">
						<p className="text-xs font-semibold tracking-wide text-indigo-700 uppercase dark:text-indigo-300">
							Policies Enforced
						</p>
						<p className="mt-2 text-2xl font-bold text-indigo-700 dark:text-indigo-300">
							{policyCount}
						</p>
					</div>
					<div className="rounded-xl border border-emerald-200/70 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
						<p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
							Allow Paths
						</p>
						<p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
							2
						</p>
					</div>
					<div className="rounded-xl border border-rose-200/70 bg-rose-50/60 p-4 dark:border-rose-900 dark:bg-rose-950/20">
						<p className="text-xs font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
							Deny Paths
						</p>
						<p className="mt-2 text-2xl font-bold text-rose-700 dark:text-rose-300">
							1
						</p>
					</div>
				</div>

				<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-3 dark:border-sidebar-border">
					<div className="mb-3 flex flex-wrap items-center gap-2">
						<span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Diagram Legend
						</span>
						<span className="rounded px-2 py-1 text-xs font-semibold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
							Policy check
						</span>
						<span className="rounded px-2 py-1 text-xs font-semibold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
							Allow outcome
						</span>
						<span className="rounded px-2 py-1 text-xs font-semibold uppercase bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
							Deny outcome
						</span>
					</div>

					<div className="overflow-x-auto rounded-lg bg-white p-3">
						{isDiagramLoading ? (
							<div className="flex min-h-56 min-w-225 items-center justify-center gap-3 text-sm text-slate-600">
								<div
									className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"
									role="status"
									aria-label="Loading diagram"
								/>
								{/* <span>Loading diagram...</span> */}
							</div>
						) : null}
						{diagramLoadError ? (
							<p className="min-w-225 text-sm text-rose-700">
								{diagramLoadError}
							</p>
						) : null}
						<div
							ref={containerRef}
							className={
								isDiagramLoading || diagramLoadError
									? "hidden min-w-225"
									: "min-w-225"
							}
						/>
					</div>
				</div>

				<div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background/80 dark:border-sidebar-border">
					<div className="border-b border-sidebar-border/70 px-4 py-3 dark:border-sidebar-border">
						<h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
							Route Enforcement Coverage
						</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full min-w-215 text-sm">
							<thead className="bg-muted/40 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
								<tr>
									<th className="px-4 py-3">Route</th>
									<th className="px-4 py-3">Channel</th>
									<th className="px-4 py-3">Policy / Gate</th>
									<th className="px-4 py-3">Allow</th>
									<th className="px-4 py-3">Deny</th>
								</tr>
							</thead>
							<tbody>
								{protectedRoutes.map((entry) => (
									<tr
										key={entry.route}
										className="border-t border-sidebar-border/70 align-top dark:border-sidebar-border"
									>
										<td className="px-4 py-3 font-medium text-foreground">
											{entry.route}
										</td>
										<td className="px-4 py-3 text-foreground">
											{entry.channel}
										</td>
										<td className="px-4 py-3 text-muted-foreground">
											{entry.policy}
										</td>
										<td className="px-4 py-3 text-emerald-700 dark:text-emerald-300">
											{entry.allow}
										</td>
										<td className="px-4 py-3 text-rose-700 dark:text-rose-300">
											{entry.deny}
										</td>
									</tr>
								))}
							</tbody>
						</table>
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
