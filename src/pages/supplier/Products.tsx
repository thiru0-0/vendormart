import { DashboardLayout } from "@/components/DashboardLayout";

const SupplierProducts = () => {
  return (
    <DashboardLayout userRole="supplier">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <p className="text-muted-foreground">Add and manage your product listings</p>
        </div>
        
        <div className="text-center text-muted-foreground py-12">
          <p>Product management coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupplierProducts;