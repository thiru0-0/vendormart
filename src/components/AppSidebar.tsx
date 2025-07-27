import { useState } from "react";
import { Package, ShoppingCart, MessageCircle, User, Store, BarChart3 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  userRole: "vendor" | "supplier";
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const vendorItems = [
    { title: "Dashboard", url: "/vendor/dashboard", icon: BarChart3 },
    { title: "Find Suppliers", url: "/vendor/suppliers", icon: Store },
    { title: "My Orders", url: "/vendor/orders", icon: ShoppingCart },
    { title: "Messages", url: "/vendor/chat", icon: MessageCircle },
    { title: "Profile", url: "/vendor/profile", icon: User },
  ];

  const supplierItems = [
    { title: "Dashboard", url: "/supplier/dashboard", icon: BarChart3 },
    { title: "Products", url: "/supplier/products", icon: Package },
    { title: "Orders", url: "/supplier/orders", icon: ShoppingCart },
    { title: "Messages", url: "/supplier/chat", icon: MessageCircle },
    { title: "Profile", url: "/supplier/profile", icon: User },
  ];

  const items = userRole === "vendor" ? vendorItems : supplierItems;
  const isActive = (path: string) => currentPath === path;
  const isExpanded = items.some((i) => isActive(i.url));
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {userRole === "vendor" ? "Vendor Portal" : "Supplier Portal"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}