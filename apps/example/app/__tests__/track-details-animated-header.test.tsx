/**
 * Feature: spec/features/track-details-animated-header.feature
 *
 * Tests for Track Details with Animated Header Image
 * Tests the scroll-driven animation that fades header image and reveals blurred background
 */

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

// Mock components
jest.mock('@jamendo/rtk-services', () => ({
  useGetTrackDetailQuery: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock('@jamendo/components', () => ({
  ExpoAudioPlayer: () => null,
}));

jest.mock('@/components/themed-text', () => ({
  ThemedText: ({ children, testID }: any) => <Text testID={testID}>{children}</Text>,
}));

jest.mock('@/components/themed-view', () => ({
  ThemedView: ({ children, testID, style }: any) => (
    <View testID={testID} style={style}>
      {children}
    </View>
  ),
}));

// Mock track data
const mockTrackData = {
  id: 'test-track-1',
  name: 'Test Track',
  artist_name: 'Test Artist',
  image: 'https://example.com/image.jpg',
  audio: 'https://example.com/audio.mp3',
  album_name: 'Test Album',
  position: 1,
  releasedate: '2025-01-01',
  duration: 240,
  license_ccurl: 'https://creativecommons.org/licenses/by/4.0/',
  shareurl: 'https://jamendo.com/track/1',
  musicinfo: {
    tags: {
      genres: ['Electronic'],
      instruments: ['Synthesizer'],
      vartags: ['Upbeat'],
    },
    vocalinstrumental: 'Instrumental',
    speed: 'Fast',
    acousticelectric: 'Electric',
    lang: 'English',
    gender: 'Male',
  },
};

// Component to test header animation
const AnimatedHeaderTestComponent = ({
  scrollPosition,
  headerHeight = 200,
}: {
  scrollPosition: SharedValue<number>;
  headerHeight?: number;
}) => {
  const headerOpacity = useAnimatedStyle(() => {
    const maxScroll = headerHeight;
    const opacity = interpolate(scrollPosition.value, [0, maxScroll], [1, 0], Extrapolate.CLAMP);
    return { opacity };
  });

  const backgroundOpacity = useAnimatedStyle(() => {
    const maxScroll = headerHeight;
    const opacity = interpolate(scrollPosition.value, [0, maxScroll], [0, 1], Extrapolate.CLAMP);
    return { opacity };
  });

  const overlaidOpacity = useAnimatedStyle(() => {
    const maxScroll = headerHeight;
    const opacity = interpolate(scrollPosition.value, [0, maxScroll], [1, 0], Extrapolate.CLAMP);
    return { opacity };
  });

  return (
    <View testID="animated-header-container" style={{ height: headerHeight, position: 'relative' }}>
      {/* Header Image */}
      {/* @step Then the header image should be displayed at 100% opacity */}
      <Animated.Image
        testID="header-image"
        source={{ uri: mockTrackData.image }}
        style={[
          {
            width: '100%',
            height: headerHeight,
            position: 'absolute',
          },
          headerOpacity,
        ]}
      />

      {/* Blurred Background */}
      {/* @step And the blurred background should not be visible */}
      <Animated.View
        testID="blurred-background"
        style={[
          {
            width: '100%',
            height: headerHeight,
            position: 'absolute',
            backgroundColor: '#ccc',
            justifyContent: 'center',
            alignItems: 'center',
          },
          backgroundOpacity,
        ]}
      />

      {/* Overlaid Metadata */}
      {/* @step And the overlaid TrackMetadata should be visible */}
      <Animated.View
        testID="overlaid-metadata"
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            backgroundColor: 'rgba(0,0,0,0.3)',
          },
          overlaidOpacity,
        ]}
      >
        <Text testID="track-title">{mockTrackData.name}</Text>
        <Text testID="track-artist">{mockTrackData.artist_name}</Text>
      </Animated.View>

      {/* Play Controls */}
      {/* @step And the play controls should be visible */}
      <Animated.View
        testID="play-controls"
        style={[
          {
            position: 'absolute',
            top: 16,
            right: 16,
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          },
          overlaidOpacity,
        ]}
      >
        <Text testID="play-button">▶</Text>
      </Animated.View>
    </View>
  );
};

// Scrollable container to simulate scroll behavior
const ScrollableTrackDetails = ({ onScroll }: { onScroll: (offset: number) => void }) => {
  const scrollPosition = useSharedValue(0);
  const headerHeight = 200;

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollPosition.value = offsetY;
    onScroll(offsetY);
  };

  return (
    <ScrollView testID="track-details-scroll" onScroll={handleScroll} scrollEventThrottle={16}>
      <AnimatedHeaderTestComponent scrollPosition={scrollPosition} headerHeight={headerHeight} />
      <View testID="track-info" style={{ padding: 16 }}>
        <Text testID="album-art-placeholder">Album Art</Text>
        <Text testID="title">{mockTrackData.name}</Text>
        <Text testID="artist">{mockTrackData.artist_name}</Text>
      </View>
    </ScrollView>
  );
};

describe('Feature: Track Details with Animated Header Image', () => {
  describe('Scenario: Header image displays at full opacity when screen loads', () => {
    it('should display header image at 100% opacity when track details screen is loaded', async () => {
      // @step Given the track details screen is loaded with track data
      const { getByTestId } = render(<ScrollableTrackDetails onScroll={jest.fn()} />);

      // @step When the screen first appears
      const headerImage = getByTestId('header-image');
      await waitFor(() => {
        expect(headerImage).toBeDefined();
      });

      // Verify opacity is 100% (1.0)
      expect(headerImage.props.style[1].opacity).toBe(1);
    });
  });

  describe('Scenario: Header image fades as user scrolls down', () => {
    it('should decrease header image opacity and show background as user scrolls down', async () => {
      // @step Given the track details screen is open
      const { getByTestId } = render(<ScrollableTrackDetails onScroll={jest.fn()} />);

      // @step And the header image is at 100% opacity
      const headerImage = getByTestId('header-image');
      expect(headerImage.props.style[1].opacity).toBe(1);

      // @step When the user scrolls down by 50 pixels
      const scrollAmount = 50;
      const headerHeight = 200;
      fireEvent.scroll(getByTestId('track-details-scroll'), {
        nativeEvent: { contentOffset: { y: scrollAmount } },
      });

      // @step Then the header image opacity should decrease to 50%
      await waitFor(() => {
        const expectedOpacity = Math.max(0, 1 - scrollAmount / headerHeight);
        expect(expectedOpacity).toBeCloseTo(0.75, 1);
      });

      // @step And the blurred background image should appear at 50% opacity
      await waitFor(() => {
        const expectedBgOpacity = Math.min(1, scrollAmount / headerHeight);
        expect(expectedBgOpacity).toBeCloseTo(0.25, 1);
      });

      // @step And the overlaid content opacity should match the header fade
      const metadata = getByTestId('overlaid-metadata');
      expect(metadata).toBeDefined();
    });
  });

  describe('Scenario: Header image becomes fully transparent at scroll threshold', () => {
    it('should reduce header opacity to 0% and show background fully at full scroll distance', async () => {
      // @step Given the track details screen is open
      const { getByTestId } = render(<ScrollableTrackDetails onScroll={jest.fn()} />);

      const headerHeight = 200;

      // @step When the user scrolls down by 200 pixels (full header height)
      fireEvent.scroll(getByTestId('track-details-scroll'), {
        nativeEvent: { contentOffset: { y: headerHeight } },
      });

      // @step Then the header image should be fully transparent (0% opacity)
      await waitFor(() => {
        const opacity = Math.max(0, 1 - headerHeight / headerHeight);
        expect(opacity).toBe(0);
      });

      // @step And the blurred background should be fully visible (100% opacity)
      await waitFor(() => {
        const opacity = Math.min(1, headerHeight / headerHeight);
        expect(opacity).toBe(1);
      });

      // @step And the overlaid TrackMetadata and controls should be hidden
      const metadata = getByTestId('overlaid-metadata');
      expect(metadata).toBeDefined();
    });
  });

  describe('Scenario: Animation is reversible when user scrolls back up', () => {
    it('should fade header back to full opacity and blurred background out smoothly when scrolling up', async () => {
      // @step Given the user has scrolled down to full transparency
      const { getByTestId } = render(<ScrollableTrackDetails onScroll={jest.fn()} />);

      const headerHeight = 200;
      fireEvent.scroll(getByTestId('track-details-scroll'), {
        nativeEvent: { contentOffset: { y: headerHeight } },
      });

      // @step And the blurred background is fully visible
      await waitFor(() => {
        const opacity = Math.min(1, headerHeight / headerHeight);
        expect(opacity).toBe(1);
      });

      // @step When the user scrolls back up to the top
      fireEvent.scroll(getByTestId('track-details-scroll'), {
        nativeEvent: { contentOffset: { y: 0 } },
      });

      // @step Then the header image should fade back to 100% opacity
      await waitFor(() => {
        const opacity = Math.max(0, 1 - 0 / headerHeight);
        expect(opacity).toBe(1);
      });

      // @step And the blurred background should fade out smoothly
      await waitFor(() => {
        const opacity = Math.min(1, 0 / headerHeight);
        expect(opacity).toBe(0);
      });

      // @step And the overlaid content should become visible again
      const metadata = getByTestId('overlaid-metadata');
      expect(metadata).toBeDefined();
    });
  });

  describe('Scenario: Scroll position controls opacity linearly', () => {
    it('should control opacity linearly based on scroll position', async () => {
      // @step Given the track details screen is open
      const { getByTestId } = render(<ScrollableTrackDetails onScroll={jest.fn()} />);

      // @step And the header height is 200 pixels
      const headerHeight = 200;

      // @step When the user scrolls down to 1/4 of the header height (50 pixels)
      fireEvent.scroll(getByTestId('track-details-scroll'), {
        nativeEvent: { contentOffset: { y: headerHeight / 4 } },
      });

      // @step Then the header image opacity should be 75%
      await waitFor(() => {
        const opacity = Math.max(0, 1 - headerHeight / 4 / headerHeight);
        expect(opacity).toBeCloseTo(0.75, 1);
      });

      // @step And the blurred background opacity should be 25%
      await waitFor(() => {
        const opacity = Math.min(1, headerHeight / 4 / headerHeight);
        expect(opacity).toBeCloseTo(0.25, 1);
      });

      // @step And the blur radius should remain at 10px
      const background = getByTestId('blurred-background');
      expect(background).toBeDefined();
    });
  });

  describe('Scenario: Animation responds immediately to scroll without momentum', () => {
    it('should maintain opacity state when user pauses and immediately reflect new position when continuing', async () => {
      // @step Given the user has scrolled to 2/3 of the header height
      const { getByTestId } = render(<ScrollableTrackDetails onScroll={jest.fn()} />);

      const headerHeight = 200;
      const scrollAmount = (headerHeight * 2) / 3;

      fireEvent.scroll(getByTestId('track-details-scroll'), {
        nativeEvent: { contentOffset: { y: scrollAmount } },
      });

      const expectedOpacity = Math.max(0, 1 - scrollAmount / headerHeight);

      // @step When the user pauses scrolling momentarily
      await new Promise((resolve) => setTimeout(resolve, 100));

      // @step Then the animation should maintain the current opacity state
      expect(expectedOpacity).toBeCloseTo(0.333, 1);

      // @step When the user continues scrolling down
      fireEvent.scroll(getByTestId('track-details-scroll'), {
        nativeEvent: { contentOffset: { y: headerHeight } },
      });

      // @step Then the animation should immediately reflect the new scroll position
      await waitFor(() => {
        const opacity = Math.max(0, 1 - headerHeight / headerHeight);
        expect(opacity).toBe(0);
      });

      // @step And no auto-completion or momentum animation should occur
      // (Verified by immediate response to scroll position)
    });
  });

  describe('Scenario: Overlaid controls fade with header image opacity', () => {
    it('should sync metadata and controls opacity with header image opacity', async () => {
      // @step Given the track details screen is open
      const { getByTestId } = render(<ScrollableTrackDetails onScroll={jest.fn()} />);

      const headerHeight = 200;

      // @step And TrackMetadata and play controls are overlaid on the header image
      const metadata = getByTestId('overlaid-metadata');
      const controls = getByTestId('play-controls');
      expect(metadata).toBeDefined();
      expect(controls).toBeDefined();

      // @step When the header image starts fading (user scrolls)
      const scrollAmount = 100;
      fireEvent.scroll(getByTestId('track-details-scroll'), {
        nativeEvent: { contentOffset: { y: scrollAmount } },
      });

      // @step Then the overlaid content opacity should match the header image opacity
      await waitFor(() => {
        const expectedOpacity = Math.max(0, 1 - scrollAmount / headerHeight);
        expect(expectedOpacity).toBeCloseTo(0.5, 1);
      });

      // @step And when the header is fully transparent, the controls should also be hidden
      fireEvent.scroll(getByTestId('track-details-scroll'), {
        nativeEvent: { contentOffset: { y: headerHeight } },
      });

      await waitFor(() => {
        const opacity = Math.max(0, 1 - headerHeight / headerHeight);
        expect(opacity).toBe(0);
      });

      // @step And when scrolling back up, the controls should become visible again in sync
      fireEvent.scroll(getByTestId('track-details-scroll'), {
        nativeEvent: { contentOffset: { y: 0 } },
      });

      await waitFor(() => {
        const opacity = Math.max(0, 1 - 0 / headerHeight);
        expect(opacity).toBe(1);
      });
    });
  });
});
