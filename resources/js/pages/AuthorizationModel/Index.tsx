import { Head } from "@inertiajs/react";
import { index as authorizationModel } from "@/routes/authorization-model";

type AuthorizationRow = {
	resource: string;
	action: string;
	subjectRole: string;
	rule: string;
	default: "Allow" | "Deny";
};

type AuthorizationModelPageProps = {
	rows: AuthorizationRow[];
};

export default function AuthorizationModelIndex({
	rows,
}: AuthorizationModelPageProps) {
	return (
		<>
			<Head title="Authorization Model" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Authorization Model
					</h1>
					<p className="text-sm text-muted-foreground">
						Current authorization behavior for the prototype resources implemented in the secure demonstrations.
					</p>
				</div>

				<div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background/80 dark:border-sidebar-border">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[860px] text-sm">
							<thead className="bg-muted/40 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
								<tr>
									<th className="px-4 py-3">Resource</th>
									<th className="px-4 py-3">Action</th>
									<th className="px-4 py-3">Subject/Role</th>
									<th className="px-4 py-3">Rule</th>
									<th className="px-4 py-3">Default</th>
								</tr>
							</thead>
							<tbody>
								{rows.map((row) => (
									<tr
										key={`${row.resource}-${row.action}-${row.subjectRole}`}
										className="border-t border-sidebar-border/70 dark:border-sidebar-border"
									>
										<td className="px-4 py-3 font-medium text-foreground">
											{row.resource}
										</td>
										<td className="px-4 py-3 text-foreground">{row.action}</td>
										<td className="px-4 py-3 text-foreground">
											{row.subjectRole}
										</td>
										<td className="px-4 py-3 text-muted-foreground">
											{row.rule}
										</td>
										<td className="px-4 py-3">
											<span
												className={`rounded px-2 py-1 text-xs font-semibold uppercase ${
													row.default === "Allow"
														? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
														: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
												}`}
											>
												{row.default}
											</span>
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

AuthorizationModelIndex.layout = {
	breadcrumbs: [
		{
			title: "Authorization Model",
			href: authorizationModel(),
		},
	],
};
