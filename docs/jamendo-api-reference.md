# Jamendo API Reference

**Base URL:** `https://api.jamendo.com/v3.0`
**Documentation:** https://developer.jamendo.com/v3.0/tracks

## Authentication

All requests require a `client_id` parameter.

```
GET https://api.jamendo.com/v3.0/tracks?client_id=YOUR_CLIENT_ID&...
```

## Endpoints

### Tracks Endpoint
`GET /tracks`

Main endpoint for searching and retrieving track information.

## Query Parameters

### Search Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `client_id` | string | **Required.** Your API client ID |
| `namesearch` | string | Search by track, album, or artist name |
| `id` | string | Specific track ID(s), comma-separated |
| `limit` | number | Number of results (default: 10, max: 200) |
| `offset` | number | Pagination offset |

### Field Selection

| Parameter | Type | Description |
|-----------|------|-------------|
| `format` | string | Response format: `json`, `jsonpretty`, `xml` |
| `include` | string | Additional data: `musicinfo`, `lyrics`, `stats` |
| `imagesize` | number | Album art size in pixels (25-600) |
| `audioformat` | string | Audio format: `mp31`, `mp32`, `ogg` |

## Response Fields

### Minimal Fields (for List View)

```json
{
  "results": [
    {
      "id": "123456",
      "name": "Track Name",
      "artist_name": "Artist Name",
      "image": "https://...",
      "duration": 234
    }
  ]
}
```

### Full Fields (for Detail View)

```json
{
  "results": [
    {
      "id": "123456",
      "name": "Track Name",
      "artist_name": "Artist Name",
      "artist_id": "12345",
      "album_name": "Album Name",
      "album_id": "67890",
      "releasedate": "2024-01-15",
      "duration": 234,
      "image": "https://usercontent.jamendo.com?type=album&id=...",
      "audio": "https://mp3d.jamendo.com/download/track/...",
      "audiodownload": "https://...",
      "position": 3,
      "license_ccurl": "https://creativecommons.org/...",
      "musicinfo": {
        "vocalinstrumental": "vocal",
        "gender": "male",
        "speed": "medium",
        "tags": {
          "genres": ["rock", "indie"],
          "instruments": ["guitar", "drums"],
          "vartags": ["energetic", "upbeat"]
        }
      }
    }
  ]
}
```

## Our Implementation

### Search Query (Home Page)
Minimal fields to reduce bandwidth and improve performance.

**Request:**
```
GET /tracks?client_id={CLIENT_ID}&namesearch={query}&limit=20&format=json
```

**Fields needed:**
- `id` - For navigation to detail page
- `name` - Track title
- `artist_name` - Artist name
- `image` - Album artwork
- `duration` - Track length (optional for list)

### Detail Query (Detail Page)
Full fields including audio URL.

**Request:**
```
GET /tracks?client_id={CLIENT_ID}&id={trackId}&include=musicinfo+lyrics&audioformat=mp31
```

**Fields needed:**
- All basic fields (id, name, artist_name, etc.)
- `audio` - **Required for playback**
- `album_name` - Album information
- `releasedate` - Release date
- `musicinfo` - Genre, mood, instruments
- `lyrics` - Track lyrics (if available)

## Audio URLs

The `audio` field provides an MP3 URL:
```
https://mp3d.jamendo.com/download/track/{trackId}/mp31/
```

**Audio Formats:**
- `mp31` - Standard quality (~128 kbps)
- `mp32` - High quality (~192 kbps)
- `ogg` - Ogg Vorbis format

For our app, we'll use `mp31` for consistency.

## Example Requests

### 1. Search for "rock"
```
GET https://api.jamendo.com/v3.0/tracks
  ?client_id=YOUR_CLIENT_ID
  &namesearch=rock
  &limit=20
  &format=json
```

### 2. Get specific track details
```
GET https://api.jamendo.com/v3.0/tracks
  ?client_id=YOUR_CLIENT_ID
  &id=123456
  &include=musicinfo
  &audioformat=mp31
```

### 3. Search with image size
```
GET https://api.jamendo.com/v3.0/tracks
  ?client_id=YOUR_CLIENT_ID
  &namesearch=jazz
  &imagesize=200
  &limit=10
```

## TypeScript Types

### Basic Track (List View)
```typescript
export interface JamendoTrackBasic {
  id: string
  name: string
  artist_name: string
  image: string
  duration: number
}

export interface JamendoSearchResponse {
  results: JamendoTrackBasic[]
  headers: {
    status: string
    code: number
    error_message: string
    warnings: string
    results_count: number
  }
}
```

### Full Track (Detail View)
```typescript
export interface JamendoTrackFull extends JamendoTrackBasic {
  artist_id: string
  album_name: string
  album_id: string
  releasedate: string
  audio: string
  audiodownload: string
  position: number
  license_ccurl: string
  musicinfo?: {
    vocalinstrumental: 'vocal' | 'instrumental'
    gender: 'male' | 'female' | 'mixed'
    speed: 'low' | 'medium' | 'high' | 'veryhigh'
    tags: {
      genres: string[]
      instruments: string[]
      vartags: string[]
    }
  }
}

export interface JamendoTrackDetailResponse {
  results: JamendoTrackFull[]
  headers: {
    status: string
    code: number
    error_message: string
    warnings: string
    results_count: number
  }
}
```

## Rate Limits

- **Free tier:** 10,000 requests/day
- **Respect:** Be mindful of API usage
- **Caching:** Use RTK Query caching to minimize requests

## Best Practices

### 1. Optimize Field Selection
✅ **Good:** Only request fields you need
```
?namesearch=rock&limit=10
```

❌ **Bad:** Request all fields for list view
```
?namesearch=rock&include=musicinfo+lyrics&limit=10
```

### 2. Use Appropriate Limits
- List view: `limit=20` (one screen worth)
- Detail view: `limit=1` (single track)

### 3. Handle Empty Results
Always check `results_count` before accessing `results[]`:
```typescript
if (data.headers.results_count === 0) {
  return <EmptyState message="No tracks found" />
}
```

### 4. Error Handling
Check the `headers.status` field:
```typescript
if (data.headers.status !== 'success') {
  throw new Error(data.headers.error_message)
}
```

## Common Issues

### Issue: No audio URL
**Cause:** Forgot `audioformat` parameter
**Solution:** Add `&audioformat=mp31` to detail query

### Issue: Low quality images
**Cause:** Default image size is small
**Solution:** Add `&imagesize=300` for better quality

### Issue: Missing track metadata
**Cause:** Didn't request musicinfo
**Solution:** Add `&include=musicinfo` to detail query

## Resources

- [Official Jamendo API Docs](https://developer.jamendo.com/v3.0)
- [Track Endpoint Reference](https://developer.jamendo.com/v3.0/tracks)
- [Get API Client ID](https://developer.jamendo.com/api-keys)
