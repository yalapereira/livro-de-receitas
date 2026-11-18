import { useEffect, useState } from 'react';
import { Image, Linking, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import PrimaryButton from '../../components/PrimaryButton';
import StatusMessage from '../../components/StatusMessage';
import { useAppTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { fetchMealById, getIngredients } from '../../services/mealApi';
import { translateCategory } from '../../services/categoryNames';

// Tela de detalhes: recebe o id pela rota (/receita/52772) e busca a receita completa.
export default function MealDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useAppTheme();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadMeal() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMealById(id);
      if (!data) {
        setError('Receita não encontrada.');
      } else {
        setMeal(data);
      }
    } catch (err) {
      setError('Não foi possível carregar a receita. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  }

  // Busca a receita quando a tela abre (e se o id mudar)
  useEffect(() => {
    loadMeal();
  }, [id]);

  // Recurso nativo: abre o menu de compartilhamento do celular
  async function handleShare() {
    try {
      const ingredients = getIngredients(meal)
        .map((item) => `• ${item.measure} ${item.name}`.trim())
        .join('\n');
      await Share.share({
        title: meal.strMeal,
        message: `${meal.strMeal}\n\nIngredientes:\n${ingredients}\n\nVi no app Livro de Receitas!`,
      });
    } catch (err) {
      console.warn('Erro ao compartilhar', err);
    }
  }

  if (loading) {
    return <StatusMessage type="loading" message="Carregando receita..." />;
  }

  if (error) {
    return <StatusMessage type="error" message={error} onRetry={loadMeal} />;
  }

  const favorite = isFavorite(meal.idMeal);
  const ingredients = getIngredients(meal);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: meal.strMeal }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: meal.strMealThumb }} style={styles.image} />

        <Text style={[styles.title, { color: colors.text }]}>{meal.strMeal}</Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {translateCategory(meal.strCategory)} · Origem: {meal.strArea}
        </Text>

        <View style={styles.buttons}>
          <View style={styles.buttonWrapper}>
            <PrimaryButton
              title={favorite ? 'Favoritada' : 'Favoritar'}
              icon={favorite ? 'heart' : 'heart-outline'}
              variant={favorite ? 'filled' : 'outline'}
              onPress={() => toggleFavorite(meal)}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <PrimaryButton title="Compartilhar" icon="share-social-outline" variant="outline" onPress={handleShare} />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredientes</Text>
        <View style={[styles.box, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {ingredients.map((item, index) => (
            <Text key={`${index}-${item.name}`} style={[styles.ingredient, { color: colors.text }]}>
              • <Text style={styles.bold}>{item.measure}</Text> {item.name}
            </Text>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Modo de preparo</Text>
        <Text style={[styles.instructions, { color: colors.text }]}>{meal.strInstructions}</Text>

        {meal.strYoutube ? (
          <PrimaryButton
            title="Ver vídeo no YouTube"
            icon="logo-youtube"
            onPress={() => Linking.openURL(meal.strYoutube)}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 16,
  },
  meta: {
    fontSize: 15,
    marginTop: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  buttonWrapper: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
  },
  box: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  ingredient: {
    fontSize: 16,
  },
  bold: {
    fontWeight: '700',
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
});
