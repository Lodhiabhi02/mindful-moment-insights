
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import JournalPage from "@/pages/JournalPage";
import InsightsPage from "@/pages/InsightsPage";
import Profile from "@/pages/Profile";
import UserSettings from "@/components/UserSettings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<UserSettings />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
