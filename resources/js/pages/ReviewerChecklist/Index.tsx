import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { index as reviewerChecklist } from "@/routes/reviewer-checklist";

type ReviewerChecklistRow = {
	id: string;
	endpointUseCase: string;
	resource: string;
	action: string;
	objectReference: string;
	ruleEnforcementPoint: string;
	reviewed: boolean;
	evidenceNotes: string;
};

type ReviewerChecklistPageProps = {
	rows: ReviewerChecklistRow[];
};

type StatusFilter = "all" | "pass" | "fail";

export default function ReviewerChecklistIndex({
	rows,
}: ReviewerChecklistPageProps) {
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

	const totalRows = rows.length;
	const reviewedCount = useMemo(
		() => rows.filter((row) => row.reviewed).length,
		[rows],
	);
	const needsAttentionCount = totalRows - reviewedCount;

	const filteredRows = useMemo(() => {
		if (statusFilter === "pass") {
			return rows.filter((row) => row.reviewed);
		}

		if (statusFilter === "fail") {
			return rows.filter((row) => !row.reviewed);
		}

		return rows;
	}, [rows, statusFilter]);

	return (
		<>
			<Head title="Reviewer Checklist" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Reviewer Checklist
					</h1>
					<p className="text-sm text-muted-foreground">
						Checklist for reviewers to verify that appropriate authorisation is
						in place for insecure and secure endpoint use cases.
					</p>
				</div>

				<div className="grid gap-3 md:grid-cols-3">
					<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
						<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Total Endpoints
						</p>
						<p className="mt-2 text-2xl font-bold text-foreground">
							{totalRows}
						</p>
					</div>
					<div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
						<p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
							Pass
						</p>
						<p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
							{reviewedCount}
						</p>
					</div>
					<div className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
						<p className="text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
							Fail
						</p>
						<p className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-300">
							{needsAttentionCount}
						</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-3 rounded-xl border border-sidebar-border/70 bg-muted/30 p-1 dark:border-sidebar-border">
					<div className="inline-flex items-center gap-1">
						<button
							type="button"
							onClick={() => setStatusFilter("all")}
							className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
								statusFilter === "all"
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:bg-background/60 hover:text-foreground"
							}`}
						>
							All ({totalRows})
						</button>
						<button
							type="button"
							onClick={() => setStatusFilter("pass")}
							className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
								statusFilter === "pass"
									? "bg-emerald-600 text-white shadow-sm"
									: "text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
							}`}
						>
							Pass ({reviewedCount})
						</button>
						<button
							type="button"
							onClick={() => setStatusFilter("fail")}
							className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
								statusFilter === "fail"
									? "bg-amber-600 text-white shadow-sm"
									: "text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/40"
							}`}
						>
							Fail ({needsAttentionCount})
						</button>
					</div>
				</div>

				<div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background/80 dark:border-sidebar-border">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-muted/40 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
								<tr>
									<th className="px-4 py-3">ID</th>
									<th className="px-4 py-3">Endpoint / use case</th>
									<th className="px-4 py-3">Resource</th>
									<th className="px-4 py-3">Action</th>
									<th className="px-4 py-3">Object reference</th>
									<th className="px-4 py-3">Rule / Enforcement Point</th>
									<th className="px-4 py-3">Status</th>
									<th className="px-4 py-3">Evidence / notes</th>
								</tr>
							</thead>
							<tbody>
								{filteredRows.map((row) => (
									<tr
										key={row.id}
										className="border-t border-sidebar-border/70 align-top dark:border-sidebar-border"
									>
										<td className="px-4 py-3 font-medium text-foreground">
											{row.id}
										</td>
										<td className="px-4 py-3 text-foreground">
											{row.endpointUseCase}
										</td>
										<td className="px-4 py-3 text-foreground">
											{row.resource}
										</td>
										<td className="px-4 py-3 text-foreground">{row.action}</td>
										<td className="px-4 py-3 text-muted-foreground">
											{row.objectReference}
										</td>
										<td className="px-4 py-3 text-muted-foreground">
											{row.ruleEnforcementPoint}
										</td>
										<td className="px-4 py-3">
											<span
												className={`rounded px-2 py-1 text-xs font-semibold uppercase ${
													row.reviewed
														? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
														: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
												}`}
											>
												{row.reviewed ? "Pass" : "Fail"}
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
											colSpan={8}
										>
											No checklist rows found for this status filter.
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

ReviewerChecklistIndex.layout = {
	breadcrumbs: [
		{
			title: "Reviewer Checklist",
			href: reviewerChecklist(),
		},
	],
};
