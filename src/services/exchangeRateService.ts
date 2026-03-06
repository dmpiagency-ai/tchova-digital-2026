// ============================================
// EXCHANGE RATE SERVICE
// Serviço para obter taxas de câmbio em tempo real
// ============================================

import { Currency } from '@/types/gsm';

// Interface para resposta da API exchangerate-api.com
interface ExchangeRateAPIResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

// Taxas de fallback para casos de falha na API
const FALLBACK_EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  MTN: 64
};

// Cache para taxas de câmbio (expira em 1 hora)
let exchangeRateCache: {
  rates: Record<Currency, number>;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hora em milissegundos

/**
 * Obtém taxas de câmbio em tempo real da API exchangerate-api.com
 * @returns Promise com taxas de câmbio
 */
export const fetchExchangeRates = async (): Promise<Record<Currency, number>> => {
  const now = Date.now();
  
  // Verifica se o cache é válido
  if (exchangeRateCache && (now - exchangeRateCache.timestamp) < CACHE_DURATION) {
    console.log('Using cached exchange rates');
    return exchangeRateCache.rates;
  }
  
  try {
    console.log('Fetching real-time exchange rates');
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.status}`);
    }
    
    const data: ExchangeRateAPIResponse = await response.json();
    
    // MZN é o código ISO para Metical Moçambicano
    const mznRate = data.rates.MZN;
    
    const rates: Record<Currency, number> = {
      USD: 1,
      MTN: mznRate
    };
    
    // Atualiza o cache
    exchangeRateCache = {
      rates,
      timestamp: now
    };
    
    console.log('Exchange rates updated:', rates);
    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    console.log('Using fallback exchange rates');
    return { ...FALLBACK_EXCHANGE_RATES };
  }
};

/**
 * Obtém taxas de câmbio (usando cache se disponível)
 * @returns Promise com taxas de câmbio
 */
export const getExchangeRates = async (): Promise<Record<Currency, number>> => {
  return fetchExchangeRates();
};

/**
 * Converte valor de uma moeda para outra usando taxas em tempo real
 * @param amount Valor a converter
 * @param from Moeda de origem
 * @param to Moeda de destino
 * @returns Promise com valor convertido
 */
export const convertCurrency = async (
  amount: number,
  from: Currency,
  to: Currency
): Promise<number> => {
  if (from === to) return amount;
  
  const rates = await getExchangeRates();
  
  const fromRate = rates[from];
  const toRate = rates[to];
  
  // Converter para USD primeiro, depois para a moeda destino
  const usdAmount = amount / fromRate;
  return parseFloat((usdAmount * toRate).toFixed(2));
};

/**
 * Atualiza manualmente as taxas de câmbio (para testes)
 */
export const setExchangeRates = (rates: Partial<Record<Currency, number>>): void => {
  const now = Date.now();
  
  if (!exchangeRateCache) {
    exchangeRateCache = {
      rates: { ...FALLBACK_EXCHANGE_RATES },
      timestamp: now
    };
  }
  
  exchangeRateCache.rates = {
    ...exchangeRateCache.rates,
    ...rates
  };
  
  exchangeRateCache.timestamp = now;
  
  console.log('Exchange rates manually updated:', exchangeRateCache.rates);
};

/**
 * Limpa o cache de taxas de câmbio
 */
export const clearExchangeRateCache = (): void => {
  exchangeRateCache = null;
  console.log('Exchange rate cache cleared');
};

/**
 * Obtém a data da última atualização das taxas de câmbio
 */
export const getLastExchangeRateUpdate = (): Date | null => {
  if (!exchangeRateCache) return null;
  return new Date(exchangeRateCache.timestamp);
};
