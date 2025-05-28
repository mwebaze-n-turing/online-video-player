// src/config/testUtils.ts
import { config } from './index';
import { type AppConfig } from './index';
import { type Env } from './env';

// Helper type for deep partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Keep a reference to the original config
const originalConfig = { ...config };

/**
 * Creates a testing utility for mocking config values
 */
export const configTestUtils = {
  /**
   * Reset the configuration back to the original values
   */
  resetConfig: () => {
    // Reset all properties to original values
    Object.keys(originalConfig).forEach(key => {
      (config as any)[key] = (originalConfig as any)[key];
    });
  },

  /**
   * Override configuration with mock values (for testing)
   */
  mockConfig: (mockValues: DeepPartial<AppConfig>) => {
    // Deep merge the mock values
    const deepMerge = (target: any, source: any) => {
      for (const key in source) {
        if (source[key] instanceof Object && key in target) {
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    };

    deepMerge(config, mockValues);

    return config;
  },

  /**
   * Mock specific environment variables
   */
  mockEnv: (envOverrides: Partial<Env>) => {
    // Back up the original process.env
    const originalEnv = { ...process.env };

    // Apply the overrides
    Object.entries(envOverrides).forEach(([key, value]) => {
      process.env[key] = String(value);
    });

    // Return a cleanup function
    return () => {
      Object.keys(envOverrides).forEach(key => {
        process.env[key] = originalEnv[key];
      });
    };
  },
};
