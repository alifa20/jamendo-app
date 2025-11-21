import { StyleSheet, TextInput as RNTextInput, TextInputProps } from 'react-native';

export const TextInput = ({ style, ...props }: TextInputProps) => (
  <RNTextInput
    {...props}
    style={[$textInput, style]}
    placeholderTextColor="#999"
  />
);

const { $textInput } = StyleSheet.create({
  $textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
