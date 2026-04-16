import { Link } from "@inertiajs/react";
import {
	SidebarGroupLabel,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useCurrentUrl } from "@/hooks/use-current-url";
import type { NavItem } from "@/types";

type NavGroup = {
	title: string;
	items: NavItem[];
};

type NavMainProps = {
	items?: NavItem[];
	groups?: NavGroup[];
};

function NavMainSection({ title, items }: NavGroup) {
	const { isCurrentUrl } = useCurrentUrl();

	return (
		<SidebarGroup className="px-2 py-0">
			<SidebarGroupLabel>{title}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton
							asChild
							isActive={isCurrentUrl(item.href)}
							tooltip={{ children: item.title }}
						>
							<Link href={item.href} prefetch>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

export function NavMain({ items = [], groups = [] }: NavMainProps) {
	const sections =
		groups.length > 0 ? groups : [{ title: "Navigation", items }];

	return (
		<>
			{sections.map((section) => (
				<NavMainSection
					key={section.title}
					title={section.title}
					items={section.items}
				/>
			))}
		</>
	);
}
