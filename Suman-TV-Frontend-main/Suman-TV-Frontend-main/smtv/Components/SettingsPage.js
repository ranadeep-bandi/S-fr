import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
 
const SettingsPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Settings Page</Text>
      <Text style={styles.text}>Here you can modify your app settings.</Text>
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
 
export default SettingsPage;