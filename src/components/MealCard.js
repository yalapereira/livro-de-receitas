import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';

// Um item da lista: foto, nome e botão de favoritar.
export default function MealCard({ meal, onPress }) {
  const { colors } = useAppTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(meal.idMeal);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
        {meal.strMeal}
      </Text>
      <Pressable
        onPress={() => toggleFavorite(meal)}
        hitSlop={8}
        style={styles.favoriteButton}
        accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={26} color={colors.primary} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
