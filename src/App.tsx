import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VendorDashboard from "./pages/vendor/Dashboard";
import VendorSuppliers from "./pages/vendor/Suppliers";
import VendorOrders from "./pages/vendor/Orders";
import VendorChat from "./pages/vendor/Chat";
import VendorProfile from "./pages/vendor/Profile";
import SupplierDashboard from "./pages/supplier/Dashboard";
import SupplierProducts from "./pages/supplier/Products";
import SupplierOrders from "./pages/supplier/Orders";
import SupplierChat from "./pages/supplier/Chat";
import SupplierProfile from "./pages/supplier/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Vendor Routes */}
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/suppliers" element={<VendorSuppliers />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/vendor/chat/:supplierId?" element={<VendorChat />} />
          <Route path="/vendor/profile" element={<VendorProfile />} />
          
          {/* Supplier Routes */}
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          <Route path="/supplier/products" element={<SupplierProducts />} />
          <Route path="/supplier/orders" element={<SupplierOrders />} />
          <Route path="/supplier/chat/:vendorId?" element={<SupplierChat />} />
          <Route path="/supplier/profile" element={<SupplierProfile />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
