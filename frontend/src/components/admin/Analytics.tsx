import React, { useState, useEffect, useRef } from "react";
import { BarChart as BarChartIcon, ClipboardList, PlusSquare, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { getBusinesses, getNewBusinessesCount, getBusinessApplications, getTopCategories, getMonthlyGrowth } from "../../lib/api";
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

// Sample data for charts - Updated for relevance
const newListingsMonthlyData = [
  { name: "Jan", count: 12 },
  { name: "Feb", count: 19 },
  { name: "Mar", count: 23 },
  { name: "Apr", count: 31 },
  { name: "May", count: 42 },
  { name: "Jun", count: 48 },
];

// Animated counter hook
const useAnimatedCounter = (endValue: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    if (endValue === 0) return;

    const startTime = Date.now();
    const startValue = countRef.current;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

      setCount(currentCount);
      countRef.current = currentCount;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [endValue, duration]);

  return count;
};

const Analytics = () => {
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const [newListings, setNewListings] = useState<number>(0);
  const [pendingApplications, setPendingApplications] = useState(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyGrowthData, setMonthlyGrowthData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  // Animated counters
  const animatedTotalBusinesses = useAnimatedCounter(totalBusinesses);
  const animatedNewListings = useAnimatedCounter(newListings);
  const animatedPendingApplications = useAnimatedCounter(pendingApplications);

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

        // Fetch monthly growth data
        const growthData = await getMonthlyGrowth();
        setMonthlyGrowthData(growthData);

        // Fetch category data for chart
        const categories = await getTopCategories(6);
        const formattedCategoryData = categories.map(cat => ({
          name: cat.category,
          value: cat.business_count
        }));
        setCategoryData(formattedCategoryData);

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
    <div className="space-y-8 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Real-time insights into your business directory</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Listed Businesses</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChartIcon className="h-5 w-5 text-primary" strokeWidth={2.5} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {isLoading ? "Loading..." : animatedTotalBusinesses.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Active listings
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Applications</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-orange-600" strokeWidth={2.5} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {isLoading ? "--" : animatedPendingApplications}
              </div>
              <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">New Listings (This Month)</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <PlusSquare className="h-5 w-5 text-green-600" strokeWidth={2.5} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {loading ? "Loading..." : animatedNewListings}
              </div>
              <p className="text-xs text-gray-500 mt-1">Recent additions</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                New Listings Over Time
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis allowDecimals={false} stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="New Listings Added"
                    stroke="#0061A8"
                    strokeWidth={3}
                    activeDot={{ r: 6, fill: '#E0592A' }}
                    dot={{ fill: '#0061A8', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-secondary" />
                Businesses by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#666"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis allowDecimals={false} stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Businesses"
                    fill="#0061A8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Device Usage Card Removed */}
    </div>
  );
};

export default Analytics;
