import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const [activeTab, setActiveTab] = useState("vendor");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [vendorForm, setVendorForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    location: ""
  });

  const [supplierForm, setSupplierForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    companyName: "",
    categories: "",
    licenseInfo: ""
  });

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Vendor account created successfully.",
      });
      
      navigate("/vendor/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Supplier account created successfully.",
      });
      
      navigate("/supplier/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">VendorMart</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Choose your account type and get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vendor">Vendor</TabsTrigger>
                <TabsTrigger value="supplier">Supplier</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vendor" className="space-y-4">
                <form onSubmit={handleVendorSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor-name">Full Name</Label>
                    <Input
                      id="vendor-name"
                      placeholder="Enter your full name"
                      value={vendorForm.name}
                      onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vendor-email">Email</Label>
                    <Input
                      id="vendor-email"
                      type="email"
                      placeholder="Enter your email"
                      value={vendorForm.email}
                      onChange={(e) => setVendorForm({...vendorForm, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vendor-phone">Phone</Label>
                    <Input
                      id="vendor-phone"
                      placeholder="Enter your phone number"
                      value={vendorForm.phone}
                      onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vendor-business">Business Name</Label>
                    <Input
                      id="vendor-business"
                      placeholder="Enter your business name"
                      value={vendorForm.businessName}
                      onChange={(e) => setVendorForm({...vendorForm, businessName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vendor-location">Location</Label>
                    <Input
                      id="vendor-location"
                      placeholder="Enter your location"
                      value={vendorForm.location}
                      onChange={(e) => setVendorForm({...vendorForm, location: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vendor-password">Password</Label>
                    <Input
                      id="vendor-password"
                      type="password"
                      placeholder="Create a password"
                      value={vendorForm.password}
                      onChange={(e) => setVendorForm({...vendorForm, password: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Vendor Account"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="supplier" className="space-y-4">
                <form onSubmit={handleSupplierSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier-name">Full Name</Label>
                    <Input
                      id="supplier-name"
                      placeholder="Enter your full name"
                      value={supplierForm.name}
                      onChange={(e) => setSupplierForm({...supplierForm, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supplier-email">Email</Label>
                    <Input
                      id="supplier-email"
                      type="email"
                      placeholder="Enter your email"
                      value={supplierForm.email}
                      onChange={(e) => setSupplierForm({...supplierForm, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supplier-phone">Phone</Label>
                    <Input
                      id="supplier-phone"
                      placeholder="Enter your phone number"
                      value={supplierForm.phone}
                      onChange={(e) => setSupplierForm({...supplierForm, phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supplier-company">Company Name</Label>
                    <Input
                      id="supplier-company"
                      placeholder="Enter your company name"
                      value={supplierForm.companyName}
                      onChange={(e) => setSupplierForm({...supplierForm, companyName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supplier-categories">Supply Categories</Label>
                    <Input
                      id="supplier-categories"
                      placeholder="e.g., Vegetables, Spices, Grains"
                      value={supplierForm.categories}
                      onChange={(e) => setSupplierForm({...supplierForm, categories: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supplier-password">Password</Label>
                    <Input
                      id="supplier-password"
                      type="password"
                      placeholder="Create a password"
                      value={supplierForm.password}
                      onChange={(e) => setSupplierForm({...supplierForm, password: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Supplier Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;