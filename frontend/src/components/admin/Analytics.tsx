
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
import { BarChart as BarChartIcon, TrendingUp, Smartphone, Users } from "lucide-react";

// Sample data for charts
const monthlyData = [
  { name: "Jan", businesses: 12, users: 320 },
  { name: "Feb", businesses: 19, users: 450 },
  { name: "Mar", businesses: 23, users: 520 },
  { name: "Apr", businesses: 31, users: 590 },
  { name: "May", businesses: 42, users: 680 },
  { name: "Jun", businesses: 48, users: 810 },
];

const categoryData = [
  { name: "Restaurants", value: 238 },
  { name: "Retail", value: 412 },
  { name: "Professional", value: 183 },
  { name: "Healthcare", value: 156 },
  { name: "Construction", value: 98 },
  { name: "Technology", value: 124 },
];

const deviceData = [
  { name: "Desktop", value: 45 },
  { name: "Mobile", value: 40 },
  { name: "Tablet", value: 15 },
];

const Analytics = () => {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Analytics</h1>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,211</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23,459</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2%</div>
            <p className="text-xs text-muted-foreground">+0.8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Usage</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+4% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Business Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="businesses" 
                  name="New Businesses" 
                  stroke="#0061A8" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  name="New Users" 
                  stroke="#E0592A" 
                  strokeWidth={2}
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
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Businesses" fill="#0061A8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Device Usage</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deviceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Percentage" fill="#E0592A" label={{ position: 'right', fill: '#333' }} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
