import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, LogOut } from "lucide-react";
import Image from "next/image";
import { signOut } from "@/lib/auth/auth-client";

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
  // {
  //   title: "Profile",
  //   href: "/profile",
  //   icon: User,
  //   isDisabled: true,
  // },
  // {
  //   title: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  //   isDisabled: true,
  // },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="py-1">
      <SidebarHeader className="p-0">
        <div className="flex items-center gap-2 py-4 px-2 border-b">
          <Image
            src="/favicon.svg"
            alt="Hunt Assistant"
            width={32}
            height={32}
          />
          <div className="grid flex-1">
            <span className="truncate font-semibold text-base leading-tight text-secondary-foreground">
              Hunt Assistant
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 mt-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90">
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
                  disabled={item.isDisabled}
                  className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90">
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

      <SidebarFooter className="p-0">
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={() => signOut()}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
