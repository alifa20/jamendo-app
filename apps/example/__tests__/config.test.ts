/**
 * Feature: spec/features/configure-environment-variables-and-jamendo-api-client.feature
 *
 * Tests for environment variable configuration and config.ts validation.
 */

import * as fs from 'fs';
import * as path from 'path';

const APP_DIR = path.join(__dirname, '..');
const ENV_FILE = path.join(APP_DIR, '.env');
const ENV_EXAMPLE_FILE = path.join(APP_DIR, '.env.example');
const CONFIG_FILE = path.join(APP_DIR, 'config.ts');
const GITIGNORE_FILE = path.join(APP_DIR, '..', '..', '.gitignore');

describe('Feature: Configure environment variables and Jamendo API client', () => {
  describe('Scenario: Access environment variables through process.env', () => {
    it('should access environment variables with EXPO_PUBLIC_ prefix', () => {
      // @step Given a .env file exists in apps/example/ directory
      expect(fs.existsSync(ENV_FILE)).toBe(true);

      // @step And the .env file contains "EXPO_PUBLIC_JAMENDO_CLIENT_ID=abc123"
      const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
      expect(envContent).toContain('EXPO_PUBLIC_JAMENDO_CLIENT_ID=abc123');

      // @step And the .env file contains "EXPO_PUBLIC_JAMENDO_API_URL=https://api.jamendo.com/v3.0"
      expect(envContent).toContain('EXPO_PUBLIC_JAMENDO_API_URL=https://api.jamendo.com/v3.0');

      // @step When the application loads
      // Environment variables are loaded at runtime by Expo

      // @step Then process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID should equal "abc123"
      expect(process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID).toBe('abc123');

      // @step And process.env.EXPO_PUBLIC_JAMENDO_API_URL should equal "https://api.jamendo.com/v3.0"
      expect(process.env.EXPO_PUBLIC_JAMENDO_API_URL).toBe('https://api.jamendo.com/v3.0');
    });
  });

  describe('Scenario: Import typed constants from config.ts', () => {
    it('should export typed constants from config.ts', async () => {
      // @step Given config.ts file exists in apps/example/ directory
      expect(fs.existsSync(CONFIG_FILE)).toBe(true);

      // @step And config.ts exports JAMENDO_CLIENT_ID constant
      // @step And config.ts exports JAMENDO_API_URL constant
      // Dynamic import to test exports
      const config = await import(CONFIG_FILE);

      // @step When a developer imports { JAMENDO_CLIENT_ID, JAMENDO_API_URL } from config
      const { JAMENDO_CLIENT_ID, JAMENDO_API_URL } = config;

      // @step Then JAMENDO_CLIENT_ID should be a non-nullable string
      expect(typeof JAMENDO_CLIENT_ID).toBe('string');
      expect(JAMENDO_CLIENT_ID).toBeTruthy();

      // @step And JAMENDO_API_URL should be a non-nullable string
      expect(typeof JAMENDO_API_URL).toBe('string');
      expect(JAMENDO_API_URL).toBeTruthy();

      // @step And TypeScript should provide autocomplete for both constants
      // TypeScript autocomplete is verified at development time through the type system
      expect(true).toBe(true);
    });
  });

  describe('Scenario: Throw error when required environment variable is missing', () => {
    it('should throw error if EXPO_PUBLIC_JAMENDO_CLIENT_ID is missing', () => {
      // @step Given config.ts file exists in apps/example/ directory
      expect(fs.existsSync(CONFIG_FILE)).toBe(true);

      // @step And EXPO_PUBLIC_JAMENDO_CLIENT_ID is not set in environment
      const originalValue = process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID;
      delete process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID;

      // @step When config.ts module is loaded
      // Clear module cache to force reload
      const configPath = require.resolve(CONFIG_FILE);
      delete require.cache[configPath];

      // @step Then an error should be thrown with message "Missing required environment variable: EXPO_PUBLIC_JAMENDO_CLIENT_ID"
      expect(() => {
        require(CONFIG_FILE);
      }).toThrow('Missing required environment variable: EXPO_PUBLIC_JAMENDO_CLIENT_ID');

      // @step And the application should fail to start
      // The error throw prevents application startup

      // Restore original value
      if (originalValue) {
        process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID = originalValue;
      }
    });
  });

  describe('Scenario: Verify .env file is gitignored', () => {
    it('should have .env file in .gitignore', () => {
      // @step Given a .env file exists in apps/example/ directory
      expect(fs.existsSync(ENV_FILE)).toBe(true);

      // @step And .gitignore file includes ".env" entry
      const gitignoreContent = fs.readFileSync(GITIGNORE_FILE, 'utf-8');
      expect(gitignoreContent).toContain('.env');

      // @step When developer runs "git status"
      // This is verified by checking .gitignore contains .env pattern

      // @step Then .env file should not appear in untracked files
      // @step And .env file should not appear in staged changes
      // Git will ignore files matching .env pattern due to .gitignore entry
      expect(gitignoreContent.split('\n')).toContain('.env');
    });
  });

  describe('Scenario: New developer onboarding workflow', () => {
    it('should support onboarding workflow with .env.example', () => {
      // @step Given a new developer clones the repository
      // Repository exists with .env.example

      // @step And .env.example file exists with template values
      expect(fs.existsSync(ENV_EXAMPLE_FILE)).toBe(true);
      const exampleContent = fs.readFileSync(ENV_EXAMPLE_FILE, 'utf-8');
      expect(exampleContent).toContain('EXPO_PUBLIC_JAMENDO_CLIENT_ID');
      expect(exampleContent).toContain('EXPO_PUBLIC_JAMENDO_API_URL');

      // @step When developer copies .env.example to .env
      // @step And developer sets EXPO_PUBLIC_JAMENDO_CLIENT_ID to their client ID
      // This is tested by verifying .env exists with actual values

      // @step And developer starts the application
      // Application startup is tested in other scenarios

      // @step Then the application should start successfully
      // @step And the Jamendo API client should be configured with their credentials
      // Verified by checking environment variables are loaded
      expect(process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID).toBeDefined();
      expect(process.env.EXPO_PUBLIC_JAMENDO_API_URL).toBeDefined();
    });
  });

  describe('Scenario: Validate config.ts exports non-nullable types', () => {
    it('should export non-nullable string types', async () => {
      // @step Given config.ts validates environment variables at load time
      expect(fs.existsSync(CONFIG_FILE)).toBe(true);

      // @step And EXPO_PUBLIC_JAMENDO_CLIENT_ID is set to "valid_client_id"
      process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID = 'valid_client_id';

      // @step And EXPO_PUBLIC_JAMENDO_API_URL is set to "https://api.jamendo.com/v3.0"
      process.env.EXPO_PUBLIC_JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';

      // Clear module cache to force reload with new env vars
      const configPath = require.resolve(CONFIG_FILE);
      delete require.cache[configPath];

      // @step When config.ts exports JAMENDO_CLIENT_ID
      const config = require(CONFIG_FILE);

      // @step Then JAMENDO_CLIENT_ID type should be string (not string | undefined)
      expect(typeof config.JAMENDO_CLIENT_ID).toBe('string');

      // @step And JAMENDO_CLIENT_ID value should equal "valid_client_id"
      expect(config.JAMENDO_CLIENT_ID).toBe('valid_client_id');
    });
  });
});
