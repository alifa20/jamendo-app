import { View, StyleSheet } from 'react-native';
import { TextInput } from '@jamendo/ui';
import { useState, useEffect } from 'react';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search tracks...',
  debounceMs = 300,
}: SearchBarProps) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChangeText(internalValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onChangeText]);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={internalValue}
        onChangeText={setInternalValue}
        placeholder={placeholder}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    backgroundColor: '#fff',
  },
});
