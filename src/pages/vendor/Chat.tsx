import { DashboardLayout } from "@/components/DashboardLayout";

const VendorChat = () => {
  return (
    <DashboardLayout userRole="vendor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with your suppliers</p>
        </div>
        
        <div className="text-center text-muted-foreground py-12">
          <p>Chat feature coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorChat;