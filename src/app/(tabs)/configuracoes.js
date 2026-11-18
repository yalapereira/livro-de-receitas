import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';

// Configurações: tema claro/escuro (salvo no AsyncStorage) e limpar favoritas.
export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useAppTheme();
  const { favorites, clearFavorites } = useFavorites();

  function handleClear() {
    Alert.alert('Limpar favoritas', 'Deseja remover todas as receitas favoritas?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: clearFavorites },
    ]);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <Text style={[styles.title, { color: colors.text }]}>Ajustes</Text>

      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.rowText}>
          <Text style={[styles.label, { color: colors.text }]}>Tema escuro</Text>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>A escolha fica salva no celular</Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.section}>
        <PrimaryButton
          title={`Limpar favoritas (${favorites.length})`}
          icon="trash-outline"
          variant="outline"
          color={colors.danger}
          onPress={handleClear}
        />
      </View>

      <Text style={[styles.footer, { color: colors.textSecondary }]}>
        Dados das receitas: TheMealDB (themealdb.com)
      </Text>
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
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    minHeight: 64,
  },
  rowText: {
    flex: 1,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    marginTop: 24,
  },
  footer: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 16,
  },
});
