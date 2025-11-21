import { StyleSheet, TextInput as RNTextInput, TextInputProps } from 'react-native';

import { colors } from './theme';

export interface CustomTextInputProps extends TextInputProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const TextInput = ({
  style,
  accessibilityLabel,
  accessibilityHint,
  ...props
}: CustomTextInputProps) => (
  <RNTextInput
    {...props}
    style={[$textInput, style]}
    placeholderTextColor={colors.text.placeholder}
    accessible={true}
    accessibilityLabel={accessibilityLabel}
    accessibilityHint={accessibilityHint}
  />
);

const { $textInput } = StyleSheet.create({
  $textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.white,
  },
});
