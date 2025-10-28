import { Stack } from 'expo-router';
import { COLORS } from '../src/constants/colors';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.white },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="book-ride" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="share-trip" />
      <Stack.Screen name="navigation" />
      <Stack.Screen name="sos" />
    </Stack>
  );
}
