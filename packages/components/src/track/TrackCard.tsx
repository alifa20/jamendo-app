import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export interface TrackCardProps {
  id: string;
  name: string;
  artistName: string;
  imageUrl: string;
  onPress: () => void;
}

export const TrackCard = ({ name, artistName, imageUrl, onPress }: TrackCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.trackName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {artistName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  trackName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 14,
    color: '#666',
  },
});
