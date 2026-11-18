import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CategoryFilter from '../../components/CategoryFilter';
import MealCard from '../../components/MealCard';
import SearchBar from '../../components/SearchBar';
import StatusMessage from '../../components/StatusMessage';
import { useAppTheme } from '../../context/ThemeContext';
import { fetchCategories, fetchMealsByCategory } from '../../services/mealApi';
import { translateCategory } from '../../services/categoryNames';

// Tela inicial: lista de receitas da categoria escolhida, com busca por nome.
export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Chicken');
  const [meals, setMeals] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  async function loadCategories() {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.warn('Erro ao buscar categorias', err);
    }
  }

  async function loadMeals(category) {
    try {
      setError(null);
      const data = await fetchMealsByCategory(category);
      setMeals(data);
    } catch (err) {
      setError('Não foi possível carregar as receitas. Verifique sua internet.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Busca as categorias uma vez, quando a tela abre
  useEffect(() => {
    loadCategories();
  }, []);

  // Busca as receitas quando a tela abre e sempre que a categoria muda
  useEffect(() => {
    setLoading(true);
    loadMeals(selectedCategory);
  }, [selectedCategory]);

  // Puxar a lista para baixo recarrega os dados
  function handleRefresh() {
    setRefreshing(true);
    loadMeals(selectedCategory);
  }

  function handleRetry() {
    setLoading(true);
    if (categories.length === 0) loadCategories();
    loadMeals(selectedCategory);
  }

  // Filtro local: mantém só as receitas cujo nome contém o texto digitado
  const filteredMeals = meals.filter((meal) =>
    meal.strMeal.toLowerCase().includes(search.trim().toLowerCase())
  );

  function renderContent() {
    if (loading) {
      return <StatusMessage type="loading" message="Buscando receitas..." />;
    }
    if (error) {
      return <StatusMessage type="error" message={error} onRetry={handleRetry} />;
    }
    return (
      <FlatList
        data={filteredMeals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <MealCard meal={item} onPress={() => router.push(`/receita/${item.idMeal}`)} />
        )}
        ListEmptyComponent={
          <StatusMessage
            type="empty"
            message={search ? `Nenhuma receita encontrada para "${search}".` : 'Nenhuma receita nesta categoria.'}
          />
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <Text style={[styles.title, { color: colors.text }]}>Livro de Receitas</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {translateCategory(selectedCategory)} · {filteredMeals.length} receitas
      </Text>
      <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar receita pelo nome" />
      <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      {renderContent()}
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
