import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Vendor Routes */}
            <Route path="/vendor/dashboard" element={
              <ProtectedRoute requiredRole="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/vendor/suppliers" element={
              <ProtectedRoute requiredRole="vendor">
                <VendorSuppliers />
              </ProtectedRoute>
            } />
            <Route path="/vendor/orders" element={
              <ProtectedRoute requiredRole="vendor">
                <VendorOrders />
              </ProtectedRoute>
            } />
            <Route path="/vendor/chat/:supplierId?" element={
              <ProtectedRoute requiredRole="vendor">
                <VendorChat />
              </ProtectedRoute>
            } />
            <Route path="/vendor/profile" element={
              <ProtectedRoute requiredRole="vendor">
                <VendorProfile />
              </ProtectedRoute>
            } />
            
            {/* Supplier Routes */}
            <Route path="/supplier/dashboard" element={
              <ProtectedRoute requiredRole="supplier">
                <SupplierDashboard />
              </ProtectedRoute>
            } />
            <Route path="/supplier/products" element={
              <ProtectedRoute requiredRole="supplier">
                <SupplierProducts />
              </ProtectedRoute>
            } />
            <Route path="/supplier/orders" element={
              <ProtectedRoute requiredRole="supplier">
                <SupplierOrders />
              </ProtectedRoute>
            } />
            <Route path="/supplier/chat/:vendorId?" element={
              <ProtectedRoute requiredRole="supplier">
                <SupplierChat />
              </ProtectedRoute>
            } />
            <Route path="/supplier/profile" element={
              <ProtectedRoute requiredRole="supplier">
                <SupplierProfile />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
