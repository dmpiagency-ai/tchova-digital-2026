// Box Tool Interface
export interface BoxTool {
  id: string;
  name: string;
  nickname?: string;
  image: string;
  description: string;
  price: number;
  status: 'available' | 'in_use' | 'maintenance';
  category: 'chimera' | 'server' | 'remote' | 'check' | 'credit';
  features?: string[];
  models?: string;
  chips?: string;
  rating: number;
  rentals: number;
}

// Rental Interface
export interface Rental {
  id: string;
  toolName: string;
  toolId: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'cancelled';
  price: number;
  duration: number;
}

// User Wallet Interface
export interface WalletData {
  balance: number;
  totalSpent: number;
  rentals: number;
  bonusPoints: number;
}

// Transaction Interface
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'rental' | 'bonus';
  amount: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

export type GSMViewType = 'dashboard' | 'tools' | 'rentals' | 'imei' | 'wallet' | 'profile';
