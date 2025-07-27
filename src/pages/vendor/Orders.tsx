import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MessageCircle } from "lucide-react";

const VendorOrders = () => {
  const orders = [
    {
      id: "ORD-001",
      supplier: "Fresh Farm Supplies",
      items: ["Onions 10kg", "Tomatoes 5kg", "Potatoes 8kg"],
      amount: "₹2,450",
      status: "delivered",
      date: "2024-01-15",
      deliveryDate: "2024-01-17"
    },
    {
      id: "ORD-002",
      supplier: "Spice World",
      items: ["Turmeric 1kg", "Red Chili 2kg", "Coriander 1kg"],
      amount: "₹1,200",
      status: "in-transit",
      date: "2024-01-18",
      deliveryDate: "2024-01-20"
    },
    {
      id: "ORD-003",
      supplier: "Grain Masters",
      items: ["Basmati Rice 25kg", "Wheat Flour 10kg"],
      amount: "₹3,800",
      status: "pending",
      date: "2024-01-20",
      deliveryDate: "2024-01-22"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      "delivered": "default",
      "in-transit": "secondary",
      "pending": "outline"
    } as const;
    
    const colors = {
      "delivered": "text-green-600",
      "in-transit": "text-yellow-600", 
      "pending": "text-blue-600"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.replace("-", " ").toUpperCase()}
      </Badge>
    );
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === "all") return orders;
    return orders.filter(order => order.status === status);
  };

  return (
    <DashboardLayout userRole="vendor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-transit">In Transit</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order {order.id}</CardTitle>
                        <CardDescription>{order.supplier}</CardDescription>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status)}
                        <p className="text-lg font-bold mt-1">{order.amount}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Items Ordered:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {order.items.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-muted-foreground">Order Date: </span>
                          <span>{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected Delivery: </span>
                          <span>{new Date(order.deliveryDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact Supplier
                        </Button>
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            Rate Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <div className="grid gap-4">
              {filterOrdersByStatus("pending").map((order) => (
                <Card key={order.id}>
                  {/* Same card structure as above */}
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="in-transit" className="mt-6">
            <div className="grid gap-4">
              {filterOrdersByStatus("in-transit").map((order) => (
                <Card key={order.id}>
                  {/* Same card structure as above */}
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="delivered" className="mt-6">
            <div className="grid gap-4">
              {filterOrdersByStatus("delivered").map((order) => (
                <Card key={order.id}>
                  {/* Same card structure as above */}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VendorOrders;