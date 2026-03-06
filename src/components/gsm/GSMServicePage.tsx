// ============================================
// GSM SERVICE PAGE - MAIN CONTAINER
// Integra todos os componentes do GSM Rental Painel
// Design Liquid Glass Moderno
// ============================================

import { useState, useMemo, useCallback } from 'react';
import { GSMTool, GSMRental, Currency, UserLevel } from '@/types/gsm';
import { getWallet } from '@/services/gsmRentalService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Components
import GSMHero from './GSMHero';
import GSMFeatures from './GSMFeatures';
import GSMToolsShowcase from './GSMToolsShowcase';
import GSMRentalDashboard from './GSMRentalDashboard';
import GSMCheckout from './GSMCheckout';
import GSMCTA from './GSMCTA';
import UserAccountModal from './UserAccountModal';

const GSMServicePage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  // State
  const [selectedTool, setSelectedTool] = useState<GSMTool | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isUserAccountOpen, setIsUserAccountOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>('MTN');

  // Get user level from wallet
  const userLevel = useMemo((): UserLevel => {
    const wallet = getWallet(userId);
    return wallet?.level || 'cliente';
  }, [userId]);

  // Handle tool selection with duration
  const handleToolSelect = useCallback((tool: GSMTool, duration: number = 1) => {
    setSelectedTool(tool);
    setSelectedDuration(duration);
    setIsCheckoutOpen(true);
  }, []);

  // Handle currency change
  const handleCurrencyChange = useCallback((newCurrency: Currency) => {
    console.log('GSMServicePage: Setting currency to', newCurrency);
    setCurrency(newCurrency);
  }, []);

  // Handle checkout close
  const handleCheckoutClose = useCallback(() => {
    setIsCheckoutOpen(false);
    setSelectedTool(null);
  }, []);

  // Handle rental confirmation
  const handleRentalConfirm = useCallback((rental: GSMRental) => {
    console.log('Rental confirmed:', rental);
  }, []);

  // Handle sign up
  const handleSignUp = useCallback(() => {
    console.log('Sign up clicked');
  }, []);

  // Handle contact
  const handleContact = useCallback(() => {
    console.log('Contact clicked');
  }, []);

  // Scroll to tools section
  const scrollToTools = useCallback(() => {
    const toolsSection = document.getElementById('gsm-tools-section');
    toolsSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Simple currency toggle handler
  const toggleCurrency = () => {
    const newCurrency = currency === 'USD' ? 'MTN' : 'USD';
    console.log('GSMServicePage: Toggling currency from', currency, 'to', newCurrency);
    setCurrency(newCurrency);
    
    // Show notification
    const event = new CustomEvent('show-notification', {
      detail: {
        type: 'success',
        title: 'Moeda alterada',
        message: `A moeda foi alterada para ${newCurrency === 'USD' ? 'Dólar' : 'Metical'}`
      }
    });
    window.dispatchEvent(event);
  };

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
          onCurrencyChange={toggleCurrency}
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
