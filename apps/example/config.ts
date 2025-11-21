/**
 * Environment Configuration
 *
 * Validates and exports typed constants from environment variables.
 * Fails fast if required environment variables are missing.
 */

/**
 * Validate required environment variable
 */
function getRequiredEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Jamendo API Client ID
 * Required for all API requests
 */
export const JAMENDO_CLIENT_ID = getRequiredEnvVar('EXPO_PUBLIC_JAMENDO_CLIENT_ID');

/**
 * Jamendo API Base URL
 * Default: https://api.jamendo.com/v3.0
 */
export const JAMENDO_API_URL = getRequiredEnvVar('EXPO_PUBLIC_JAMENDO_API_URL');
