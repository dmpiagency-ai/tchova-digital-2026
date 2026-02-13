import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { AICreditsProvider } from "@/contexts/AICreditsContext";
import { Notification } from "@/components/Notification";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageLoader } from "@/components/PageLoader";

// Code splitting: Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const Login = lazy(() => import("./pages/Login"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails"));
const Payment = lazy(() => import("./pages/Payment"));
const PlanCustomizer = lazy(() => import("./pages/PlanCustomizer"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange={false}
        storageKey="tchova-digital-theme"
      >
        <AdminProvider>
          <AuthProvider>
            <AICreditsProvider>
              <TooltipProvider>
              <Toaster />
              <Sonner />
              <Notification />
              <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/admin/gsm" element={<Admin />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/service-details" element={<ServiceDetails />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/customize-plan" element={<PlanCustomizer />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </AICreditsProvider>
        </AuthProvider>
      </AdminProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
