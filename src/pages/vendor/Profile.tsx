import { DashboardLayout } from "@/components/DashboardLayout";

const VendorProfile = () => {
  return (
    <DashboardLayout userRole="vendor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
        
        <div className="text-center text-muted-foreground py-12">
          <p>Profile management coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorProfile;