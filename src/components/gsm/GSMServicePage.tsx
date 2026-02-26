// ============================================
// GSM SERVICE PAGE - MAIN CONTAINER
// Integra todos os componentes do GSM Rental Painel
// Design Liquid Glass Moderno
// ============================================

import { useState, useMemo, useCallback } from 'react';
import { GSMTool, GSMRental, Currency, UserLevel } from '@/types/gsm';
import { getWallet, getPreferredCurrency } from '@/services/gsmRentalService';
import { useAuth } from '@/contexts/AuthContext';

// Components
import GSMHero from './GSMHero';
import GSMFeatures from './GSMFeatures';
import GSMToolsShowcase from './GSMToolsShowcase';
import GSMRentalDashboard from './GSMRentalDashboard';
import GSMCheckout from './GSMCheckout';
import GSMCTA from './GSMCTA';

const GSMServicePage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  // State
  const [selectedTool, setSelectedTool] = useState<GSMTool | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>(getPreferredCurrency());

  // Get user level from wallet
  const userLevel = useMemo((): UserLevel => {
    const wallet = getWallet(userId);
    return wallet?.level || 'cliente';
  }, [userId]);

  // Handle tool selection
  const handleToolSelect = useCallback((tool: GSMTool) => {
    setSelectedTool(tool);
    setIsCheckoutOpen(true);
  }, []);

  // Handle checkout close
  const handleCheckoutClose = useCallback(() => {
    setIsCheckoutOpen(false);
    setSelectedTool(null);
  }, []);

  // Handle rental confirmation
  const handleRentalConfirm = useCallback((rental: GSMRental) => {
    console.log('Rental confirmed:', rental);
    // Could add success notification here
  }, []);

  // Handle sign up
  const handleSignUp = useCallback(() => {
    // Navigate to sign up or open modal
    console.log('Sign up clicked');
  }, []);

  // Handle contact
  const handleContact = useCallback(() => {
    // Open WhatsApp or contact form
    console.log('Contact clicked');
  }, []);

  // Scroll to tools section
  const scrollToTools = useCallback(() => {
    const toolsSection = document.getElementById('gsm-tools-section');
    toolsSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <GSMHero
        onCtaClick={scrollToTools}
        onToolsClick={scrollToTools}
      />

      {/* Features Section */}
      <GSMFeatures />

      {/* Tools Showcase Section */}
      <div id="gsm-tools-section">
        <GSMToolsShowcase
          userLevel={userLevel}
          currency={currency}
          onToolSelect={handleToolSelect}
        />
      </div>

      {/* Rental Dashboard Section */}
      <GSMRentalDashboard />

      {/* CTA Section */}
      <GSMCTA
        onSignUp={handleSignUp}
        onContact={handleContact}
      />

      {/* Checkout Modal */}
      <GSMCheckout
        tool={selectedTool}
        isOpen={isCheckoutOpen}
        onClose={handleCheckoutClose}
        onConfirm={handleRentalConfirm}
        userLevel={userLevel}
      />
    </div>
  );
};

export default GSMServicePage;
