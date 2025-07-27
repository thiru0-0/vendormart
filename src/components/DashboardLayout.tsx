import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: "vendor" | "supplier";
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Global header */}
        <header className="fixed top-0 left-0 right-0 h-12 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 px-4">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="ml-2" />
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary">VendorMart</span>
            </Link>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </header>

        <div className="flex w-full pt-12">
          <AppSidebar userRole={userRole} />
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}