import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CookieManager from '@react-native-cookies/cookies';
 
const Login = () => {
  const navigation = useNavigation();
 
  const [formData, setFormData] = useState({
    // name: '',
    phoneNumber: '',
    password: '',
  });
 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [focusedInput, setFocusedInput] = useState({});
  const [invalidFields, setInvalidFields] = useState({});
 
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setInvalidFields({ ...invalidFields, [name]: false });
  };
 
  const handleFocus = (input) => {
    setFocusedInput(input);
  };
 
  const handleBlur = () => {
    setFocusedInput(null);
  };
 
 
 
 
const handleLogin = async () => {
  const newInvalidFields = {
    // name: !formData.name,
    phoneNumber: !formData.phoneNumber,
    password: !formData.password,
  };
 
  setInvalidFields(newInvalidFields);
 
  if (Object.values(newInvalidFields).some((field) => field)) {
    setError("Please fill in all fields correctly.");
    return;
  }
 
  setLoading(true);
  try {
    const response = await fetch('https://suman-backend.onrender.com/user-login-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
 
    const data = await response.json();
    if (response.ok) {
      const jwtToken = data.jwtToken;
 
      // Store the token in cookies
      await CookieManager.set('https://suman-backend.onrender.com', {
        name: 'jwtToken',
        value: jwtToken,
        path: '/',
        expires: '2030-12-31T23:59:59.999Z'
      });
 
      Alert.alert('Success', 'Login successful!');
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'CategoriesScreen' }],
      // });
      navigation.replace("CategoriesScreen");
    } else {
      Alert.alert('Error', data.message || 'Login failed.');
    }
  } catch (error) {
    Alert.alert('Error', 'An error occurred. Please try again.');
    console.error("Login error:", error);
  } finally {
    setLoading(false);
  }
};
 
 
  const inputStyle = (inputName) => ({
    ...styles.input,
    borderColor: invalidFields[inputName] ? 'red' : (focusedInput === inputName ? '#12B1D1' : 'transparent'),
  });
 
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Login</Text>
        {error && <Text style={styles.error}>{error}</Text>}
       
        {/* <TextInput
          style={inputStyle('name')}
          placeholder="Name"
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          onFocus={() => handleFocus('name')}
          onBlur={handleBlur}
          placeholderTextColor="black"
        /> */}
 
        <TextInput
          style={inputStyle('phoneNumber')}
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(value) => handleChange('phoneNumber', value)}
          keyboardType="phone-pad"
          onFocus={() => handleFocus('phoneNumber')}
          onBlur={handleBlur}
          placeholderTextColor="black"
        />
       
        <View style={styles.passwordContainer}>
          <TextInput
            style={inputStyle('password')}
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry={!showPassword}
            onFocus={() => handleFocus('password')}
            onBlur={handleBlur}
            placeholderTextColor="black"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
            <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
 
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
 
        <Text style={styles.registerPrompt}>
          Don't have an account?
          <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}> Register here</Text>
        </Text>
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e72967',
  },
  container: {
    maxWidth: 400,
    width: '100%',
    backgroundColor: '#F8F9FD',
    borderRadius: 40,
    padding: 25,
    borderWidth: 5,
    borderColor: '#fff',
    shadowColor: 'rgba(133, 189, 215, 0.878)',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 5,
  },
  heading: {
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 30,
    color: '#e72967',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#cff0ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 10,
    color: 'black',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordToggle: {
    position: 'absolute',
    right: 10,
    top: '50%',
  },
  toggleText: {
    color: '#e72967',
  },
  loginButton: {
    backgroundColor: '#e72967',
    paddingVertical: 15,
    marginVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  registerPrompt: {
    textAlign: 'center',
    marginTop: 10,
    color: 'black',
  },
  registerLink: {
    color: '#e72967',
    textDecorationLine: 'underline',
  },
});
 
export default Login;