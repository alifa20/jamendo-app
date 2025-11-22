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

  useEffect(() => {
    // Listen for errors
    const errorListener = player.addListener('error', () => {
      setError('An error occurred while loading audio');
    });

    return () => {
      errorListener.remove();
    };
  }, [player]);

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
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artist}>{artistName}</Text>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
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
    padding: 16,
    alignItems: 'center',
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  metadataContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
