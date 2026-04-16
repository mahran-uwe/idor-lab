import { Head } from "@inertiajs/react";
import { index as idorTestTemplate } from "@/routes/idor-test-template";

type IdorTemplateRow = {
	testId: string;
	endpoint: string;
	userRole: string;
	object: string;
	expectedResult: string;
	actualResult: string;
	passFail: "Pass" | "Fail" | "Pending" | "";
	severity: string;
	evidenceNotes: string;
};

type IdorTestTemplatePageProps = {
	rows: IdorTemplateRow[];
};

function passFailClasses(passFail: IdorTemplateRow["passFail"]): string {
	if (passFail === "Pass") {
		return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300";
	}

	if (passFail === "Fail") {
		return "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300";
	}

	return "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300";
}

function severityClasses(severity: string): string {
	switch (severity.toLowerCase()) {
		case "critical":
			return "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300";
		case "high":
			return "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300";
		case "medium":
			return "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300";
		case "low":
			return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300";
		default:
			return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
	}
}

export default function IdorTestTemplateIndex({
	rows,
}: IdorTestTemplatePageProps) {
	return (
		<>
			<Head title="IDOR Test Template" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						IDOR Test Template
					</h1>
					<p className="text-sm text-muted-foreground">
						Template for documenting IDOR test cases, which can be used as a
						basis for implementing automated tests.
					</p>
				</div>

				<div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background/80 dark:border-sidebar-border">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-muted/40 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
								<tr>
									<th className="px-4 py-3">Test ID</th>
									<th className="px-4 py-3">Endpoint</th>
									<th className="px-4 py-3">User/Role</th>
									<th className="px-4 py-3">Object</th>
									<th className="px-4 py-3">Expected result</th>
									<th className="px-4 py-3">Actual result</th>
									<th className="px-4 py-3">Pass/Fail</th>
									<th className="px-4 py-3">Severity</th>
									<th className="px-4 py-3">Evidence/notes</th>
								</tr>
							</thead>
							<tbody>
								{rows.map((row) => (
									<tr
										key={`${row.testId}-${row.userRole}`}
										className="border-t border-sidebar-border/70 align-top dark:border-sidebar-border"
									>
										<td className="px-4 py-3 font-medium text-foreground">
											{row.testId}
										</td>
										<td className="px-4 py-3 text-foreground">
											{row.endpoint}
										</td>
										<td className="px-4 py-3 text-foreground">
											{row.userRole}
										</td>
										<td className="px-4 py-3 text-muted-foreground">
											{row.object}
										</td>
										<td className="px-4 py-3 text-foreground">
											{row.expectedResult}
										</td>
										<td className="px-4 py-3 text-muted-foreground">
											{row.actualResult || ""}
										</td>
										<td className="px-4 py-3">
											<span
												className={`rounded px-2 py-1 text-xs font-semibold uppercase ${passFailClasses(row.passFail)}`}
											>
												{row.passFail || "Pending"}
											</span>
										</td>
										<td className="px-4 py-3">
											<span
												className={`rounded px-2 py-1 text-xs font-semibold uppercase ${severityClasses(row.severity)}`}
											>
												{row.severity}
											</span>
										</td>
										<td className="px-4 py-3 text-muted-foreground">
											{row.evidenceNotes}
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

IdorTestTemplateIndex.layout = {
	breadcrumbs: [
		{
			title: "IDOR Test Template",
			href: idorTestTemplate(),
		},
	],
};
