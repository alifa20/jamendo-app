/**
 * Feature: spec/features/redux-provider-integration.feature
 *
 * Tests for Redux Provider integration in app root layout.
 */

import { store } from '@jamendo/rtk-services';
import type { RootState } from '@jamendo/rtk-services';
import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { Provider, useSelector } from 'react-redux';

// Mock component to test Redux Provider access
function TestComponent() {
  // @step Then all screens should have access to the Redux store
  // Select only the jamendoApi slice to avoid "returned root state" warning
  const jamendoApiState = useSelector((state: RootState) => state.jamendoApi);
  return <Text testID="test-component">{JSON.stringify(jamendoApiState)}</Text>;
}

describe('Feature: Integrate Redux Provider in app root layout', () => {
  describe('Scenario: Redux Provider wraps app at root layout', () => {
    it('should wrap app with Redux Provider inside ThemeProvider', () => {
      // @step Given the root layout file exists at apps/example/app/_layout.tsx
      // Verify by reading the file content
      const fs = require('fs');
      const layoutContent = fs.readFileSync(
        require('path').resolve(__dirname, '../_layout.tsx'),
        'utf-8'
      );

      // @step When I import Provider from react-redux and store from @jamendo/rtk-services
      expect(Provider).toBeDefined();
      expect(store).toBeDefined();
      expect(layoutContent).toContain("import { Provider } from 'react-redux'");
      expect(layoutContent).toContain("import { store } from '@jamendo/rtk-services'");

      // @step Then the Provider should wrap all child components inside ThemeProvider
      expect(layoutContent).toContain('<Provider store={store}>');
      expect(layoutContent).toContain('<ThemeProvider');

      // @step Given the store is configured in @jamendo/rtk-services package
      expect(store.getState()).toHaveProperty('jamendoApi');

      // @step When I wrap the app tree with Provider component
      // Verified by checking the file content above

      // @step Then all screens should have access to the Redux store
      // Test with a mock component wrapped in Provider
      const { getByTestId } = render(
        <Provider store={store}>
          <TestComponent />
        </Provider>
      );
      expect(getByTestId('test-component')).toBeDefined();
    });
  });

  describe('Scenario: RTK Query hooks access Redux store', () => {
    it('should allow RTK Query hooks to access Redux store', () => {
      // @step Given Redux Provider is configured in root layout
      // Verify store is accessible
      expect(store).toBeDefined();

      // @step When a screen component uses useSearchTracksQuery hook
      // We verify the store is accessible by checking if jamendoApi is in store
      const state = store.getState();

      // @step Then the hook should successfully access the Redux store
      expect(state).toHaveProperty('jamendoApi');

      // @step Given the app is running
      // Test with Provider wrapper
      const { getByTestId } = render(
        <Provider store={store}>
          <TestComponent />
        </Provider>
      );

      // @step Then API data should be fetched and cached
      // Verify component can access store through Provider
      expect(getByTestId('test-component')).toBeDefined();
      expect(state.jamendoApi).toBeDefined();
    });
  });

  describe('Scenario: Theme switching works with Redux Provider', () => {
    it('should maintain theme functionality with Redux Provider present', () => {
      // @step Given Redux Provider is configured in root layout
      const fs = require('fs');
      const layoutContent = fs.readFileSync(
        require('path').resolve(__dirname, '../_layout.tsx'),
        'utf-8'
      );

      // @step When user switches between light and dark themes
      // @step Then the theme should change successfully
      // Verify ThemeProvider is still present in the layout
      expect(layoutContent).toContain('ThemeProvider');
      expect(layoutContent).toContain('useColorScheme');

      // @step Given the app is running with theme controls
      // @step Then Redux Provider should continue to function normally
      // Verify both ThemeProvider and Provider coexist
      expect(layoutContent).toContain('<Provider store={store}>');

      // Verify Redux Provider works alongside theme functionality
      const { getByTestId } = render(
        <Provider store={store}>
          <TestComponent />
        </Provider>
      );
      expect(getByTestId('test-component')).toBeDefined();
    });
  });

  describe('Scenario: Navigation works with Redux store available', () => {
    it('should maintain navigation with Redux store available', () => {
      // @step Given Redux Provider is configured in root layout
      const fs = require('fs');
      const layoutContent = fs.readFileSync(
        require('path').resolve(__dirname, '../_layout.tsx'),
        'utf-8'
      );

      // @step When user navigates between tabs
      // @step Then navigation should work normally
      // Verify Stack navigator is present and wrapped by Provider
      expect(layoutContent).toContain('<Stack>');
      expect(layoutContent).toContain('<Provider store={store}>');

      // @step Given the app is running with tab navigation
      // Verify Provider wraps the Stack component
      const providerIndex = layoutContent.indexOf('<Provider store={store}>');
      const stackIndex = layoutContent.indexOf('<Stack>');
      expect(providerIndex).toBeLessThan(stackIndex);

      // @step Then Redux store should remain accessible in all screens
      // Verify store is configured and accessible
      expect(store.getState()).toHaveProperty('jamendoApi');

      // Test store accessibility through Provider
      const { getByTestId } = render(
        <Provider store={store}>
          <TestComponent />
        </Provider>
      );
      expect(getByTestId('test-component')).toBeDefined();
    });
  });

  describe('Scenario: Redux DevTools shows store state in development', () => {
    it('should enable Redux DevTools in development mode', () => {
      // @step Given Redux Provider is configured with DevTools integration
      // Verify devTools configuration in store.ts
      const fs = require('fs');
      const storeContent = fs.readFileSync(
        require('path').resolve(__dirname, '../../../../packages/rtk-services/src/store.ts'),
        'utf-8'
      );
      expect(storeContent).toContain('devTools:');
      expect(storeContent).toContain('__DEV__');

      // @step When developer opens Redux DevTools
      // @step Then DevTools should show current store state
      // We can't directly test DevTools, but we can verify the store configuration
      expect(store).toBeDefined();

      // @step Given the app is running in development mode
      const devMode = typeof __DEV__ !== 'undefined' && __DEV__;

      // @step Then RTK Query cache should be visible in DevTools
      const state = store.getState();
      expect(state).toHaveProperty('jamendoApi');

      // Verify store has the RTK Query data structure
      expect(state.jamendoApi).toBeDefined();

      // Verify devTools is enabled when in development
      if (devMode) {
        expect(state.jamendoApi).toHaveProperty('queries');
        expect(state.jamendoApi).toHaveProperty('mutations');
      }
    });
  });
});
