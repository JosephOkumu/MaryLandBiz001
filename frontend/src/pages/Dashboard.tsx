import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Tabs no longer needed
import { Building2, ClipboardList, ListPlus } from "lucide-react"; // Removed unused icons BarChart, FileText, CheckSquare
import BusinessList from "../components/admin/BusinessList"; // Added import for BusinessList
import { useState, useEffect } from "react"
import { getBusinesses } from "../lib/api"

const Dashboard = () => {
  const [totalBusinesses, setTotalBusinesses] = useState(2376);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTotalBusinesses = async () => {
      setIsLoading(true);
      try {
        const response = await getBusinesses({
          limit: 1, // We only need the total count, so limit to 1 to minimize data transfer
          offset: 0,
        });
        setTotalBusinesses(response.total || 0);
      } catch (err) {
        console.error("Failed to fetch total businesses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalBusinesses();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        {/* Removed TabsList as it's no longer needed */}
      </div>
      {/* Tabs component removed, displaying overview content directly */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Listed Businesses
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "Loading..." : totalBusinesses}</div>
              <p className="text-xs text-muted-foreground">
                Total in database
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Applications
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              {/* <p className="text-xs text-muted-foreground">
                  +2 since yesterday
                </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New Listings (This Month)
              </CardTitle>
              <ListPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">58</div>
              {/* <p className="text-xs text-muted-foreground">
                  Approved this month
                </p> */}
            </CardContent>
          </Card>
        </div>

        {/* Business List Section */}
        <div className="mt-6">
          <BusinessList />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
