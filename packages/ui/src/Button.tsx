import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ title, variant = 'primary', style, ...props }: ButtonProps) => (
  <TouchableOpacity
    {...props}
    style={[
      $button,
      variant === 'primary' ? $buttonPrimary : $buttonSecondary,
      style,
    ]}
  >
    <Text style={variant === 'primary' ? $textPrimary : $textSecondary}>
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
    backgroundColor: '#007AFF',
  },
  $buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  $textPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  $textSecondary: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

const { $button, $buttonPrimary, $buttonSecondary, $textPrimary, $textSecondary } = styles;
