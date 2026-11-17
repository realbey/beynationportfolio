import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ContentProvider } from '../context/ContentContext';
import { AuthProvider } from '../context/AuthContext';
import { colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ContentProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="project/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="services" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="admin" />
          </Stack>
        </AuthProvider>
      </ContentProvider>
    </GestureHandlerRootView>
  );
}
