
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Clock, 
  Search, 
  BarChart, 
  Trash2, 
  Download, 
  Share2, 
  ChevronRight,
  SlidersHorizontal,
  Filter,
  Calendar
} from "lucide-react";

// Sample data
const savedComparisons = [
  {
    id: "sc1",
    name: "Nike Running Shoes Collection",
    date: "June 15, 2023",
    products: 5,
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: "sc2",
    name: "Apple Electronics Lineup",
    date: "July 2, 2023",
    products: 8,
    thumbnail: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
  },
  {
    id: "sc3",
    name: "Summer Clothing Collection",
    date: "July 10, 2023",
    products: 12,
    thumbnail: "https://images.unsplash.com/photo-1560243563-062bfc001d68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "sc4",
    name: "Home Kitchen Appliances",
    date: "July 18, 2023",
    products: 6,
    thumbnail: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1468&q=80",
  },
];

const recentActivity = [
  {
    id: "ra1",
    product: "Nike Air Zoom Pegasus 38",
    action: "Price drop alert",
    change: "-8.5%",
    date: "2 hours ago",
  },
  {
    id: "ra2",
    product: "Apple AirPods Pro",
    action: "Market trend change",
    change: "+5.2%",
    date: "Yesterday",
  },
  {
    id: "ra3",
    product: "Samsung 50\" 4K TV",
    action: "New competitor",
    change: "3 sellers",
    date: "2 days ago",
  },
];

const SavedComparisons = () => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Saved Comparisons</h1>
              <p className="text-muted-foreground">
                View and manage your saved product comparisons
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search comparisons..."
                  className="glass-input pl-10 pr-4 py-2 w-full md:w-64"
                />
              </div>
              <button className="btn-ghost text-sm flex items-center px-3 py-2">
                <Filter size={16} className="mr-1.5" />
                <span>Filter</span>
              </button>
              <button className="btn-ghost text-sm flex items-center px-3 py-2">
                <SlidersHorizontal size={16} className="mr-1.5" />
                <span>Sort</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {savedComparisons.map((comparison, index) => (
                  <motion.div
                    key={comparison.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card overflow-hidden group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={comparison.thumbnail}
                        alt={comparison.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <div className="text-white">
                          <h3 className="font-medium text-lg">{comparison.name}</h3>
                          <div className="flex items-center text-xs text-white/80 mt-1">
                            <Calendar size={12} className="mr-1" />
                            <span>{comparison.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {comparison.products} products
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                          <Share2 size={16} />
                        </button>
                        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                          <Download size={16} />
                        </button>
                        <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <Link
                      to={`/results`}
                      className="absolute inset-0 z-10"
                      aria-label={`View ${comparison.name}`}
                    ></Link>
                  </motion.div>
                ))}
              </div>

              <Link to="/upload" className="glass-card p-6 flex items-center justify-center hover:bg-secondary/20 transition-colors">
                <div className="text-center">
                  <div className="rounded-full w-12 h-12 bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                    <BarChart size={24} />
                  </div>
                  <h3 className="font-medium mb-1">Create New Comparison</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload products to start a new comparison
                  </p>
                </div>
              </Link>
            </div>

            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Recent Activity</h2>
                  <Clock size={18} className="text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{activity.product}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{activity.action}</span>
                          <span className="mx-1.5">•</span>
                          <span>{activity.date}</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {activity.change}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link
                    to="/activity"
                    className="text-sm text-primary flex items-center hover:underline"
                  >
                    <span>View all activity</span>
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card p-6 mt-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Statistics</h2>
                  <BarChart size={18} className="text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Comparisons</span>
                    <span className="font-medium">{savedComparisons.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Products Analyzed</span>
                    <span className="font-medium">31</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Price Updates</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Update</span>
                    <span className="font-medium">3 hours ago</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SavedComparisons;
