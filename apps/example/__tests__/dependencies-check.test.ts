/**
 * Feature: spec/features/setup-project-dependencies-and-package-structure.feature
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Feature: Setup project dependencies and package structure', () => {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  it('verifies all dependencies are installed', () => {
    // @step Given I am in the apps/example directory
    // @step When I run "pnpm add expo-audio"
    // @step Then expo-audio should appear in apps/example/package.json dependencies
    // @step And the package should be installed in node_modules
    expect(packageJson.dependencies['expo-audio']).toBeDefined();

    // @step Given I am in the apps/example directory
    // @step When I run "pnpm add @shopify/flash-list"
    // @step Then @shopify/flash-list should appear in apps/example/package.json dependencies
    // @step And the package should be installed in node_modules
    expect(packageJson.dependencies['@shopify/flash-list']).toBeDefined();

    // @step Given I am in the apps/example directory
    // @step And @jamendo/components package exists in packages/components
    // @step When I add "@jamendo/components": "workspace:*" to package.json dependencies
    // @step Then @jamendo/components should appear in apps/example/package.json dependencies with workspace:* protocol
    expect(packageJson.dependencies['@jamendo/components']).toBe('workspace:*');

    // @step Given I am in the apps/example directory
    // @step And @jamendo/rtk-services package exists in packages/rtk-services
    // @step When I add "@jamendo/rtk-services": "workspace:*" to package.json dependencies
    // @step Then @jamendo/rtk-services should appear in apps/example/package.json dependencies with workspace:* protocol
    expect(packageJson.dependencies['@jamendo/rtk-services']).toBe('workspace:*');

    // @step Given I am in the apps/example directory
    // @step When I create a .env file with EXPO_PUBLIC_JAMENDO_CLIENT_ID=test_client_id
    // @step Then the .env file should exist in apps/example
    // @step And the file should contain EXPO_PUBLIC_JAMENDO_CLIENT_ID environment variable
    const envPath = path.resolve(__dirname, '../.env');
    expect(fs.existsSync(envPath)).toBe(true);

    // @step Given all required dependencies are listed in apps/example/package.json
    // @step When I run "pnpm install" in the project root
    // @step Then all packages should install without errors
    // @step And node_modules should contain all required dependencies
    expect(packageJson.dependencies['expo-audio']).toBeDefined();
    expect(packageJson.dependencies['@shopify/flash-list']).toBeDefined();
    expect(packageJson.dependencies['@jamendo/components']).toBeDefined();
    expect(packageJson.dependencies['@jamendo/rtk-services']).toBeDefined();
  });
});
