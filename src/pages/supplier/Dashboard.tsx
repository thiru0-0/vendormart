import { DashboardLayout } from "@/components/DashboardLayout";

const SupplierDashboard = () => {
  return (
    <DashboardLayout userRole="supplier">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
          <p className="text-muted-foreground">Manage your products and orders</p>
        </div>
        
        <div className="text-center text-muted-foreground py-12">
          <p>Supplier dashboard coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupplierDashboard;