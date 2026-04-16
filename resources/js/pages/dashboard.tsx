import { Head, Link } from "@inertiajs/react";
import type { LucideIcon } from "lucide-react";
import {
	ChartBar,
	ClipboardCheck,
	File,
	FolderKey,
	ListChecks,
	ReceiptText,
	ScanBarcode,
	Server,
	Shield,
	SquareAsterisk,
	Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboard } from "@/routes";
import { index as api } from "@/routes/api";
import { index as authorizationModel } from "@/routes/authorization-model";
import { index as benchmarks } from "@/routes/benchmarks";
import { index as documents } from "@/routes/documents";
import { index as enforcementPoints } from "@/routes/enforcement-points";
import { index as idorTestTemplate } from "@/routes/idor-test-template";
import { index as invoices } from "@/routes/invoices";
import { index as reviewerChecklist } from "@/routes/reviewer-checklist";
import { index as secureObjectReferences } from "@/routes/secure-object-references";
import { index as tests } from "@/routes/tests";
import { index as uuid } from "@/routes/uuid";
import type { NavItem } from "@/types";

type DashboardItem = NavItem & {
	description: string;
	category: "Demo" | "Framework" | "Evaluation";
	icon: LucideIcon;
};

const categoryStyles: Record<DashboardItem["category"], {
	cardBorder: string;
	cardHoverBorder: string;
	iconWrapper: string;
	iconColor: string;
	badge: string;
}> = {
	Demo: {
		cardBorder: "border-cyan-200/80 dark:border-cyan-900/60",
		cardHoverBorder: "hover:border-cyan-400/70 dark:hover:border-cyan-600/70",
		iconWrapper: "border-cyan-300/70 bg-cyan-50/80 dark:border-cyan-900 dark:bg-cyan-950/50",
		iconColor: "text-cyan-700 dark:text-cyan-300",
		badge: "border-cyan-300/80 bg-cyan-100/70 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300",
	},
	Framework: {
		cardBorder: "border-emerald-200/80 dark:border-emerald-900/60",
		cardHoverBorder: "hover:border-emerald-400/70 dark:hover:border-emerald-600/70",
		iconWrapper: "border-emerald-300/70 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/50",
		iconColor: "text-emerald-700 dark:text-emerald-300",
		badge: "border-emerald-300/80 bg-emerald-100/70 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300",
	},
	Evaluation: {
		cardBorder: "border-amber-200/80 dark:border-amber-900/60",
		cardHoverBorder: "hover:border-amber-400/70 dark:hover:border-amber-600/70",
		iconWrapper: "border-amber-300/70 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/50",
		iconColor: "text-amber-700 dark:text-amber-300",
		badge: "border-amber-300/80 bg-amber-100/70 text-amber-800 dark:border-amber-800 dark:bg-amber-950/70 dark:text-amber-300",
	},
};

const dashboardItems: DashboardItem[] = [
	{
		title: "Documents",
		href: documents(),
		description:
			"Compare insecure object access against policy-protected document access.",
		category: "Demo",
		icon: File,
	},
	{
		title: "Invoices",
		href: invoices(),
		description: "Explore safe access controls for invoice resources.",
		category: "Demo",
		icon: ReceiptText,
	},
	{
		title: "UUIDs",
		href: uuid(),
		description:
			"Inspect identifier hardening with UUID-backed resource routing.",
		category: "Demo",
		icon: ScanBarcode,
	},
	{
		title: "API",
		href: api(),
		description:
			"Review API access checks and response behavior for object lookups.",
		category: "Demo",
		icon: Server,
	},
	{
		title: "Authorization Model",
		href: authorizationModel(),
		description:
			"Understand the policy and ownership model used by the framework.",
		category: "Framework",
		icon: FolderKey,
	},
	{
		title: "Secure Object References",
		href: secureObjectReferences(),
		description:
			"See how indirect references reduce resource enumeration risk.",
		category: "Framework",
		icon: SquareAsterisk,
	},
	{
		title: "Enforcement Points",
		href: enforcementPoints(),
		description:
			"Trace where authorization is enforced in controllers and policies.",
		category: "Framework",
		icon: Shield,
	},
	{
		title: "Reviewer Checklist",
		href: reviewerChecklist(),
		description:
			"Use a practical checklist to audit IDOR protections consistently.",
		category: "Framework",
		icon: ClipboardCheck,
	},
	{
		title: "IDOR Test Template",
		href: idorTestTemplate(),
		description:
			"A reusable test template to verify correct access controls on object references.",
		category: "Framework",
		icon: ListChecks,
	},
	{
		title: "Benchmarks",
		href: benchmarks(),
		description:
			"Measure performance impacts of different access control approaches.",
		category: "Evaluation",
		icon: ChartBar,
	},
	{
		title: "Automated Tests",
		href: tests(),
		description:
			"Run and inspect automated tests to verify access control behavior across scenarios.",
		category: "Evaluation",
		icon: Terminal,
	},
];

export default function Dashboard() {
	return (
		<>
			<Head title="Dashboard" />
			<div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-sm text-muted-foreground">
						Jump directly to demos, framework guidance, and evaluation tools.
					</p>
				</div>

				<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{dashboardItems.map((item) => {
						const ItemIcon = item.icon;
						const categoryStyle = categoryStyles[item.category];

						return (
							<Link
								key={item.title}
								href={item.href}
								prefetch
								className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<Card
									className={`h-full ${categoryStyle.cardBorder} transition-all hover:-translate-y-0.5 ${categoryStyle.cardHoverBorder} hover:shadow-md`}
								>
									<CardHeader className="gap-3">
										<div className="flex items-center justify-between gap-3">
											<div
												className={`flex size-10 items-center justify-center rounded-lg border ${categoryStyle.iconWrapper} ${categoryStyle.iconColor}`}
											>
												<ItemIcon className="size-5" />
											</div>
											<Badge variant="outline" className={categoryStyle.badge}>
												{item.category}
											</Badge>
										</div>
										<CardTitle className="text-lg leading-tight">
											{item.title}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm leading-6 text-muted-foreground">
											{item.description}
										</p>
									</CardContent>
								</Card>
							</Link>
						);
					})}
				</section>
			</div>
		</>
	);
}

Dashboard.layout = {
	breadcrumbs: [
		{
			title: "Dashboard",
			href: dashboard(),
		},
	],
};
