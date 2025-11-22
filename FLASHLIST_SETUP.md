# FlashList Setup for Expo

The FlashList library requires native modules that may not be available in Expo Go. Here are the steps to fix the error:

## Option 1: Development Build (Recommended)

FlashList works best with a custom development build:

```bash
cd apps/example

# Install Expo CLI if not installed
npm install -g expo-cli

# Create a development build for iOS
npx expo run:ios

# Or for Android
npx expo run:android
```

This will create a development build with all native dependencies properly configured.

## Option 2: Clear Cache and Restart

Sometimes clearing the cache helps:

```bash
cd apps/example

# Clear Metro bundler cache
rm -rf .expo
rm -rf node_modules/.cache

# Restart with clean cache
pnpm ios -- --clear
```

## Option 3: Prebuild (Generate Native Folders)

```bash
cd apps/example

# Generate native iOS and Android folders
npx expo prebuild

# Run on iOS
pnpm ios

# Or on Android
pnpm android
```

## Option 4: Use Regular FlatList (Temporary)

If you need to test quickly without rebuilding, you can temporarily use React Native's FlatList:

```tsx
// In apps/example/app/(tabs)/index.tsx
// Replace:
import { FlashList } from '@shopify/flash-list';

// With:
import { FlatList } from 'react-native';

// Replace FlashList component with FlatList:
<FlatList
  testID="track-list"
  data={tracks}
  renderItem={renderTrackItem}
  keyExtractor={(item: any) => item.id}
/>
```

## Verification

After applying the fix, verify FlashList is working:

1. Start the app: `pnpm ios` or `pnpm android`
2. Navigate to the home screen
3. Search for tracks (e.g., "jazz")
4. Verify the track list scrolls smoothly
5. Check for no console errors

## Why This Error Occurs

The error `Module has not been registered as callable` occurs because:

1. FlashList uses native modules (RecyclerListView)
2. Expo Go has a limited set of native modules
3. Custom native modules require a development build
4. Metro bundler cache may have stale references

## Production Build

For production, always use a development build or EAS Build:

```bash
# Using EAS Build
eas build --platform ios --profile development
eas build --platform android --profile development
```

## Additional Resources

- [FlashList Expo Setup](https://shopify.github.io/flash-list/docs/getting-started)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)
