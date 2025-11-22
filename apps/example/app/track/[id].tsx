import { ExpoAudioPlayer } from '@jamendo/components';
import { useGetTrackDetailQuery } from '@jamendo/rtk-services';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, ScrollView, Image, View, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TrackDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: track, isLoading, error } = useGetTrackDetailQuery(id);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View testID="skeleton-loading" style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText>Loading track details...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error || !track) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>
          Failed to load track details. Please try again.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        testID="track-details-scroll"
      >
        <View testID="track-info">
          <Image source={{ uri: track.image }} style={styles.albumArt} testID="album-art" />

          <ThemedText type="title" style={styles.title}>
            {track.name}
          </ThemedText>

          <ThemedText type="subtitle" style={styles.artist}>
            {track.artist_name}
          </ThemedText>

          <View style={styles.detailsContainer}>
            <ThemedText style={styles.detailLabel}>Release Date:</ThemedText>
            <ThemedText style={styles.detailValue}>{track.releasedate}</ThemedText>

            <ThemedText style={styles.detailLabel}>Duration:</ThemedText>
            <ThemedText style={styles.detailValue}>{track.duration}s</ThemedText>

            {track.musicinfo?.tags?.genres && track.musicinfo.tags.genres.length > 0 && (
              <>
                <ThemedText style={styles.detailLabel}>Genres:</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {track.musicinfo.tags.genres.join(', ')}
                </ThemedText>
              </>
            )}

            <ThemedText style={styles.detailLabel}>License:</ThemedText>
            <ThemedText style={styles.detailValue}>{track.license_ccurl}</ThemedText>
          </View>
        </View>
      </ScrollView>

      <View style={styles.fixedPlayerContainer} testID="fixed-player-container">
        <ExpoAudioPlayer
          audioUrl={track.audio}
          title={track.name}
          artistName={track.artist_name}
          albumArtUrl={track.image}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for fixed player
    padding: 16,
  },
  albumArt: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  artist: {
    marginBottom: 24,
  },
  detailsContainer: {
    gap: 8,
  },
  detailLabel: {
    fontWeight: '600',
    marginTop: 8,
  },
  detailValue: {
    opacity: 0.8,
  },
  errorText: {
    textAlign: 'center',
    padding: 32,
  },
  fixedPlayerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});
