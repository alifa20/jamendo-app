import { StyleSheet, Text, TextProps } from 'react-native';

export const Strong = ({ children, style, ...props }: TextProps) => (
  <Text {...props} style={[styles.strong, style]}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  strong: {
    fontWeight: 'bold',
  },
});
