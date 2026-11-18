import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MealCard from '../../components/MealCard';
import StatusMessage from '../../components/StatusMessage';
import { useAppTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';

// Lista das receitas favoritas, que ficam salvas no celular.
export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { favorites } = useFavorites();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <Text style={[styles.title, { color: colors.text }]}>Minhas favoritas</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {favorites.length} {favorites.length === 1 ? 'receita salva' : 'receitas salvas'}
      </Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <MealCard meal={item} onPress={() => router.push(`/receita/${item.idMeal}`)} />
        )}
        ListEmptyComponent={
          <StatusMessage
            type="empty"
            message="Você ainda não tem favoritas. Toque no coração de uma receita para salvá-la aqui."
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 12,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
});
