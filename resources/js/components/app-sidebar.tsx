import { Link } from "@inertiajs/react";
import {
	ClipboardCheck,
	ChartBar,
	File,
	LayoutGrid,
	ListChecks,
	ReceiptText,
	ScanBarcode,
	Server,
	Shield,
	Terminal,
	FolderKey,
	SquareAsterisk,
} from "lucide-react";
import AppLogo from "@/components/app-logo";
import { NavFooter } from "@/components/nav-footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dashboard } from "@/routes";
import { index as api } from "@/routes/api";
import { index as authorizationModel } from "@/routes/authorization-model";
import { index as benchmarks } from "@/routes/benchmarks";
import { index as documents } from "@/routes/documents";
import { index as enforcementPoints } from "@/routes/enforcement-points";
import { index as invoices } from "@/routes/invoices";
import { index as idorTestTemplate } from "@/routes/idor-test-template";
import { index as reviewerChecklist } from "@/routes/reviewer-checklist";
import { index as secureObjectReferences } from "@/routes/secure-object-references";
import { index as tests } from "@/routes/tests";
import type { NavItem } from "@/types";

const overviewNavItems: NavItem[] = [
	{
		title: "Dashboard",
		href: dashboard(),
		icon: LayoutGrid,
	},
];

const demosNavItems: NavItem[] = [
	{
		title: "Documents",
		href: documents(),
		icon: File,
	},
	{
		title: "Invoices",
		href: invoices(),
		icon: ReceiptText,
	},
	{
		title: "UUIDs",
		href: "/uuid",
		icon: ScanBarcode,
	},
	{
		title: "API",
		href: api(),
		icon: Server,
	},
];

const frameworkNavItems: NavItem[] = [
	{
		title: "Authorization Model",
		href: authorizationModel(),
		icon: FolderKey,
	},
	{
		title: "Secure Object References",
		href: secureObjectReferences(),
		icon: SquareAsterisk,
	},
	{
		title: "Enforcement Points",
		href: enforcementPoints(),
		icon: Shield,
	},
	{
		title: "Reviewer Checklist",
		href: reviewerChecklist(),
		icon: ClipboardCheck,
	},
	{
		title: "IDOR Test Template",
		href: idorTestTemplate(),
		icon: ListChecks,
	},
];

const evaluationNavItems: NavItem[] = [
	{
		title: "Benchmarks",
		href: benchmarks(),
		icon: ChartBar,
	},
	{
		title: "Automated Tests",
		href: tests(),
		icon: Terminal,
	},
];

const mainNavGroups = [
	{
		title: "Overview",
		items: overviewNavItems,
	},
	{
		title: "Demos",
		items: demosNavItems,
	},
	{
		title: "Framework",
		items: frameworkNavItems,
	},
	{
		title: "Evaluation",
		items: evaluationNavItems,
	},
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href={dashboard()} prefetch>
								<AppLogo />
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavMain groups={mainNavGroups} />
			</SidebarContent>

			<SidebarFooter>
				<NavFooter items={footerNavItems} className="mt-auto" />
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
