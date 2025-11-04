import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Settings,
  User,
} from "lucide-react";

type MenuItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  isDisabled?: boolean;
};

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Journeys",
    href: "/journeys",
    icon: FileText,
  },
];

const bottomMenuItems: MenuItem[] = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    isDisabled: true,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    isDisabled: true,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-0">
        <div className="flex items-center gap-2 py-6 px-2">
          <img src="/favicon.svg" alt="Hunt Assistant" width={32} height={32} />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-primary">Hunt Assistant</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 mt-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-auto">
          <SidebarMenu>
            {bottomMenuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  disabled={item.isDisabled}>
                  <Link href={item.isDisabled ? "#" : item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
