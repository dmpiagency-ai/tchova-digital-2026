/**
 * Logger utility for production-safe logging
 * Automatically disables console.log in production, keeps errors visible
 */

import { env } from '@/config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LogData = any; // Allow any data type for logging flexibility

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: LogData;
  timestamp: string;
}

class Logger {
  private isDevelopment: boolean;
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Keep last 100 logs in memory

  constructor() {
    this.isDevelopment = env.isDevelopment;
  }

  /**
   * Log informational messages (only in development)
   */
  info(message: string, ...data: LogData[]): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, ...data);
      this.addLog('info', message, data);
    }
  }

  /**
   * Log warnings (only in development)
   */
  warn(message: string, ...data: LogData[]): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, ...data);
      this.addLog('warn', message, data);
    }
  }

  /**
   * Log errors (always visible, even in production)
   */
  error(message: string, ...data: LogData[]): void {
    console.error(`[ERROR] ${message}`, ...data);
    this.addLog('error', message, data);

    // In production, you could send errors to a service like Sentry
    if (!this.isDevelopment) {
      this.sendToErrorTracking(message, data);
    }
  }

  /**
   * Debug logs (only in development, verbose)
   */
  debug(message: string, ...data: LogData[]): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...data);
      this.addLog('debug', message, data);
    }
  }

  /**
   * Add log entry to in-memory storage
   */
  private addLog(level: LogLevel, message: string, data?: LogData): void {
    const entry: LogEntry = {
      level,
      message,
      data: data.length > 0 ? data : undefined,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(entry);

    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Get all stored logs (useful for debugging)
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all stored logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Send error to tracking service (Sentry, LogRocket, etc.)
   * Placeholder for future implementation
   */
  private sendToErrorTracking(message: string, data: LogData[]): void {
    // TODO: Integrate with error tracking service
    // Example: Sentry.captureException(new Error(message), { extra: data });

    // For now, just store it
    if (typeof window !== 'undefined') {
      const errorKey = `error_${Date.now()}`;
      try {
        sessionStorage.setItem(errorKey, JSON.stringify({ message, data, timestamp: new Date().toISOString() }));
      } catch (e) {
        // SessionStorage might be full or disabled
      }
    }
  }

  /**
   * Log service/API calls (only in development)
   */
  logServiceCall(serviceName: string, method: string, params?: LogData): void {
    if (this.isDevelopment) {
      console.log(
        `%c[SERVICE] ${serviceName}.${method}`,
        'color: #00C853; font-weight: bold',
        params || ''
      );
      this.addLog('debug', `${serviceName}.${method}`, params);
    }
  }

  /**
   * Log performance metrics
   */
  logPerformance(label: string, duration: number): void {
    if (this.isDevelopment) {
      console.log(
        `%c[PERF] ${label}: ${duration.toFixed(2)}ms`,
        'color: #FFC107; font-weight: bold'
      );
      this.addLog('debug', `Performance: ${label}`, { duration });
    }
  }

  /**
   * Group related logs together (only in development)
   */
  group(label: string): void {
    if (this.isDevelopment) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for testing or advanced usage
export { Logger };
