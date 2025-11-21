# Expo Audio Implementation Guide

**Library:** expo-audio
**Documentation:** https://docs.expo.dev/versions/latest/sdk/audio/

## Installation

```bash
npx expo install expo-audio
```

## Core API

### Hooks

#### `useAudioPlayer(source)`
Creates an audio player instance.

```typescript
import { useAudioPlayer } from 'expo-audio'

const player = useAudioPlayer(audioSource)
```

**Parameters:**
- `source`: Can be a URL string, require() asset, or URI object

**Returns:** AudioPlayer instance

#### `useAudioPlayerStatus(player)`
Subscribes to real-time playback status updates.

```typescript
import { useAudioPlayerStatus } from 'expo-audio'

const status = useAudioPlayerStatus(player)
```

**Status Properties:**
- `currentTime: number` - Current position in seconds
- `duration: number` - Total audio length in seconds
- `playing: boolean` - Whether audio is actively playing
- `isLoaded: boolean` - Whether audio finished loading

### Player Methods

```typescript
player.play()           // Start playback
player.pause()          // Pause playback
player.seekTo(seconds)  // Jump to specific position
```

## Implementation Example

```typescript
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { useEffect } from 'react'
import { View, Button, Text } from 'react-native'

interface ExpoAudioPlayerProps {
  audioUrl: string
  trackName: string
}

export function ExpoAudioPlayer({ audioUrl, trackName }: ExpoAudioPlayerProps) {
  // Create player instance
  const player = useAudioPlayer(audioUrl)

  // Subscribe to status updates
  const status = useAudioPlayerStatus(player)

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage
  const progress = status.duration > 0
    ? (status.currentTime / status.duration) * 100
    : 0

  return (
    <View>
      <Text>{trackName}</Text>

      {/* Playback Controls */}
      <Button
        title={status.playing ? 'Pause' : 'Play'}
        onPress={() => status.playing ? player.pause() : player.play()}
      />

      {/* Time Display */}
      <Text>
        {formatTime(status.currentTime)} / {formatTime(status.duration)}
      </Text>

      {/* Progress Bar */}
      <View style={{ width: '100%', height: 4, backgroundColor: '#ddd' }}>
        <View
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#007AFF'
          }}
        />
      </View>

      {/* Loading Indicator */}
      {!status.isLoaded && <Text>Loading...</Text>}
    </View>
  )
}
```

## Important Notes

### 1. Audio Source
The `useAudioPlayer()` hook accepts:
- **URL string:** `"https://example.com/audio.mp3"`
- **Local asset:** `require('./audio.mp3')`
- **URI object:** `{ uri: "https://..." }`

For our Jamendo app, we'll use URL strings from the API.

### 2. Auto-Reset Behavior
Unlike the deprecated `expo-av`, expo-audio does NOT automatically reset the position to 0 after playback finishes.

If you want to replay from the beginning:
```typescript
useEffect(() => {
  if (status.currentTime >= status.duration && !status.playing) {
    player.seekTo(0)
  }
}, [status.currentTime, status.duration, status.playing])
```

### 3. iOS Background Audio
To enable background playback on iOS, add to `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["audio"]
      }
    }
  }
}
```

### 4. Web Requirements
For web deployment, the site must be served over HTTPS.

### 5. Cleanup
The player automatically cleans up when the component unmounts. No manual cleanup needed.

## Advanced: Seekable Progress Bar

```typescript
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { View, Pressable } from 'react-native'

export function SeekableProgressBar({ player, status }) {
  const handleSeek = (event) => {
    const { locationX } = event.nativeEvent
    const { width } = event.target.measure()
    const percentage = locationX / width
    const newPosition = percentage * status.duration
    player.seekTo(newPosition)
  }

  const progress = status.duration > 0
    ? (status.currentTime / status.duration) * 100
    : 0

  return (
    <Pressable onPress={handleSeek}>
      <View style={{ width: '100%', height: 40, justifyContent: 'center' }}>
        <View style={{ height: 4, backgroundColor: '#ddd', borderRadius: 2 }}>
          <View
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#007AFF',
              borderRadius: 2
            }}
          />
        </View>
      </View>
    </Pressable>
  )
}
```

## Error Handling

```typescript
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { useState } from 'react'

export function ExpoAudioPlayerWithErrorHandling({ audioUrl }) {
  const [error, setError] = useState<string | null>(null)

  try {
    const player = useAudioPlayer(audioUrl)
    const status = useAudioPlayerStatus(player)

    // Check for loading errors
    if (!status.isLoaded && error === null) {
      setError('Failed to load audio')
    }

    if (error) {
      return <Text>Error: {error}</Text>
    }

    return (
      <View>
        {/* Player UI */}
      </View>
    )
  } catch (e) {
    return <Text>Error initializing player: {e.message}</Text>
  }
}
```

## Complete Component Template

See `packages/components/src/player/ExpoAudioPlayer.tsx` for the full implementation with:
- Play/Pause toggle
- Seekable progress bar
- Time display (current / duration)
- Loading state
- Error handling
- Clean UI with proper styling

## Comparison with expo-av

| Feature | expo-av (deprecated) | expo-audio |
|---------|---------------------|------------|
| API Style | Object-based | Hook-based |
| Status Updates | Callbacks | Hook subscription |
| Auto-reset | Yes | No (manual) |
| React Native | Yes | Yes |
| Modern | No | Yes |
| Maintenance | Deprecated | Active |

## Resources

- [Official Expo Audio Docs](https://docs.expo.dev/versions/latest/sdk/audio/)
- [API Reference](https://docs.expo.dev/versions/latest/sdk/audio/#api)
- [Migration from expo-av](https://docs.expo.dev/versions/latest/sdk/audio/#migrating-from-expo-av)
