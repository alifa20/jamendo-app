import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@jamendo/ui';

export interface AudioProPlayerProps {
  audioUrl: string;
  trackName: string;
}

export const AudioProPlayer = ({ audioUrl, trackName }: AudioProPlayerProps) => {
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
