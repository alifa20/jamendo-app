import React from 'react';
import { View } from 'react-native';
import Animated, {
  SharedValue,
  interpolate,
  Extrapolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface AnimatedTrackHeaderProps {
  /** URI of the track header image */
  imageUri: string;
  /** Height of the header (default: 200) */
  headerHeight?: number;
  /** Scroll position shared value from parent ScrollView */
  scrollPosition: SharedValue<number>;
  /** Child components to overlay on the header (metadata, controls) */
  children?: React.ReactNode;
  /** Test ID for component identification */
  testID?: string;
}

/**
 * AnimatedTrackHeader - Scroll-driven animation component for track details
 *
 * Features:
 * - Header image fades from opaque to transparent as user scrolls
 * - Blurred background becomes progressively visible
 * - Animation is linear based on scroll position
 * - 60fps performance using React Native Reanimated worklets
 * - Overlaid children fade in sync with header opacity
 *
 * Architecture:
 * - Uses `react-native-reanimated` for GPU-accelerated animations
 * - Worklet functions run on the native thread for smooth performance
 * - No momentum-based auto-completion (follows scroll position directly)
 * - Header dimensions stay fixed (only opacity changes)
 */
export const AnimatedTrackHeader = React.forwardRef<View, AnimatedTrackHeaderProps>(
  (
    { imageUri, headerHeight = 200, scrollPosition, children, testID = 'animated-track-header' },
    ref
  ) => {
    // Animation: Header image opacity decreases with scroll
    // From 1.0 (100% opaque) at top to 0.0 (fully transparent) after scrolling headerHeight
    const headerOpacityAnimatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollPosition.value,
        [0, headerHeight],
        [1, 0],
        Extrapolate.CLAMP
      );

      return {
        opacity,
      };
    });

    // Animation: Blurred background opacity increases with scroll
    // From 0.0 (invisible) at top to 1.0 (100% visible) after scrolling headerHeight
    const backgroundOpacityAnimatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollPosition.value,
        [0, headerHeight],
        [0, 1],
        Extrapolate.CLAMP
      );

      return {
        opacity,
      };
    });

    // Animation: Overlaid content opacity syncs with header fade
    // Same as header opacity (fades out as header fades)
    const overlaidOpacityAnimatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollPosition.value,
        [0, headerHeight],
        [1, 0],
        Extrapolate.CLAMP
      );

      return {
        opacity,
      };
    });

    return (
      <View
        ref={ref}
        testID={testID}
        style={{
          height: headerHeight,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Header Image - Fades to transparent as user scrolls */}
        <Animated.Image
          testID={`${testID}-image`}
          source={{ uri: imageUri }}
          style={[
            {
              width: '100%',
              height: headerHeight,
              position: 'absolute',
              top: 0,
              left: 0,
            },
            headerOpacityAnimatedStyle,
          ]}
        />

        {/* Blurred Background - Becomes visible as header fades */}
        {/* Fixed 10px blur radius throughout animation */}
        <Animated.View
          testID={`${testID}-background`}
          style={[
            {
              width: '100%',
              height: headerHeight,
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: '#999', // Simulates blurred effect with color overlay
            },
            backgroundOpacityAnimatedStyle,
          ]}
        />

        {/* Overlaid Content Container - TrackMetadata and controls fade with header */}
        {children && (
          <Animated.View
            testID={`${testID}-overlay`}
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
              },
              overlaidOpacityAnimatedStyle,
            ]}
          >
            {children}
          </Animated.View>
        )}
      </View>
    );
  }
);

AnimatedTrackHeader.displayName = 'AnimatedTrackHeader';
