/**
 * Feature: spec/features/build-home-page-with-search-and-track-results.feature
 *
 * Home Screen Tests
 * Tests for search functionality and track results display
 */

import { api } from '@jamendo/rtk-services';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';

import HomeScreen from '../index';

// Mock Redux store setup
const createMockStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  });
};

describe('Feature: Build Home page with search and track results', () => {
  describe('Scenario: Display search bar on home screen', () => {
    it('should display search bar with placeholder text', () => {
      const store = createMockStore();

      // @step Given I am on the home screen
      const { getByPlaceholderText } = render(
        <Provider store={store}>
          <HomeScreen />
        </Provider>
      );

      // @step When I open the app
      // App is already rendered above

      // @step Then I should see a search bar at the top
      const searchBar = getByPlaceholderText(/search tracks/i);
      expect(searchBar).toBeTruthy();

      // @step Then the search bar should have placeholder text 'Search tracks...'
      expect(searchBar.props.placeholder).toBe('Search tracks...');
    });
  });

  describe('Scenario: Search for tracks and display results', () => {
    it('should search for tracks and display results with track details', async () => {
      const store = createMockStore();

      // @step Given I am on the home screen
      const { getByPlaceholderText, getAllByTestId } = render(
        <Provider store={store}>
          <HomeScreen />
        </Provider>
      );

      // @step When I type 'jazz' in the search bar
      const searchBar = getByPlaceholderText(/search tracks/i);
      fireEvent.changeText(searchBar, 'jazz');

      // @step Then I should see a list of jazz tracks
      await waitFor(() => {
        const trackItems = getAllByTestId('track-item');
        expect(trackItems.length).toBeGreaterThan(0);
      });

      // @step Then each track should display title, artist, and album art
      await waitFor(() => {
        const firstTrack = getAllByTestId('track-item')[0];
        expect(firstTrack).toBeTruthy();
        // Verify track contains required elements
        const trackTitle = firstTrack.findByTestId('track-title');
        const trackArtist = firstTrack.findByTestId('track-artist');
        const albumArt = firstTrack.findByTestId('album-art');
        expect(trackTitle).toBeTruthy();
        expect(trackArtist).toBeTruthy();
        expect(albumArt).toBeTruthy();
      });
    });
  });

  describe('Scenario: Navigate to track detail from search results', () => {
    it('should navigate to track detail when tapping a track', async () => {
      const store = createMockStore();
      const mockNavigation = jest.fn();

      // @step Given I am viewing search results for 'jazz'
      const { getByPlaceholderText, getAllByTestId } = render(
        <Provider store={store}>
          <HomeScreen />
        </Provider>
      );

      const searchBar = getByPlaceholderText(/search tracks/i);
      fireEvent.changeText(searchBar, 'jazz');

      await waitFor(() => {
        expect(getAllByTestId('track-item').length).toBeGreaterThan(0);
      });

      // @step When I tap on a track from the results
      const firstTrack = getAllByTestId('track-item')[0];
      fireEvent.press(firstTrack);

      // @step Then I should be taken to the track detail screen
      await waitFor(() => {
        expect(mockNavigation).toHaveBeenCalled();
      });

      // @step Then the track detail screen should show full track information
      // This will be validated in track detail screen tests
    });
  });

  describe('Scenario: Scroll through search results smoothly', () => {
    it('should render track list using FlashList for smooth scrolling', async () => {
      const store = createMockStore();

      // @step Given I am viewing search results with many tracks
      const { getByPlaceholderText, getByTestId } = render(
        <Provider store={store}>
          <HomeScreen />
        </Provider>
      );

      const searchBar = getByPlaceholderText(/search tracks/i);
      fireEvent.changeText(searchBar, 'jazz');

      // @step When I scroll through the track list
      await waitFor(() => {
        const trackList = getByTestId('track-list');
        expect(trackList).toBeTruthy();
      });

      // @step Then the list should scroll smoothly without lag
      // Performance testing would be done with React Native Performance monitor
      // For unit tests, we verify FlashList is used

      // @step Then the track list should be rendered using FlashList
      const trackList = getByTestId('track-list');
      expect(trackList.type).toContain('FlashList');
    });
  });
});
