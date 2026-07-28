import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors, fonts, radius, type } from '../theme';

interface FieldProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  hint?: string;
  containerStyle?: ViewStyle;
}

export function Field({ label, icon, hint, containerStyle, style, ...rest }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={containerStyle}>
      {label ? <Text style={[type.label, styles.label]}>{label}</Text> : null}
      <View style={[styles.box, focused && styles.boxFocused]}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <TextInput
          placeholderTextColor={colors.gray500}
          style={[styles.input, style]}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 8, marginLeft: 2 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  boxFocused: { borderColor: colors.pink },
  icon: { opacity: 0.9 },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: 14,
  },
  hint: { fontFamily: fonts.body, fontSize: 12.5, color: colors.gray500, marginTop: 6, marginLeft: 2 },
});
