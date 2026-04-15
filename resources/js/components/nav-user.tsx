import { Link, router, usePage } from "@inertiajs/react";
import { LogOut, Settings } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { UserInfo } from "@/components/user-info";
import { UserMenuContent } from "@/components/user-menu-content";
import { useIsMobile } from "@/hooks/use-mobile";
import { logout } from "@/routes";
import { edit } from "@/routes/appearance";

export function NavUser() {
	const { auth } = usePage().props;
	const { state } = useSidebar();
	const isMobile = useIsMobile();
	const isExpanded = !isMobile && state === "expanded";

	if (!auth.user) {
		return null;
	}

	const handleLogout = () => {
		router.flushAll();
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				{isExpanded ? (
					<SidebarMenuButton
						size="lg"
						className="text-sidebar-accent-foreground"
					>
						<UserInfo user={auth.user} showEmail={true} />
					</SidebarMenuButton>
				) : (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="text-sidebar-accent-foreground"
								data-test="sidebar-menu-button"
							>
								<UserInfo user={auth.user} />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
							align="end"
							side={isMobile ? "bottom" : "left"}
						>
							<UserMenuContent user={auth.user} />
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</SidebarMenuItem>

			<SidebarMenuItem className={isExpanded ? "" : "hidden"}>
				<SidebarMenuButton asChild>
					<Link href={edit()} prefetch>
						<Settings />
						<span>Settings</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>

			<SidebarMenuItem className={isExpanded ? "" : "hidden"}>
				<SidebarMenuButton asChild>
					<Link
						href={logout()}
						as="button"
						onClick={handleLogout}
						data-test="logout-button"
					>
						<LogOut />
						<span>Log out</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
