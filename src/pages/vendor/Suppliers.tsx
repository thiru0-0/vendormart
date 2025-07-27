import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Mail } from "lucide-react";

const VendorSuppliers = () => {
  const suppliers = [
    {
      id: 1,
      name: "Fresh Farm Supplies",
      location: "Mumbai, Maharashtra",
      rating: 4.8,
      categories: ["Vegetables", "Fruits"],
      phone: "+91 98765 43210",
      email: "contact@freshfarm.com",
      minOrder: "₹1,000",
      description: "Premium quality vegetables and fruits direct from farm"
    },
    {
      id: 2,
      name: "Spice World",
      location: "Delhi, Delhi",
      rating: 4.6,
      categories: ["Spices", "Herbs"],
      phone: "+91 98765 43211",
      email: "info@spiceworld.com",
      minOrder: "₹500",
      description: "Authentic Indian spices and herbs at wholesale prices"
    },
    {
      id: 3,
      name: "Grain Masters",
      location: "Pune, Maharashtra",
      rating: 4.9,
      categories: ["Rice", "Wheat", "Pulses"],
      phone: "+91 98765 43212",
      email: "sales@grainmasters.com",
      minOrder: "₹2,000",
      description: "Quality grains and pulses for your business needs"
    }
  ];

  return (
    <DashboardLayout userRole="vendor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Find Suppliers</h1>
          <p className="text-muted-foreground">Discover verified suppliers for your raw material needs</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input 
            placeholder="Search suppliers, products, or locations..." 
            className="flex-1"
          />
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Sort</Button>
        </div>

        {/* Suppliers Grid */}
        <div className="grid gap-6">
          {suppliers.map((supplier) => (
            <Card key={supplier.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{supplier.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <MapPin className="h-4 w-4" />
                      {supplier.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{supplier.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{supplier.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {supplier.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {supplier.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {supplier.email}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-muted-foreground">Min Order: </span>
                    <span className="font-medium">{supplier.minOrder}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Products
                    </Button>
                    <Button size="sm">
                      Contact Supplier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorSuppliers;