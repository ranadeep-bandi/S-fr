import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
 
const SavedPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Saved Page</Text>
      <Text style={styles.text}>Here you can see your saved items.</Text>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D1E9F6',
  },
  text: {
    fontSize: 18,
  },
});
 
export default SavedPage;