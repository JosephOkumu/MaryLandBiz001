
import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext"; // Import useAuth
import { AdminLoginCredentials } from "../lib/api"; // Import credentials type
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Building, Lock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const loginSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  // isLoading from AuthContext will be used. Local error can also be from context.
  // const [localIsLoading, setLocalIsLoading] = useState(false); // Can remove if using context's isLoading directly
  const { login, currentUser, isLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      toast.success("Login successful!");
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Display auth errors from context using toast
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  async function onSubmit(data: LoginFormValues) {
    // setLocalIsLoading(true); // If using local loading state
    try {
      const credentials: AdminLoginCredentials = { username: data.username, password: data.password };
      await login(credentials);
      // Navigation is handled by the useEffect watching currentUser
    } catch (err) {
      // Error is already set in AuthContext and handled by the useEffect above
      // No need to toast.error here if authError useEffect is active
      console.error("Login attempt failed from page:", err);
    }
    // finally {
    //   setLocalIsLoading(false); // If using local loading state
    // }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Link to="/" className="flex items-center space-x-2 mb-8">
        <Building className="h-8 w-8 text-primary" strokeWidth={2.5} />
        <span className="text-3xl font-bold">
          <span className="text-[#0061A8]">Maryland</span>
          <span className="text-secondary">Biz</span>
        </span>
      </Link>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input 
                          placeholder="Enter your username" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading} // Now uses isLoading from AuthContext
              >
                {isLoading ? "Logging in..." : "Login to Dashboard"} {/* Uses isLoading from AuthContext */}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm">
            <Link to="/" className="text-primary hover:underline">
              Return to homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
