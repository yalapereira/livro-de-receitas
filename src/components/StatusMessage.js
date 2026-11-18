import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import PrimaryButton from './PrimaryButton';

// Mostra carregamento, erro ou lista vazia, sempre centralizado.
// type: 'loading' | 'error' | 'empty'
export default function StatusMessage({ type, message, onRetry }) {
  const { colors } = useAppTheme();

  if (type === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.text, { color: colors.textSecondary }]}>{message ?? 'Carregando...'}</Text>
      </View>
    );
  }

  const icon = type === 'error' ? 'cloud-offline-outline' : 'restaurant-outline';

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.textSecondary} />
      <Text style={[styles.text, { color: colors.textSecondary }]}>{message}</Text>
      {onRetry && <PrimaryButton title="Tentar de novo" onPress={onRetry} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
