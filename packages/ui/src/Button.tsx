import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { colors } from './theme';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button = ({
  title,
  variant = 'primary',
  disabled = false,
  style,
  ...props
}: ButtonProps) => (
  <TouchableOpacity
    {...props}
    disabled={disabled}
    style={[
      $button,
      variant === 'primary' ? $buttonPrimary : $buttonSecondary,
      disabled && $buttonDisabled,
      style,
    ]}
  >
    <Text
      style={[variant === 'primary' ? $textPrimary : $textSecondary, disabled && $textDisabled]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  $button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  $buttonPrimary: {
    backgroundColor: colors.primary,
  },
  $buttonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  $buttonDisabled: {
    backgroundColor: colors.background.disabled,
    borderColor: colors.background.disabled,
  },
  $textPrimary: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  $textSecondary: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  $textDisabled: {
    color: colors.text.placeholder,
  },
});

const {
  $button,
  $buttonPrimary,
  $buttonSecondary,
  $buttonDisabled,
  $textPrimary,
  $textSecondary,
  $textDisabled,
} = styles;
