# @jamendo/rtk-services

Redux Toolkit Query services for the Jamendo Music API.

## Overview

This package provides RTK Query endpoints for interacting with the Jamendo API, including:

- **Track Search** - Search for music tracks with minimal fields (optimized for list views)
- **Track Details** - Fetch complete track information including audio URLs
- **Automatic Caching** - RTK Query handles caching and refetching automatically
- **TypeScript Support** - Fully typed API responses and requests

## Getting Your Jamendo API Client ID

Before you can use this package, you need to obtain a `client_id` from Jamendo:

### Step 1: Register at Jamendo Developer Portal

1. Visit [https://devportal.jamendo.com](https://devportal.jamendo.com)
2. Create a developer account (or log in if you already have one)
3. Register your application to receive a `client_id`

### Step 2: Save Your Client ID

Once you have your `client_id`, you'll use it to configure the environment variables.

## Environment Setup

### For Expo Apps (React Native)

Create a `.env` file in your **app root directory** (e.g., `apps/example/.env`):

```bash
# Jamendo API Configuration
EXPO_PUBLIC_JAMENDO_CLIENT_ID=your_client_id_here
```

**Important Notes:**

- The prefix `EXPO_PUBLIC_` is **required** for Expo to expose the variable to your app
- Replace `your_client_id_here` with your actual client ID from the Jamendo developer portal
- Add `.env` to your `.gitignore` to keep your credentials secure

### For Web Apps (Non-Expo)

Create a `.env` file in your project root:

```bash
# Jamendo API Configuration
VITE_JAMENDO_CLIENT_ID=your_client_id_here
# or for Create React App:
REACT_APP_JAMENDO_CLIENT_ID=your_client_id_here
```

## Installation

This package is part of the monorepo and uses workspace dependencies:

```bash
pnpm install
```

## Usage

### 1. Setup Redux Provider

Wrap your app with the Redux Provider:

```typescript
import { Provider } from 'react-redux';
import { store } from '@jamendo/rtk-services';

export default function App() {
  return (
    <Provider store={store}>
      {/* Your app components */}
    </Provider>
  );
}
```

### 2. Search for Tracks

Use the `useSearchTracksQuery` hook to search for music:

```typescript
import { useSearchTracksQuery } from '@jamendo/rtk-services';

function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('jazz');
  const { data, isLoading, error } = useSearchTracksQuery(searchTerm, {
    skip: searchTerm.length < 2, // Don't search if query is too short
  });

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error loading tracks</Text>;

  return (
    <FlatList
      data={data?.results}
      renderItem={({ item }) => (
        <TrackCard
          id={item.id}
          name={item.name}
          artist={item.artist_name}
          image={item.image}
        />
      )}
    />
  );
}
```

### 3. Get Track Details

Use the `useGetTrackDetailQuery` hook to fetch full track information:

```typescript
import { useGetTrackDetailQuery } from '@jamendo/rtk-services';

function TrackDetailScreen({ trackId }: { trackId: string }) {
  const { data: track, isLoading, error } = useGetTrackDetailQuery(trackId);

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error loading track</Text>;
  if (!track) return null;

  return (
    <ScrollView>
      <Image source={{ uri: track.image }} />
      <Text>{track.name}</Text>
      <Text>{track.artist_name}</Text>
      <Text>{track.album_name}</Text>
      <AudioPlayer audioUrl={track.audio} />
    </ScrollView>
  );
}
```

## API Endpoints

### `searchTracks`

Search for tracks with minimal fields (optimized for list views).

**Parameters:**
- `searchTerm: string` - Search query

**Returns:**
- `JamendoSearchResponse` with minimal track data:
  - `id` - Track identifier
  - `name` - Track title
  - `artist_name` - Artist name
  - `image` - Album artwork URL

**Example:**
```typescript
const { data } = useSearchTracksQuery('electronic');
```

### `getTrackDetail`

Fetch complete track information including audio URL.

**Parameters:**
- `trackId: string` - Track ID

**Returns:**
- `JamendoTrack` with full track data:
  - All metadata (album, duration, release date, etc.)
  - Audio playback URL (`audio` field)
  - License information
  - Music info and lyrics (if available)

**Example:**
```typescript
const { data } = useGetTrackDetailQuery('1234567');
```

## Field Optimization

This package uses **optimized field selection** to minimize API payload size:

- **Search endpoint** - Requests only essential fields (`id`, `name`, `artist_name`, `image`)
- **Detail endpoint** - Requests complete track information including audio URL

This approach improves performance and reduces bandwidth usage.

## Caching Behavior

RTK Query automatically caches API responses:

- **Automatic cache** - Results are cached on first request
- **Refetch on mount** - Cached data is returned immediately, fresh data fetched in background
- **Shared cache** - Multiple components using the same query share cached data
- **No manual management** - Cache invalidation handled automatically

## TypeScript Support

All API responses and requests are fully typed:

```typescript
import type {
  JamendoTrack,
  JamendoSearchResponse,
  JamendoTrackDetailResponse,
} from '@jamendo/rtk-services';
```

## Testing

This package includes comprehensive tests using Mock Service Worker (MSW):

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage
```

### Test Structure

- **MSW Handlers** - Mock Jamendo API responses
- **API Tests** - Test both search and detail endpoints
- **Caching Tests** - Verify RTK Query caching behavior

## API Documentation

For complete Jamendo API documentation, visit:

- **API Reference**: [https://developer.jamendo.com/v3.0](https://developer.jamendo.com/v3.0)
- **Tracks Endpoint**: [https://developer.jamendo.com/v3.0/tracks](https://developer.jamendo.com/v3.0/tracks)
- **Developer Portal**: [https://devportal.jamendo.com](https://devportal.jamendo.com)

## Rate Limits

Jamendo API does not explicitly specify rate limits, but:

- Default limit: **10 results** per request
- Maximum limit: **200 results** per request
- Use pagination for large result sets

## Troubleshooting

### "Missing client_id" Error

**Problem:** API requests fail with authentication error.

**Solution:**
1. Verify `.env` file exists in your app root
2. Check that `EXPO_PUBLIC_JAMENDO_CLIENT_ID` is set correctly
3. Restart your development server after adding `.env`
4. For Expo: Run `npx expo start --clear` to clear cache

### "Cannot read property 'results' of undefined"

**Problem:** Trying to access data before query completes.

**Solution:**
```typescript
const { data, isLoading } = useSearchTracksQuery('query');

// Always check loading state and data existence
if (isLoading) return <Spinner />;
if (!data) return null;

// Now safe to access data.results
return <List data={data.results} />;
```

### TypeScript Errors

**Problem:** Type errors when accessing track properties.

**Solution:** Import and use the provided types:
```typescript
import type { JamendoTrack } from '@jamendo/rtk-services';

function TrackComponent({ track }: { track: JamendoTrack }) {
  // TypeScript will autocomplete all track properties
}
```

## Contributing

This package follows the monorepo structure. To make changes:

1. Make your changes in `packages/rtk-services/src/`
2. Update tests in `packages/rtk-services/src/__tests__/`
3. Run tests: `pnpm test`
4. Run linter: `pnpm lint`
5. Commit changes

## License

MIT

## Author

Ali Fathieh
