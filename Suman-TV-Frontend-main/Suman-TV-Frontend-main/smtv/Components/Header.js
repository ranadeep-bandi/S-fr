import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import { useNavigation } from '@react-navigation/native';
 
const Header = ({ username, onLogout }) => {
  const navigation = useNavigation();
 
  const handleLogout = async () => {
    try {
      await CookieManager.clearAll(); // Clear cookies
      onLogout(); // Trigger logout function passed as prop
      navigation.navigate("Login"); // Navigate to Login
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };
 
  return (
    <View style={styles.navbar}>
      <Image
        source={{ uri: 'https://yt3.googleusercontent.com/r2-7H2lB6olhwIeHJSTTEdyA763fe4OPRgZ7MlUtEsVCUfaFmSooYGiwXoxb5_7pruY99xDF4w=s900-c-k-c0x00ffffff-no-rj' }}
        style={styles.logo}
      />
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};
 
// Styles
const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#e72967',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
 
export default Header;