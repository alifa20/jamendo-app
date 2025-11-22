import { useSearchTracksQuery } from '@jamendo/rtk-services';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // RTK Query hook for searching tracks
  const { data, isLoading, isError } = useSearchTracksQuery(searchQuery, {
    skip: searchQuery.length === 0,
  });

  const tracks2 = data?.results || [];

  const handleTrackPress = (trackId: string) => {
    router.push(`/track/${trackId}` as any); // TODO: Add track detail route file for proper typing
  };

  const renderTrackItem = ({ item }: { item: any }) => (
    <Pressable
      testID="track-item"
      onPress={() => handleTrackPress(item.id)}
      style={styles.trackItem}
    >
      <Image
        testID="album-art"
        source={{ uri: item.image }}
        style={styles.albumArt}
        contentFit="cover"
      />
      <View style={styles.trackInfo}>
        <ThemedText testID="track-title" type="defaultSemiBold" style={styles.trackTitle}>
          {item.name}
        </ThemedText>
        <ThemedText testID="track-artist" style={styles.trackArtist}>
          {item.artist_name}
        </ThemedText>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search tracks..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Track List */}
        <View style={styles.listContainer}>
          {isLoading && (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" />
            </View>
          )}

          {isError && (
            <View style={styles.centerContent}>
              <ThemedText>Error loading tracks. Please try again.</ThemedText>
            </View>
          )}

          {!isLoading && !isError && searchQuery.length > 0 && tracks2.length === 0 && (
            <View style={styles.centerContent}>
              <ThemedText>No tracks found for "{searchQuery}"</ThemedText>
            </View>
          )}

          {!isLoading && !isError && tracks2.length > 0 && (
            <FlashList
              testID="track-list"
              data={tracks2}
              renderItem={renderTrackItem}
              estimatedItemSize={80}
              keyExtractor={(item: any) => item.id}
            />
          )}

          {searchQuery.length === 0 && !data && (
            <View style={styles.centerContent}>
              <ThemedText style={styles.emptyText}>
                Search for tracks to discover music on Jamendo
              </ThemedText>
            </View>
          )}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
  },
  listContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  trackItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    opacity: 0.7,
  },
});
