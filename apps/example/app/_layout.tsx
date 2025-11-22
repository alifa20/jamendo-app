import { store } from '@jamendo/rtk-services';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'card',
              title: 'Modal',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="track/[id]"
            options={{
              title: 'Track Details',
              headerBackTitle: 'Back',
              headerTransparent: true,
              headerShadowVisible: false,
              headerStyle: { backgroundColor: 'transparent' },
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </Provider>
    </ThemeProvider>
  );
}
