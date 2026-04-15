import { Link } from "@inertiajs/react";
import {
	ChartBar,
	File,
	LayoutGrid,
	ReceiptText,
	ScanBarcode,
	Server,
	Shield,
	Terminal,
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
import { index as invoices } from "@/routes/invoices";
import { index as tests } from "@/routes/tests";
import type { NavItem } from "@/types";

const mainNavItems: NavItem[] = [
	{
		title: "Dashboard",
		href: dashboard(),
		icon: LayoutGrid,
	},
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
	{
		title: "Authorization Model",
		href: authorizationModel(),
		icon: Shield,
	},
	{
		title: "Tests",
		href: tests(),
		icon: Terminal,
	},
	{
		title: "Benchmarks",
		href: benchmarks(),
		icon: ChartBar,
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
				<NavMain items={mainNavItems} />
			</SidebarContent>

			<SidebarFooter>
				<NavFooter items={footerNavItems} className="mt-auto" />
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
