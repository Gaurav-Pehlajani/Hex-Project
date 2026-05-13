import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import Index from "./pages/Index";
import CTIDashboard from "./pages/CTIDashboard";
import AuthCallback from "./pages/AuthCallback";
import Billing from "./pages/Billing";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import UserManual from "./pages/UserManual";
import LandingPage from "./components/LandingPage";
import OperationalChoicePage from "./pages/OperationalChoicePage";
import Academy from "./pages/Academy";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { AuthProvider } from "./contexts/AuthContext";
import { TermsConsentModal } from "@/components/academy/TermsConsentModal";

const queryClient = new QueryClient();

const AppContent = () => {
  const [showTOS, setShowTOS] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const tosAccepted = localStorage.getItem('hex_tos_accepted');
    const isLandingPage = location.pathname === '/';
    const isCallback = location.pathname.startsWith('/auth/callback');
    const isPrivacyOrTerms = location.pathname === '/privacy' || location.pathname === '/terms';
    
    if (!tosAccepted && !isLandingPage && !isCallback && !isPrivacyOrTerms) {
      setShowTOS(true);
    } else {
      setShowTOS(false);
    }
  }, [location.pathname]);

  const handleAcceptTerms = () => {
    localStorage.setItem('hex_tos_accepted', 'true');
    setShowTOS(false);
  };

  const handleDeclineTerms = () => {
    setShowTOS(false);
    // Secure redirect back to landing
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-hex-cyber text-slate-200">
      <TermsConsentModal isOpen={showTOS} onAccept={handleAcceptTerms} onDecline={handleDeclineTerms} />
      
      {showTOS ? (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#020617] overflow-hidden">
          <div className="flex flex-col items-center gap-6 opacity-20 pointer-events-none select-none">
            <Shield className="w-16 h-16 text-hex-primary-fixed animate-pulse" />
            <span className="font-monospace-data text-[10px] uppercase tracking-[0.5em] text-hex-primary-fixed">Access_Restricted // Signature_Required</span>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/selection" element={<OperationalChoicePage />} />
          <Route path="/cti" element={<CTIDashboard />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/manual" element={<UserManual />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/academy/:pathId" element={<Academy />} />
          <Route path="/academy/:pathId/:moduleId" element={<Academy />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
