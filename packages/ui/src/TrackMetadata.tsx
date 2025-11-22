import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface TrackMetadataProps {
  /** Track title/name */
  title: string;
  /** Artist name */
  artistName: string;
  /** Optional test ID */
  testID?: string;
}

/**
 * TrackMetadata - Displays track information overlaid on the animated header
 *
 * Features:
 * - Shows track title and artist name
 * - Positioned at the bottom of the header
 * - Fades in/out as part of the header animation
 * - Uses semi-transparent background for readability
 */
export const TrackMetadata: React.FC<TrackMetadataProps> = ({
  title,
  artistName,
  testID = 'track-metadata',
}) => {
  return (
    <View testID={testID} style={styles.container}>
      <Text testID={`${testID}-title`} style={styles.title}>
        {title}
      </Text>
      <Text testID={`${testID}-artist`} style={styles.artist}>
        {artistName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  artist: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
});
