// ============================================
// DIGITAL BOX RENTAL API - TYPES
// Sistema SaaS de Aluguel de Boxes GSM via API
// ============================================

import { GSMTool, Currency, UserLevel } from '@/types/gsm';

// ============================================
// CREDIT & PRICING TYPES
// ============================================

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: {
    mtn: number;
    usd: number;
  };
  bonusCredits?: number;
  popular?: boolean;
}

export interface UserCredits {
  userId: string;
  totalCredits: number;
  usedCredits: number;
  availableCredits: number;
  lastTopUp?: Date;
  expiryDate?: Date;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'rental' | 'refund' | 'bonus';
  amount: number;
  credits: number;
  description: string;
  timestamp: Date;
}

// ============================================
// RENTAL SESSION TYPES
// ============================================

export type RentalStatus = 'pending' | 'connecting' | 'active' | 'paused' | 'disconnected' | 'completed' | 'expired' | 'error';

export interface RentalSession {
  id: string;
  userId: string;
  toolId: string;
  boxId: string;
  boxName: string;
  
  // Credit/Debit System
  creditDeductionRate: number; // credits per second
  totalCreditsSpent: number;
  remainingCredits: number;
  
  // Time Tracking
  startTime: Date;
  endTime?: Date;
  pausedAt?: Date;
  totalActiveTime: number; // in seconds
  
  // Connection
  status: RentalStatus;
  connectionUrl: string;
  remotePort: number;
  latency?: number; // ms
  
  // Credentials
  username: string;
  password: string;
  
  // Metadata
  ipAddress?: string;
  userAgent?: string;
  errorMessage?: string;
}

export interface RentalSessionCreate {
  toolId: string;
  boxId?: string; // Optional - auto-select if not provided
  requestedDuration: number; // in seconds
  maxCredits?: number; // Optional limit
}

// ============================================
// BOX / SERVER TYPES
// ============================================

export type BoxStatus = 'available' | 'in-use' | 'maintenance' | 'offline';

export interface DigitalBox {
  id: string;
  name: string;
  toolId: string;
  toolName: string;
  
  // Hardware Info
  ip: string;
  port: number;
  protocol: 'rdp' | 'vnc' | 'ssh' | 'http';
  
  // Status
  status: BoxStatus;
  currentSessionId?: string;
  currentUserId?: string;
  
  // Metrics
  cpuUsage?: number;
  memoryUsage?: number;
  uptime?: number;
  
  // Lock System
  lockedAt?: Date;
  lockedBy?: string;
  lockExpiresAt?: Date;
  
  // Latency
  averageLatency: number;
  lastLatencyCheck: Date;
}

export interface BoxMetrics {
  boxId: string;
  timestamp: Date;
  latency: number;
  cpu: number;
  memory: number;
  networkIn: number;
  networkOut: number;
}

// ============================================
// VIDEO ON DEMAND TYPES
// ============================================

export interface VideoCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  videoCount: number;
}

export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  tags: string[];
  
  // Video Info
  duration: number; // seconds
  thumbnailUrl: string;
  videoUrl: string;
  
  // Related Errors
  relatedErrors: string[]; // Error codes this video solves
  
  // Metadata
  views: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoProgress {
  userId: string;
  videoId: string;
  watchedSeconds: number;
  completed: boolean;
  lastWatched: Date;
}

// ============================================
// SUPPORT TICKET TYPES
// ============================================

export interface SupportTicket {
  id: string;
  userId: string;
  
  // Ticket Info
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'waiting-user' | 'resolved' | 'closed';
  
  // Related Session
  sessionId?: string;
  boxId?: string;
  
  // API Logs
  apiLogs: ApiLogEntry[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  
  // Messages
  messages: SupportMessage[];
}

export interface ApiLogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  endpoint: string;
  method: string;
  request?: any;
  response?: any;
  duration?: number;
  error?: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'user' | 'support' | 'system';
  content: string;
  attachments?: string[];
  timestamp: Date;
}

// ============================================
// IMEI CHECK LOGS
// ============================================

export interface IMEICheckLog {
  id: string;
  userId: string;
  toolId: string;
  
  // IMEI Data
  imei: string;
  serialNumber?: string;
  
  // Result
  status: 'clean' | 'blacklisted' | 'unknown' | 'error';
  carrier?: string;
  country?: string;
  model?: string;
  
  // Timestamps
  checkedAt: Date;
  responseTime: number; // ms
  
  // Cost
  creditsCost: number;
}

// ============================================
// DASHBOARD WIDGET TYPES
// ============================================

export interface DashboardStats {
  activeSessions: number;
  totalCredits: number;
  availableCredits: number;
  todaySpent: number;
  imeiChecksToday: number;
  averageLatency: number;
}

export interface LatencyUpdate {
  boxId: string;
  latency: number;
  timestamp: Date;
}
