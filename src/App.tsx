import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useAuth } from "@/contexts/AuthContext";
// import { supabase } from "./integrations/supabase/client";
// // import { User } from "@supabase/supabase-js";
import PublicRoute from "./components/PublicRoutes";
import ProtectedRoute from "./components/ProtectedRoutes";
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Subscription = lazy(() => import("./pages/Subscription"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ChatScreen = lazy(() => import("./pages/ChatScreen"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}> 
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />

            <Route element={<PublicRoute />}>
              <Route path="/auth" element={<Auth />} />
            </Route>

            {/* Protected and private routes for "user" */}
            <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/chat" element={<ChatScreen />} />
            </Route>

            {/* Protected and private routes for all 3 type of users */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["user", "admin", "support_team"]}
                />
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Protected and private route for "admin" */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
            </Route>

            {/* Protected and private route for "support_team" */}
            <Route element={<ProtectedRoute allowedRoles={["support_team"]} />}>
              {/* <Route
                path="/support-team-dashboard"
                element={<SupportTeamDashboard />}
              /> */}
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Sonner />
        </TooltipProvider>
      </Suspense>
    </QueryClientProvider>
  );
};

export default App;
