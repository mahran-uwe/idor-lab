import { Head, Link } from "@inertiajs/react";
import type { LucideIcon } from "lucide-react";
import {
	ArrowRight,
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
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
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
		description: "Explore tenant-safe access controls for invoice resources.",
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
			"Review API-side access checks and response behavior for object lookups.",
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
			"Start from reusable test prompts for insecure and secure variants.",
		category: "Framework",
		icon: ListChecks,
	},
	{
		title: "Benchmarks",
		href: benchmarks(),
		description:
			"Measure implementation quality against reference security expectations.",
		category: "Evaluation",
		icon: ChartBar,
	},
	{
		title: "Automated Tests",
		href: tests(),
		description:
			"Run and inspect automated checks that validate the framework behavior.",
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

						return (
							<Link
								key={item.title}
								href={item.href}
								prefetch
								className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<Card className="h-full border-sidebar-border/70 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md dark:border-sidebar-border">
									<CardHeader className="gap-3">
										<div className="flex items-center justify-between gap-3">
											<div className="flex size-10 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground">
												<ItemIcon className="size-5" />
											</div>
											<Badge variant="outline">{item.category}</Badge>
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
