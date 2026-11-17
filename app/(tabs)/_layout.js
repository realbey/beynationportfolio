import React from 'react';
import { Tabs } from 'expo-router';
import Icon from '../../components/Icon';
import { colors } from '../../constants/theme';

const TABS = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'about', title: 'About', icon: 'person' },
  { name: 'projects', title: 'Projects', icon: 'layers' },
  { name: 'skills', title: 'Skills', icon: 'flash' },
  { name: 'contact', title: 'Contact', icon: 'mail' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.cyan,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
        tabBarStyle: {
          backgroundColor: 'rgba(5, 11, 20, 0.97)',
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ color, focused }) => (
              <Icon name={focused ? t.icon : `${t.icon}-outline`} size={22} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
