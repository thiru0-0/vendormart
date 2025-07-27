import { DashboardLayout } from "@/components/DashboardLayout";

const SupplierOrders = () => {
  return (
    <DashboardLayout userRole="supplier">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Orders</h1>
          <p className="text-muted-foreground">View and fulfill customer orders</p>
        </div>
        
        <div className="text-center text-muted-foreground py-12">
          <p>Order management coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupplierOrders;