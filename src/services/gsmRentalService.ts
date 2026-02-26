// ============================================
// GSM RENTAL SERVICE
// Lógica de negócio para aluguel de ferramentas GSM
// ============================================

import {
  Currency,
  EXCHANGE_RATES,
  UserLevel,
  USER_LEVELS,
  GSMTool,
  GSMRental,
  GSMTransaction,
  GSMWallet,
  RentalCredentials,
  RentalStatus,
  TransactionType,
  TransactionStatus,
  ToolPricing,
  CheckoutItem
} from '@/types/gsm';

// ============================================
// CONSTANTS
// ============================================

const STORAGE_KEYS = {
  WALLET: 'gsm_wallet',
  RENTALS: 'gsm_rentals',
  TRANSACTIONS: 'gsm_transactions',
  PREFERRED_CURRENCY: 'gsm_preferred_currency'
};

// ============================================
// CURRENCY CONVERSION
// ============================================

/**
 * Converte valor de uma moeda para outra
 * @param amount Valor a converter
 * @param from Moeda de origem
 * @param to Moeda de destino
 * @returns Valor convertido
 */
export const convertCurrency = (
  amount: number,
  from: Currency,
  to: Currency
): number => {
  if (from === to) return amount;
  
  const fromRate = EXCHANGE_RATES[from].rate;
  const toRate = EXCHANGE_RATES[to].rate;
  
  // Converter para USD primeiro, depois para a moeda destino
  const usdAmount = amount / fromRate;
  return parseFloat((usdAmount * toRate).toFixed(2));
};

/**
 * Converte ToolPricing para uma moeda específica
 */
export const convertPricing = (
  pricing: ToolPricing,
  currency: Currency
): number => {
  return currency === 'USD' ? pricing.usd : pricing.mtn;
};

/**
 * Formata valor com símbolo da moeda
 */
export const formatCurrency = (
  amount: number,
  currency: Currency
): string => {
  const symbol = EXCHANGE_RATES[currency].symbol;
  return `${symbol} ${amount.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ============================================
// PRICING CALCULATIONS
// ============================================

/**
 * Calcula desconto baseado no nível do usuário
 */
export const calculateLevelDiscount = (
  basePrice: number,
  level: UserLevel
): { originalPrice: number; discount: number; finalPrice: number } => {
  const discountPercent = USER_LEVELS[level].discount;
  const discount = basePrice * (discountPercent / 100);
  const finalPrice = basePrice - discount;
  
  return {
    originalPrice: parseFloat(basePrice.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    finalPrice: parseFloat(finalPrice.toFixed(2))
  };
};

/**
 * Calcula preço do aluguel com descontos progressivos
 */
export const calculateRentalPrice = (
  tool: GSMTool,
  duration: number,
  level: UserLevel,
  currency: Currency
): {
  basePrice: number;
  durationDiscount: number;
  levelDiscount: number;
  totalDiscount: number;
  finalPrice: number;
  currency: Currency;
} => {
  // Preço base por hora
  const hourlyPrice = convertPricing(tool.pricing[level], currency);
  const basePrice = hourlyPrice * duration;
  
  // Desconto por duração (progressivo)
  let durationDiscountPercent = 0;
  if (duration >= 24) durationDiscountPercent = 25;
  else if (duration >= 12) durationDiscountPercent = 20;
  else if (duration >= 8) durationDiscountPercent = 15;
  else if (duration >= 6) durationDiscountPercent = 10;
  else if (duration >= 4) durationDiscountPercent = 5;
  
  const durationDiscount = basePrice * (durationDiscountPercent / 100);
  
  // Desconto por nível já está incluído no preço
  const levelDiscountPercent = USER_LEVELS[level].discount;
  const levelDiscount = basePrice * (levelDiscountPercent / 100);
  
  // Preço final
  const totalDiscount = durationDiscount;
  const finalPrice = basePrice - totalDiscount;
  
  return {
    basePrice: parseFloat(basePrice.toFixed(2)),
    durationDiscount: parseFloat(durationDiscount.toFixed(2)),
    levelDiscount: parseFloat(levelDiscount.toFixed(2)),
    totalDiscount: parseFloat(totalDiscount.toFixed(2)),
    finalPrice: parseFloat(finalPrice.toFixed(2)),
    currency
  };
};

// ============================================
// CREDENTIAL GENERATION
// ============================================

/**
 * Gera senha segura aleatória
 */
const generateSecurePassword = (length: number = 12): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*';
  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  
  return password;
};

/**
 * Gera username único
 */
const generateUsername = (toolKey: string, transactionId: string): string => {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${toolKey}_${transactionId.slice(-6)}_${random}`;
};

/**
 * Gera credenciais para o aluguel
 */
export const generateRentalCredentials = (
  tool: GSMTool,
  duration: number,
  transactionId: string
): RentalCredentials => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + duration * 60 * 60 * 1000);
  
  return {
    username: generateUsername(tool.key, transactionId),
    password: generateSecurePassword(14),
    url: tool.server.url,
    port: tool.server.port,
    expiresAt,
    createdAt: now
  };
};

// ============================================
// WALLET MANAGEMENT
// ============================================

/**
 * Obtém a carteira do usuário
 */
export const getWallet = (userId: string): GSMWallet | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WALLET);
    if (!stored) return null;
    
    const wallets = JSON.parse(stored);
    const wallet = wallets[userId];
    
    if (!wallet) return null;
    
    // Converter datas
    wallet.createdAt = new Date(wallet.createdAt);
    wallet.updatedAt = new Date(wallet.updatedAt);
    
    return wallet;
  } catch {
    return null;
  }
};

/**
 * Cria ou atualiza a carteira do usuário
 */
export const saveWallet = (wallet: GSMWallet): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WALLET);
    const wallets = stored ? JSON.parse(stored) : {};
    
    wallets[wallet.userId] = {
      ...wallet,
      updatedAt: new Date()
    };
    
    localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallets));
  } catch (error) {
    console.error('Error saving wallet:', error);
  }
};

/**
 * Cria carteira inicial para novo usuário
 */
export const createWallet = (
  userId: string,
  level: UserLevel = 'cliente',
  initialBalance: ToolPricing = { usd: 0, mtn: 0 }
): GSMWallet => {
  const now = new Date();
  
  const wallet: GSMWallet = {
    userId,
    balance: initialBalance,
    currency: 'MTN',
    level,
    totalSpent: { usd: 0, mtn: 0 },
    totalRentals: 0,
    createdAt: now,
    updatedAt: now
  };
  
  saveWallet(wallet);
  return wallet;
};

/**
 * Atualiza saldo da carteira
 */
export const updateWalletBalance = (
  userId: string,
  amount: ToolPricing,
  operation: 'add' | 'subtract'
): GSMWallet | null => {
  const wallet = getWallet(userId);
  if (!wallet) return null;
  
  if (operation === 'add') {
    wallet.balance.usd += amount.usd;
    wallet.balance.mtn += amount.mtn;
  } else {
    wallet.balance.usd -= amount.usd;
    wallet.balance.mtn -= amount.mtn;
  }
  
  saveWallet(wallet);
  return wallet;
};

/**
 * Verifica se o usuário tem saldo suficiente
 */
export const hasSufficientBalance = (
  userId: string,
  amount: number,
  currency: Currency
): { sufficient: boolean; balance: number; deficit: number } => {
  const wallet = getWallet(userId);
  
  if (!wallet) {
    return { sufficient: false, balance: 0, deficit: amount };
  }
  
  const balance = currency === 'USD' ? wallet.balance.usd : wallet.balance.mtn;
  const sufficient = balance >= amount;
  const deficit = sufficient ? 0 : amount - balance;
  
  return { sufficient, balance, deficit };
};

// ============================================
// RENTAL MANAGEMENT
// ============================================

/**
 * Gera ID único para transação
 */
const generateTransactionId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TXN_${timestamp}_${random}`.toUpperCase();
};

/**
 * Gera ID único para aluguel
 */
const generateRentalId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `RNT_${timestamp}_${random}`.toUpperCase();
};

/**
 * Cria um novo aluguel
 */
export const createRental = (
  tool: GSMTool,
  userId: string,
  userEmail: string,
  userName: string,
  duration: number,
  currency: Currency
): { rental: GSMRental; transaction: GSMTransaction } | null => {
  // Obter carteira e nível
  const wallet = getWallet(userId);
  const level = wallet?.level || 'cliente';
  
  // Calcular preço
  const pricing = calculateRentalPrice(tool, duration, level, currency);
  
  // Verificar saldo
  const balanceCheck = hasSufficientBalance(userId, pricing.finalPrice, currency);
  if (!balanceCheck.sufficient) {
    return null;
  }
  
  // Gerar IDs
  const transactionId = generateTransactionId();
  const rentalId = generateRentalId();
  
  // Gerar credenciais
  const credentials = generateRentalCredentials(tool, duration, transactionId);
  
  // Criar aluguel
  const now = new Date();
  const expiresAt = new Date(now.getTime() + duration * 60 * 60 * 1000);
  
  const rental: GSMRental = {
    id: rentalId,
    transactionId,
    toolId: tool.id,
    toolKey: tool.key,
    toolName: tool.name,
    userId,
    userEmail,
    userName,
    duration,
    durationMinutes: duration * 60,
    pricing: {
      basePrice: {
        usd: convertCurrency(pricing.basePrice, currency, 'USD'),
        mtn: convertCurrency(pricing.basePrice, currency, 'MTN')
      },
      discount: pricing.totalDiscount,
      finalPrice: {
        usd: convertCurrency(pricing.finalPrice, currency, 'USD'),
        mtn: convertCurrency(pricing.finalPrice, currency, 'MTN')
      },
      currency
    },
    status: 'active',
    credentials,
    createdAt: now,
    startedAt: now,
    expiresAt
  };
  
  // Criar transação
  const transaction: GSMTransaction = {
    id: transactionId,
    userId,
    type: 'rental',
    status: 'completed',
    amount: rental.pricing.finalPrice,
    currency,
    rentalId,
    createdAt: now,
    completedAt: now,
    description: `Aluguel de ${tool.name} por ${duration}h`
  };
  
  // Debitar saldo
  updateWalletBalance(userId, rental.pricing.finalPrice, 'subtract');
  
  // Atualizar estatísticas da carteira
  if (wallet) {
    wallet.totalSpent.usd += rental.pricing.finalPrice.usd;
    wallet.totalSpent.mtn += rental.pricing.finalPrice.mtn;
    wallet.totalRentals += 1;
    saveWallet(wallet);
  }
  
  // Salvar aluguel e transação
  saveRental(rental);
  saveTransaction(transaction);
  
  return { rental, transaction };
};

/**
 * Salva aluguel no localStorage
 */
export const saveRental = (rental: GSMRental): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RENTALS);
    const rentals = stored ? JSON.parse(stored) : [];
    
    // Adicionar no início
    rentals.unshift(rental);
    
    localStorage.setItem(STORAGE_KEYS.RENTALS, JSON.stringify(rentals));
  } catch (error) {
    console.error('Error saving rental:', error);
  }
};

/**
 * Obtém aluguéis do usuário
 */
export const getUserRentals = (userId: string): GSMRental[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RENTALS);
    if (!stored) return [];
    
    const rentals: GSMRental[] = JSON.parse(stored);
    
    // Filtrar por usuário e converter datas
    return rentals
      .filter((r) => r.userId === userId)
      .map((r) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        expiresAt: new Date(r.expiresAt),
        startedAt: r.startedAt ? new Date(r.startedAt) : undefined,
        completedAt: r.completedAt ? new Date(r.completedAt) : undefined,
        cancelledAt: r.cancelledAt ? new Date(r.cancelledAt) : undefined,
        credentials: {
          ...r.credentials,
          createdAt: new Date(r.credentials.createdAt),
          expiresAt: new Date(r.credentials.expiresAt)
        }
      }));
  } catch {
    return [];
  }
};

/**
 * Obtém aluguel ativo
 */
export const getActiveRental = (userId: string): GSMRental | null => {
  const rentals = getUserRentals(userId);
  const now = new Date();
  
  return rentals.find((r) => {
    return r.status === 'active' && new Date(r.expiresAt) > now;
  }) || null;
};

/**
 * Verifica se um aluguel está ativo
 */
export const isRentalActive = (rental: GSMRental): boolean => {
  if (rental.status !== 'active') return false;
  return new Date(rental.expiresAt) > new Date();
};

/**
 * Calcula tempo restante do aluguel
 */
export const getRemainingTime = (
  rental: GSMRental
): { hours: number; minutes: number; seconds: number; total: number; formatted: string } => {
  const now = new Date();
  const expiresAt = new Date(rental.expiresAt);
  const diff = Math.max(0, expiresAt.getTime() - now.getTime());
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return { hours, minutes, seconds, total: diff, formatted };
};

// ============================================
// TRANSACTION MANAGEMENT
// ============================================

/**
 * Salva transação no localStorage
 */
export const saveTransaction = (transaction: GSMTransaction): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const transactions = stored ? JSON.parse(stored) : [];
    
    transactions.unshift(transaction);
    
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
};

/**
 * Obtém transações do usuário
 */
export const getUserTransactions = (userId: string): GSMTransaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!stored) return [];
    
    const transactions: GSMTransaction[] = JSON.parse(stored);
    
    return transactions
      .filter((t) => t.userId === userId)
      .map((t) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        completedAt: t.completedAt ? new Date(t.completedAt) : undefined
      }));
  } catch {
    return [];
  }
};

/**
 * Adiciona créditos à carteira
 */
export const addCredits = (
  userId: string,
  amount: ToolPricing,
  paymentMethod: string,
  paymentReference?: string
): GSMTransaction | null => {
  const wallet = getWallet(userId);
  if (!wallet) return null;
  
  const transactionId = generateTransactionId();
  const now = new Date();
  
  const transaction: GSMTransaction = {
    id: transactionId,
    userId,
    type: 'topup',
    status: 'completed',
    amount,
    currency: wallet.currency,
    paymentMethod,
    paymentReference,
    createdAt: now,
    completedAt: now,
    description: `Adição de créditos via ${paymentMethod}`
  };
  
  // Atualizar saldo
  updateWalletBalance(userId, amount, 'add');
  
  // Salvar transação
  saveTransaction(transaction);
  
  return transaction;
};

// ============================================
// PREFERENCES
// ============================================

/**
 * Obtém moeda preferida do usuário
 */
export const getPreferredCurrency = (): Currency => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERRED_CURRENCY);
    return (stored as Currency) || 'MTN';
  } catch {
    return 'MTN';
  }
};

/**
 * Define moeda preferida do usuário
 */
export const setPreferredCurrency = (currency: Currency): void => {
  localStorage.setItem(STORAGE_KEYS.PREFERRED_CURRENCY, currency);
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Formata duração em horas para texto legível
 */
export const formatDuration = (hours: number): string => {
  if (hours < 1) return `${hours * 60} minutos`;
  if (hours === 1) return '1 hora';
  if (hours < 24) return `${hours} horas`;
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (remainingHours === 0) {
    return days === 1 ? '1 dia' : `${days} dias`;
  }
  
  return `${days} dia${days > 1 ? 's' : ''} e ${remainingHours}h`;
};

/**
 * Formata data para exibição
 */
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString('pt-MZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Copia texto para clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
