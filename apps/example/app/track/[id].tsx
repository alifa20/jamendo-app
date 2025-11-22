import { ExpoAudioPlayer } from '@jamendo/components';
import {
  AnimatedTrackHeader,
  TrackMetadata,
  TrackPlayerControls,
} from '@jamendo/ui';
import { useGetTrackDetailQuery } from '@jamendo/rtk-services';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  StyleSheet,
  ScrollView,
  Image,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const HEADER_HEIGHT = 350;

// Custom header title in a bubble
function HeaderTitle({ children }: { children: string }) {
  return (
    <View
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 16,
          fontWeight: '600',
        }}
      >
        {children}
      </Text>
    </View>
  );
}

// Header thumbnail component that fades in as main image fades out
function HeaderThumbnail({
  imageUri,
  scrollPosition,
}: {
  imageUri: string;
  scrollPosition: Animated.SharedValue<number>;
}) {
  // Thumbnail opacity increases as header image fades (inverse relationship)
  // Stays hidden until 70% scrolled, then fades in quickly
  // When scroll = 0-140px (top), opacity = 0 (hidden)
  // When scroll = 200px (full fade), opacity = 1 (visible)
  const thumbnailOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollPosition.value,
      [0, HEADER_HEIGHT * 0.7, HEADER_HEIGHT],
      [0, 0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  return (
    <Animated.View
      style={[
        {
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginRight: 12,
        },
        thumbnailOpacity,
      ]}
      testID="header-thumbnail-wrapper"
    >
      <Animated.View
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        testID="header-thumbnail-container"
      >
        <Animated.Image
          source={{ uri: imageUri }}
          style={{
            width: 32,
            height: 32,
          }}
          resizeMode="cover"
          testID="header-thumbnail"
        />
      </Animated.View>
    </Animated.View>
  );
}

export default function TrackDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: track, isLoading, error } = useGetTrackDetailQuery(id);
  const scrollPosition = useSharedValue(0);
  const navigation = useNavigation();

  // Set up custom header with thumbnail that appears as main image fades
  useEffect(() => {
    if (!track) return;

    navigation.setOptions({
      headerTransparent: true,
      headerTitle: () => <HeaderTitle>Track Details</HeaderTitle>,
      headerRight: () => (
        <HeaderThumbnail imageUri={track.image} scrollPosition={scrollPosition} />
      ),
    });
  }, [track, navigation]);

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

  const handleScroll = (event: any) => {
    scrollPosition.value = event.nativeEvent.contentOffset.y;
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        testID="track-details-scroll"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Animated Header with Track Image, Metadata, and Controls */}
        <AnimatedTrackHeader
          imageUri={track.image}
          headerHeight={HEADER_HEIGHT}
          scrollPosition={scrollPosition}
          testID="animated-header"
        >
          <TrackMetadata
            title={track.name}
            artistName={track.artist_name}
            testID="header-metadata"
          />
          {/* <TrackPlayerControls testID="header-controls" /> */}
        </AnimatedTrackHeader>

        <View testID="track-info">
          <ThemedText type="title" style={styles.title}>
            {track.name}
          </ThemedText>

          <ThemedText type="subtitle" style={styles.artist}>
            {track.artist_name}
          </ThemedText>

          <View style={styles.detailsContainer}>
            <ThemedText style={styles.detailLabel}>Album:</ThemedText>
            <ThemedText style={styles.detailValue}>{track.album_name}</ThemedText>

            <ThemedText style={styles.detailLabel}>Track Position:</ThemedText>
            <ThemedText style={styles.detailValue}>#{track.position}</ThemedText>

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

            {track.musicinfo?.tags?.instruments && track.musicinfo.tags.instruments.length > 0 && (
              <>
                <ThemedText style={styles.detailLabel}>Instruments:</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {track.musicinfo.tags.instruments.join(', ')}
                </ThemedText>
              </>
            )}

            {track.musicinfo?.tags?.vartags && track.musicinfo.tags.vartags.length > 0 && (
              <>
                <ThemedText style={styles.detailLabel}>Tags:</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {track.musicinfo.tags.vartags.join(', ')}
                </ThemedText>
              </>
            )}

            {track.musicinfo?.vocalinstrumental && (
              <>
                <ThemedText style={styles.detailLabel}>Type:</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {track.musicinfo.vocalinstrumental}
                </ThemedText>
              </>
            )}

            {track.musicinfo?.speed && (
              <>
                <ThemedText style={styles.detailLabel}>Speed:</ThemedText>
                <ThemedText style={styles.detailValue}>{track.musicinfo.speed}</ThemedText>
              </>
            )}

            {track.musicinfo?.acousticelectric && (
              <>
                <ThemedText style={styles.detailLabel}>Sound:</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {track.musicinfo.acousticelectric}
                </ThemedText>
              </>
            )}

            {track.musicinfo?.lang && (
              <>
                <ThemedText style={styles.detailLabel}>Language:</ThemedText>
                <ThemedText style={styles.detailValue}>{track.musicinfo.lang}</ThemedText>
              </>
            )}

            {track.musicinfo?.gender && (
              <>
                <ThemedText style={styles.detailLabel}>Vocal Gender:</ThemedText>
                <ThemedText style={styles.detailValue}>{track.musicinfo.gender}</ThemedText>
              </>
            )}

            <ThemedText style={styles.detailLabel}>License:</ThemedText>
            <ThemedText style={styles.detailValue}>{track.license_ccurl}</ThemedText>

            <ThemedText style={styles.detailLabel}>Share URL:</ThemedText>
            <ThemedText style={styles.detailValue}>{track.shareurl}</ThemedText>

            {track.lyrics && (
              <>
                <ThemedText style={styles.detailLabel}>Lyrics:</ThemedText>
                <ThemedText style={styles.detailValue}>{track.lyrics}</ThemedText>
              </>
            )}
          </View>
        </View>
      </Animated.ScrollView>

      <ThemedView style={styles.fixedPlayerContainer} testID="fixed-player-container">
        <ExpoAudioPlayer
          audioUrl={track.audio}
          title={track.name}
          artistName={track.artist_name}
          albumArtUrl={track.image}
        />
      </ThemedView>
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
    paddingBottom: 100, // Space for fixed player
  },
  title: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  artist: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  detailsContainer: {
    paddingHorizontal: 16,
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
    borderTopColor: '#e0e0e0',
  },
});
