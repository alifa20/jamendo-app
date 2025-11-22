import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export interface ExpoAudioPlayerProps {
  audioUrl: string;
  title: string;
  artistName: string;
  albumArtUrl: string;
}

export const ExpoAudioPlayer = ({
  audioUrl,
  title,
  artistName,
  albumArtUrl,
}: ExpoAudioPlayerProps) => {
  const player = useAudioPlayer(audioUrl as AudioSource);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync local state with player state
  useEffect(() => {
    setIsPlaying(player.playing);
  }, [player.playing]);

  const handlePlayPause = () => {
    try {
      setError(null);
      if (player.playing) {
        player.pause();
        setIsPlaying(false);
      } else {
        player.play();
        setIsPlaying(true);
      }
    } catch {
      setError('An error occurred while loading audio');
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: albumArtUrl }} style={styles.albumArt} testID="album-art" />
      <View style={styles.metadataContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artistName}
        </Text>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePlayPause}
        disabled={error !== null}
        testID={isPlaying ? 'pause-button' : 'play-button'}
      >
        <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  metadataContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  artist: {
    fontSize: 12,
    color: '#666',
  },
  error: {
    color: 'red',
    fontSize: 11,
    marginTop: 2,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
