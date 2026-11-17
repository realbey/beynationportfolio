import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useBreakpoint } from '../lib/responsive';

// Lays items out in equal-width columns. Items in the same row stretch to equal height.
export default function ResponsiveGrid({ items, renderItem, columns, gap = 16, style }) {
  const bp = useBreakpoint();
  const cols = Math.max(1, columns || bp.columns);
  const itemWidth = Math.floor((bp.contentWidth - gap * (cols - 1)) / cols);

  return (
    <View style={[styles.grid, { gap }, style]}>
      {items.map((item, index) => (
        <View key={item.id || item.key || String(index)} style={{ width: itemWidth }}>
          {renderItem(item, index)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch' },
});
