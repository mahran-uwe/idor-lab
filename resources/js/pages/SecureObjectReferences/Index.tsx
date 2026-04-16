import { Head } from "@inertiajs/react";
import { index as secureObjectReferences } from "@/routes/secure-object-references";

type ReferencePattern = {
	referenceType: string;
	route: string;
	binding: string;
	policy: string;
	helps: string;
	aloneEnough: boolean;
};

type EvidenceRow = {
	endpoint: string;
	reference: string;
	expected: string;
	actual: string;
	passFail: "Pass" | "Fail" | "Pending" | "";
	proves: string;
};

type SecureObjectReferencesPageProps = {
	referencePatterns: ReferencePattern[];
	evidenceRows: EvidenceRow[];
};

function passFailClasses(passFail: EvidenceRow["passFail"]): string {
	if (passFail === "Pass") {
		return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300";
	}

	if (passFail === "Fail") {
		return "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300";
	}

	return "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300";
}

export default function SecureObjectReferencesIndex({
	referencePatterns,
	evidenceRows,
}: SecureObjectReferencesPageProps) {
	return (
		<>
			<Head title="Secure Object References" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Secure Object References
					</h1>
					<p className="text-sm text-muted-foreground">
						Secure object reference patterns and IDOR test evidence from this prototype.
					</p>
				</div>

				<div className="grid gap-4 lg:grid-cols-3">
					<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
						<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Core rule
						</p>
						<p className="mt-2 text-sm text-foreground">
							Resolve object, then authorize object.
						</p>
					</div>
					<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
						<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Defence value
						</p>
						<p className="mt-2 text-sm text-foreground">
							UUID and scoped keys reduce guessability.
						</p>
					</div>
					<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
						<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Non-negotiable
						</p>
						<p className="mt-2 text-sm text-foreground">
							Without authorisation, any key type is an IDOR risk.
						</p>
					</div>
				</div>

				<div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background/80 dark:border-sidebar-border">
					<div className="border-b border-sidebar-border/70 px-4 py-3 dark:border-sidebar-border">
						<h2 className="text-base font-semibold">Reference patterns used in the demos</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full min-w-245 text-sm">
							<thead className="bg-muted/40 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
								<tr>
									<th className="px-4 py-3">Reference</th>
									<th className="px-4 py-3">Secure route</th>
									<th className="px-4 py-3">Server retrieval</th>
									<th className="px-4 py-3">Enforcement</th>
									<th className="px-4 py-3">How it helps</th>
									<th className="px-4 py-3">Enough alone?</th>
								</tr>
							</thead>
							<tbody>
								{referencePatterns.map((row) => (
									<tr
										key={`${row.route}-${row.referenceType}`}
										className="border-t border-sidebar-border/70 align-top dark:border-sidebar-border"
									>
										<td className="px-4 py-3 font-medium text-foreground">
											{row.referenceType}
										</td>
										<td className="px-4 py-3 text-foreground">{row.route}</td>
										<td className="px-4 py-3 text-muted-foreground">{row.binding}</td>
										<td className="px-4 py-3 text-muted-foreground">{row.policy}</td>
										<td className="px-4 py-3 text-muted-foreground">{row.helps}</td>
										<td className="px-4 py-3">
											<span
												className={`rounded px-2 py-1 text-xs font-semibold uppercase ${
													row.aloneEnough
														? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
														: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
												}`}
											>
												{row.aloneEnough ? "Yes" : "No"}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background/80 dark:border-sidebar-border">
					<div className="border-b border-sidebar-border/70 px-4 py-3 dark:border-sidebar-border">
						<h2 className="text-base font-semibold">IDOR test evidence (Cross-user attempts)</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full min-w-[980px] text-sm">
							<thead className="bg-muted/40 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
								<tr>
									<th className="px-4 py-3">Endpoint</th>
									<th className="px-4 py-3">Reference</th>
									<th className="px-4 py-3">Expected</th>
									<th className="px-4 py-3">Actual</th>
									<th className="px-4 py-3">Pass/Fail</th>
									<th className="px-4 py-3">What this proves</th>
								</tr>
							</thead>
							<tbody>
								{evidenceRows.map((row) => (
									<tr
										key={`${row.endpoint}-${row.reference}`}
										className="border-t border-sidebar-border/70 align-top dark:border-sidebar-border"
									>
										<td className="px-4 py-3 font-medium text-foreground">
											{row.endpoint}
										</td>
										<td className="px-4 py-3 text-muted-foreground">{row.reference}</td>
										<td className="px-4 py-3 text-foreground">{row.expected}</td>
										<td className="px-4 py-3 text-foreground">{row.actual}</td>
										<td className="px-4 py-3">
											<span
												className={`rounded px-2 py-1 text-xs font-semibold uppercase ${passFailClasses(row.passFail)}`}
											>
												{row.passFail || "Pending"}
											</span>
										</td>
										<td className="px-4 py-3 text-muted-foreground">{row.proves}</td>
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

SecureObjectReferencesIndex.layout = {
	breadcrumbs: [
		{
			title: "Secure Object References",
			href: secureObjectReferences(),
		},
	],
};
