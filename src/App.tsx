
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./components/ThemeProvider";

// Pages
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import SavedComparisons from "./pages/SavedComparisons";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen dark:bg-gray-950">
            <Navbar />
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/saved" element={<SavedComparisons />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
