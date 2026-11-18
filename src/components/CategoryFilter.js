import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { translateCategory } from '../services/categoryNames';

// Fileira horizontal de botões para escolher a categoria das receitas.
export default function CategoryFilter({ categories, selected, onSelect }) {
  const { colors } = useAppTheme();

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.idCategory}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.list}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => {
        const active = item.strCategory === selected;
        return (
          <Pressable
            onPress={() => onSelect(item.strCategory)}
            style={[styles.chip, { backgroundColor: active ? colors.primary : colors.chip }]}
          >
            <Text style={[styles.chipText, { color: active ? colors.primaryText : colors.text }]}>
              {translateCategory(item.strCategory)}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 0,
    marginBottom: 12,
  },
  content: {
    gap: 8,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
