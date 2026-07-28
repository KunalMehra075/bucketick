import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius, shadow, type } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled,
  loading,
  icon,
  fullWidth = true,
  style,
}: ButtonProps) {
  const height = size === 'lg' ? 54 : 46;
  const isDisabled = disabled || loading;

  const inner = (
    <View style={styles.inner}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.ink} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              type.button,
              { color: variant === 'primary' ? colors.white : colors.ink },
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </View>
  );

  const shape: ViewStyle = {
    height,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    opacity: isDisabled ? 0.55 : 1,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
  };

  if (variant === 'primary') {
    return (
      <Pressable onPress={onPress} disabled={isDisabled} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }, style]}>
        <LinearGradient
          colors={gradients.sunrise.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[shape, shadow.md]}
        >
          {inner}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        shape,
        variant === 'secondary'
          ? { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.gray200, ...shadow.sm }
          : { backgroundColor: 'transparent' },
        { transform: [{ scale: pressed ? 0.98 : 1 }] },
        style,
      ]}
    >
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
