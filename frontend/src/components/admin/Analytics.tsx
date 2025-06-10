import { useState, useEffect } from "react";
import { getBusinesses, getNewBusinessesCount, getBusinessApplications } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart as BarChartIcon, TrendingUp, Users, ClipboardList, PlusSquare, CheckCircle2, FileText } from "lucide-react"; // Added ClipboardList, PlusSquare, CheckCircle2, FileText

// Sample data for charts - Updated for relevance
const newListingsMonthlyData = [
  { name: "Jan", count: 12 },
  { name: "Feb", count: 19 },
  { name: "Mar", count: 23 },
  { name: "Apr", count: 31 },
  { name: "May", count: 42 },
  { name: "Jun", count: 48 },
];

// Sample data for stat cards (replace with dynamic data later)
const categoryData = [
  { name: "Restaurants", value: 238 },
  { name: "Retail", value: 412 },
  { name: "Professional", value: 183 },
  { name: "Healthcare", value: 156 },
  { name: "Construction", value: 98 },
  { name: "Technology", value: 124 },
];

const Analytics = () => {
  const [totalBusinesses, setTotalBusinesses] = useState(1211);
  const [newListings, setNewListings] = useState<number>(0);
  const [pendingApplications, setPendingApplications] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setIsLoading(true);
      try {
        const response = await getBusinesses({
          limit: 1, // We only need the total count, so limit to 1 to minimize data transfer
          offset: 0,
        });
        setTotalBusinesses(response.total || 0);
        const count = await getNewBusinessesCount();
        setNewListings(count);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        const applications = await getBusinessApplications();
        setPendingApplications(applications.filter(app => app.status === 'pending').length);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalyticsData();
    fetchData();
  }, []);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Analytics</h1>
      
      <div className="grid gap-6 md:grid-cols-3"> {/* Adjusted grid to 3 columns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listed Businesses</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : totalBusinesses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "--" : pendingApplications}</div>
            {/* <p className="text-xs text-muted-foreground">View all</p> */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Listings (This Month)</CardTitle>
            <PlusSquare className="h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "Loading..." : newListings}</div>
          </CardContent>
        </Card>
        
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New Listings Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={newListingsMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="New Listings Added"
                  stroke="#0061A8" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Businesses by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Businesses" fill="#0061A8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Device Usage Card Removed */}
    </div>
  );
};

export default Analytics;
