import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

// Botão grande (mínimo 48px de altura) para facilitar o toque.
// variant: 'filled' (cor principal) ou 'outline' (só a borda)
export default function PrimaryButton({ title, onPress, icon, variant = 'filled', color }) {
  const { colors } = useAppTheme();
  const mainColor = color ?? colors.primary;
  const filled = variant === 'filled';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { borderColor: mainColor, backgroundColor: filled ? mainColor : 'transparent' },
        pressed && styles.pressed,
      ]}
    >
      {icon && <Ionicons name={icon} size={20} color={filled ? colors.primaryText : mainColor} />}
      <Text style={[styles.text, { color: filled ? colors.primaryText : mainColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
});
