import { Button } from '@jamendo/ui';
import { View, Text, StyleSheet } from 'react-native';

export interface ExpoAudioPlayerProps {
  audioUrl: string;
  trackName: string;
}

export const ExpoAudioPlayer = ({ audioUrl, trackName }: ExpoAudioPlayerProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.trackName}>{trackName}</Text>
      <Button title="Play" onPress={() => console.log('Play', audioUrl)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  trackName: {
    fontSize: 16,
    marginBottom: 12,
  },
});
