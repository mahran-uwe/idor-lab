import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";
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

type PassFailFilter = "all" | "pass" | "fail" | "pending";

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
	const [passFailFilter, setPassFailFilter] = useState<PassFailFilter>("all");

	const totalRows = rows.length;
	const passCount = useMemo(
		() => rows.filter((row) => row.passFail === "Pass").length,
		[rows],
	);
	const failCount = useMemo(
		() => rows.filter((row) => row.passFail === "Fail").length,
		[rows],
	);
	const pendingCount = totalRows - passCount - failCount;

	const filteredRows = useMemo(() => {
		if (passFailFilter === "pass") {
			return rows.filter((row) => row.passFail === "Pass");
		}

		if (passFailFilter === "fail") {
			return rows.filter((row) => row.passFail === "Fail");
		}

		if (passFailFilter === "pending") {
			return rows.filter((row) => row.passFail !== "Pass" && row.passFail !== "Fail");
		}

		return rows;
	}, [rows, passFailFilter]);

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

				<div className="grid gap-3 md:grid-cols-4">
					<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
						<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Total Cases
						</p>
						<p className="mt-2 text-2xl font-bold text-foreground">{totalRows}</p>
					</div>
					<div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
						<p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
							Pass
						</p>
						<p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
							{passCount}
						</p>
					</div>
					<div className="rounded-xl border border-rose-200/70 bg-rose-50/50 p-4 dark:border-rose-900 dark:bg-rose-950/20">
						<p className="text-xs font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
							Fail
						</p>
						<p className="mt-2 text-2xl font-bold text-rose-700 dark:text-rose-300">
							{failCount}
						</p>
					</div>
					<div className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
						<p className="text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
							Pending
						</p>
						<p className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-300">
							{pendingCount}
						</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-3 rounded-xl border border-sidebar-border/70 bg-muted/30 p-1 dark:border-sidebar-border">
					<div className="inline-flex items-center gap-1">
						<button
							type="button"
							onClick={() => setPassFailFilter("all")}
							className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
								passFailFilter === "all"
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:bg-background/60 hover:text-foreground"
							}`}
						>
							All ({totalRows})
						</button>
						<button
							type="button"
							onClick={() => setPassFailFilter("pass")}
							className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
								passFailFilter === "pass"
									? "bg-emerald-600 text-white shadow-sm"
									: "text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
							}`}
						>
							Pass ({passCount})
						</button>
						<button
							type="button"
							onClick={() => setPassFailFilter("fail")}
							className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
								passFailFilter === "fail"
									? "bg-rose-600 text-white shadow-sm"
									: "text-rose-700 hover:bg-rose-100 dark:text-rose-300 dark:hover:bg-rose-900/40"
							}`}
						>
							Fail ({failCount})
						</button>
						<button
							type="button"
							onClick={() => setPassFailFilter("pending")}
							className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
								passFailFilter === "pending"
									? "bg-amber-600 text-white shadow-sm"
									: "text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/40"
							}`}
						>
							Pending ({pendingCount})
						</button>
					</div>
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
								{filteredRows.map((row) => (
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
								{filteredRows.length === 0 && (
									<tr className="border-t border-sidebar-border/70 dark:border-sidebar-border">
										<td
											className="px-4 py-6 text-center text-muted-foreground"
											colSpan={9}
										>
											No test cases found for this filter.
										</td>
									</tr>
								)}
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
