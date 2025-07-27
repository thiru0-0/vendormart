import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MessageCircle, Loader2 } from "lucide-react";
import { api, Order } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const VendorOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Get status from URL params
  const statusFromUrl = searchParams.get("status");

  useEffect(() => {
    if (statusFromUrl) {
      setActiveTab(statusFromUrl);
    }
    loadOrders();
  }, [statusFromUrl]);

  const loadOrders = async () => {
    try {
      const filters: any = {};
      if (statusFromUrl && statusFromUrl !== "all") {
        filters.status = statusFromUrl;
      }
      
      const data = await api.getOrders(filters);
      setOrders(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ status: value });
    }
  };

  const handleContactSupplier = (supplierId: string) => {
    navigate(`/vendor/chat/${supplierId}`);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "delivered": "default",
      "shipped": "secondary",
      "confirmed": "secondary",
      "pending": "outline",
      "cancelled": "destructive"
    } as const;
    
    const colors = {
      "delivered": "text-green-600",
      "shipped": "text-blue-600",
      "confirmed": "text-yellow-600",
      "pending": "text-orange-600",
      "cancelled": "text-red-600"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole="vendor">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="vendor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">No orders found</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order {order.id}</CardTitle>
                          <CardDescription>Supplier ID: {order.supplierId}</CardDescription>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-lg font-bold mt-1">{formatCurrency(order.totalAmount)}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Items Ordered:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {order.items.map((item, index) => (
                              <li key={index}>
                                • {item.name} - {item.quantity} units @ {formatCurrency(item.price)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="text-muted-foreground">Order Date: </span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Updated: </span>
                            <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactSupplier(order.supplierId)}
                          >
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
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <div className="grid gap-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">No pending orders</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order {order.id}</CardTitle>
                          <CardDescription>Supplier ID: {order.supplierId}</CardDescription>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-lg font-bold mt-1">{formatCurrency(order.totalAmount)}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Items Ordered:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {order.items.map((item, index) => (
                              <li key={index}>
                                • {item.name} - {item.quantity} units @ {formatCurrency(item.price)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="text-muted-foreground">Order Date: </span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Updated: </span>
                            <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactSupplier(order.supplierId)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Supplier
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="confirmed" className="mt-6">
            <div className="grid gap-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">No confirmed orders</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order {order.id}</CardTitle>
                          <CardDescription>Supplier ID: {order.supplierId}</CardDescription>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-lg font-bold mt-1">{formatCurrency(order.totalAmount)}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Items Ordered:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {order.items.map((item, index) => (
                              <li key={index}>
                                • {item.name} - {item.quantity} units @ {formatCurrency(item.price)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="text-muted-foreground">Order Date: </span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Updated: </span>
                            <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactSupplier(order.supplierId)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Supplier
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="shipped" className="mt-6">
            <div className="grid gap-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">No shipped orders</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order {order.id}</CardTitle>
                          <CardDescription>Supplier ID: {order.supplierId}</CardDescription>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-lg font-bold mt-1">{formatCurrency(order.totalAmount)}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Items Ordered:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {order.items.map((item, index) => (
                              <li key={index}>
                                • {item.name} - {item.quantity} units @ {formatCurrency(item.price)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="text-muted-foreground">Order Date: </span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Updated: </span>
                            <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactSupplier(order.supplierId)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Supplier
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="delivered" className="mt-6">
            <div className="grid gap-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">No delivered orders</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order {order.id}</CardTitle>
                          <CardDescription>Supplier ID: {order.supplierId}</CardDescription>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-lg font-bold mt-1">{formatCurrency(order.totalAmount)}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Items Ordered:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {order.items.map((item, index) => (
                              <li key={index}>
                                • {item.name} - {item.quantity} units @ {formatCurrency(item.price)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="text-muted-foreground">Order Date: </span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Updated: </span>
                            <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactSupplier(order.supplierId)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Supplier
                          </Button>
                          <Button variant="outline" size="sm">
                            Rate Order
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VendorOrders;