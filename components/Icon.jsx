import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// Safe wrapper: an unknown icon name (for example one typed in the admin panel)
// shows a placeholder instead of crashing or printing a warning.
export default function Icon({ name, size = 20, color = '#FFFFFF', style }) {
  const valid = Ionicons.glyphMap && Ionicons.glyphMap[name] ? name : 'help-circle-outline';
  return <Ionicons name={valid} size={size} color={color} style={style} />;
}
