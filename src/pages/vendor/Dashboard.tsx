import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ShoppingCart, Users, TrendingUp, Search, Package, MessageCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const navigate = useNavigate();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'find-suppliers':
        navigate('/vendor/suppliers');
        break;
      case 'track-orders':
        navigate('/vendor/orders?status=pending');
        break;
      case 'check-messages':
        navigate('/vendor/chat');
        break;
      case 'update-profile':
        navigate('/vendor/profile');
        break;
    }
  };

  return (
    <DashboardLayout userRole="vendor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+20% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1,24,500</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">Based on 156 reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest order activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Onions & Tomatoes</p>
                    <p className="text-xs text-muted-foreground">Fresh Farm Supplies</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹2,450</p>
                    <p className="text-xs text-green-600">Delivered</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Spices Mix</p>
                    <p className="text-xs text-muted-foreground">Spice World</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹1,200</p>
                    <p className="text-xs text-yellow-600">In Transit</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to get you started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleQuickAction('find-suppliers')}
                >
                  <Search className="mr-3 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Find new suppliers</div>
                    <div className="text-xs text-muted-foreground">Discover new suppliers for your business</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleQuickAction('track-orders')}
                >
                  <Package className="mr-3 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Track pending orders</div>
                    <div className="text-xs text-muted-foreground">Monitor your order status</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleQuickAction('check-messages')}
                >
                  <MessageCircle className="mr-3 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Check messages</div>
                    <div className="text-xs text-muted-foreground">View conversations with suppliers</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleQuickAction('update-profile')}
                >
                  <User className="mr-3 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Update profile</div>
                    <div className="text-xs text-muted-foreground">Manage your account settings</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;