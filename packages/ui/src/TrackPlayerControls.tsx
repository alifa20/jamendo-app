import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface TrackPlayerControlsProps {
  /** Callback when play button is pressed */
  onPlayPress?: () => void;
  /** Test ID for component identification */
  testID?: string;
}

/**
 * TrackPlayerControls - Play button control overlaid on the animated header
 *
 * Features:
 * - Circular play button positioned at top-right of header
 * - Fades in/out as part of header animation
 * - Semi-transparent white background for visibility
 * - Accessible touch target (48x48 minimum)
 */
export const TrackPlayerControls: React.FC<TrackPlayerControlsProps> = ({
  onPlayPress,
  testID = 'track-player-controls',
}) => {
  return (
    <Pressable
      testID={testID}
      onPress={onPlayPress}
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      accessibilityRole="button"
      accessibilityLabel="Play track"
    >
      <Text testID={`${testID}-icon`} style={styles.playIcon}>
        ▶
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  playIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginLeft: 2, // Slight offset for visual balance of play icon
  },
});
