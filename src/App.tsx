import { lazy, Suspense, useEffect } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "next-themes";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { AICreditsProvider } from "@/contexts/AICreditsContext";
import { Notification } from "@/components/Notification";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageLoader } from "@/components/PageLoader";
import { SmoothScroll } from "@/components/SmoothScroll";

// Redirect component for /gsm/tools
const ToolsRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/gsm?view=tools', { replace: true });
  }, [navigate]);
  return null;
};

// Code splitting: Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const Login = lazy(() => import("./pages/Login"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails"));
const Payment = lazy(() => import("./pages/Payment"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const ClientPanel = lazy(() => import("./pages/ClientPanel"));
const PlanCustomizer = lazy(() => import("./pages/PlanCustomizer"));
const NotFound = lazy(() => import("./pages/NotFound"));
const GSMTechDashboard = lazy(() => import("@/components/gsm/GSMTechDashboard"));

const queryClient = new QueryClient();

// Global Theme Enforcer - Locks public site to dark mode, except GSM
const ThemeEnforcer = ({ children }: { children: React.ReactNode }) => {
  const { setTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    // Only force dark mode if we are NOT in a GSM-related path
    if (!location.pathname.startsWith('/gsm')) {
      setTheme('dark');
    }
  }, [location.pathname, setTheme]);

  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
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
                <ThemeEnforcer>
                  <SmoothScroll>
                    <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/admin/gsm" element={<Admin />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/service-details" element={<ServiceDetails />} />
                      <Route path="/gsm" element={<GSMTechDashboard />} />
                      <Route path="/gsm/tech" element={<GSMTechDashboard />} />
                      <Route path="/gsm/rental" element={<GSMTechDashboard />} />
                      <Route path="/gsm/dashboard" element={<GSMTechDashboard />} />
                      <Route path="/gsm/tools" element={<ToolsRedirect />} />
                      <Route path="/payment" element={<Payment />} />
                      <Route path="/checkout/seguro" element={<Checkout />} />
                      <Route path="/checkout/sucesso" element={<CheckoutSuccess />} />
                      <Route path="/painel/:token" element={<ClientPanel />} />
                      <Route path="/customize-plan" element={<PlanCustomizer />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    </Suspense>
                  </SmoothScroll>
                </ThemeEnforcer>
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
