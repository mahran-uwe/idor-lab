import { Head } from "@inertiajs/react";
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

export default function ReviewerChecklistIndex({
	rows,
}: ReviewerChecklistPageProps) {
	return (
		<>
			<Head title="Reviewer Checklist" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Reviewer Checklist
					</h1>
					<p className="text-sm text-muted-foreground">
						Checklist for reviewers to verify that appropriate authorisation are in place for endpoints and use cases.
					</p>
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
									<th className="px-4 py-3">Reviewed?</th>
									<th className="px-4 py-3">Evidence / notes</th>
								</tr>
							</thead>
							<tbody>
								{rows.map((row) => (
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
												{row.reviewed ? "Yes" : "No"}
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

ReviewerChecklistIndex.layout = {
	breadcrumbs: [
		{
			title: "Reviewer Checklist",
			href: reviewerChecklist(),
		},
	],
};
