import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { TrackCard } from './TrackCard';

export interface Track {
  id: string;
  name: string;
  artist_name: string;
  image: string;
}

export interface TrackListProps {
  tracks: Track[];
  onTrackPress: (trackId: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const TrackList = ({ tracks, onTrackPress, isLoading, onRefresh }: TrackListProps) => {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No tracks found</Text>
      </View>
    );
  }

  return (
    <FlashList
      data={tracks}
      renderItem={({ item }) => (
        <TrackCard
          id={item.id}
          name={item.name}
          artistName={item.artist_name}
          imageUrl={item.image}
          onPress={() => onTrackPress(item.id)}
        />
      )}
      estimatedItemSize={84}
      keyExtractor={(item) => item.id}
      onRefresh={onRefresh}
      refreshing={isLoading}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
