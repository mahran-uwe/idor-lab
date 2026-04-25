import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";
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

type DefaultFilter = "all" | "allow" | "deny";

export default function AuthorizationModelIndex({
	rows,
}: AuthorizationModelPageProps) {
	const [defaultFilter, setDefaultFilter] = useState<DefaultFilter>("all");

	const totalRows = rows.length;
	const allowCount = useMemo(
		() => rows.filter((row) => row.default === "Allow").length,
		[rows],
	);
	const denyCount = totalRows - allowCount;

	const filteredRows = useMemo(() => {
		if (defaultFilter === "allow") {
			return rows.filter((row) => row.default === "Allow");
		}

		if (defaultFilter === "deny") {
			return rows.filter((row) => row.default === "Deny");
		}

		return rows;
	}, [rows, defaultFilter]);

	return (
		<>
			<Head title="Authorization Model" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">
						Authorization Model
					</h1>
					<p className="text-sm text-muted-foreground">
						Current authorization behavior for the prototype resources
						implemented in the secure demonstrations.
					</p>
				</div>

				<div className="grid gap-3 md:grid-cols-3">
					<div className="rounded-xl border border-sidebar-border/70 bg-background/80 p-4 dark:border-sidebar-border">
						<p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Total Rules
						</p>
						<p className="mt-2 text-2xl font-bold text-foreground">
							{totalRows}
						</p>
					</div>
					<div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
						<p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
							Allow
						</p>
						<p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
							{allowCount}
						</p>
					</div>
					<div className="rounded-xl border border-rose-200/70 bg-rose-50/50 p-4 dark:border-rose-900 dark:bg-rose-950/20">
						<p className="text-xs font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-300">
							Deny
						</p>
						<p className="mt-2 text-2xl font-bold text-rose-700 dark:text-rose-300">
							{denyCount}
						</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-3 rounded-xl border border-sidebar-border/70 bg-muted/30 p-1 dark:border-sidebar-border">
					<div className="inline-flex items-center gap-1">
						<button
							type="button"
							onClick={() => setDefaultFilter("all")}
							className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
								defaultFilter === "all"
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:bg-background/60 hover:text-foreground"
							}`}
						>
							All ({totalRows})
						</button>
						<button
							type="button"
							onClick={() => setDefaultFilter("allow")}
							className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
								defaultFilter === "allow"
									? "bg-emerald-600 text-white shadow-sm"
									: "text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
							}`}
						>
							Allow ({allowCount})
						</button>
						<button
							type="button"
							onClick={() => setDefaultFilter("deny")}
							className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
								defaultFilter === "deny"
									? "bg-rose-600 text-white shadow-sm"
									: "text-rose-700 hover:bg-rose-100 dark:text-rose-300 dark:hover:bg-rose-900/40"
							}`}
						>
							Deny ({denyCount})
						</button>
					</div>
				</div>

				<div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background/80 dark:border-sidebar-border">
					<div className="overflow-x-auto">
						<table className="w-full min-w-215 text-sm">
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
								{filteredRows.map((row) => (
									<tr
										key={`${row.resource}-${row.action}-${row.subjectRole}-${row.rule}-${row.default}`}
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
								{filteredRows.length === 0 && (
									<tr className="border-t border-sidebar-border/70 dark:border-sidebar-border">
										<td
											className="px-4 py-6 text-center text-muted-foreground"
											colSpan={5}
										>
											No authorization rules found for this filter.
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

AuthorizationModelIndex.layout = {
	breadcrumbs: [
		{
			title: "Authorization Model",
			href: authorizationModel(),
		},
	],
};
