import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
 
const Register = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
  });
 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
 
  const handleSubmit = async () => {
    const newInvalidFields = {
      name: !formData.name,
      phoneNumber: !formData.phoneNumber,
      password: !formData.password,
    };
 
    setInvalidFields(newInvalidFields);
 
    // If there are any invalid fields, stop the submission
    if (Object.values(newInvalidFields).some((field) => field)) {
      setError("Please fill in all fields correctly.");
      return;
    }
 
    setLoading(true);
    try {
      const response = await fetch('https://suman-backend.onrender.com/user-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
 
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Registration successful!');
        navigation.navigate('Login'); // Navigate to login after successful registration
      } else {
        Alert.alert('Error', data.message || 'Registration failed.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  const inputStyle = (inputName) => ({
    ...styles.input,
    borderColor: invalidFields[inputName] ? 'red' : (focusedInput === inputName ? '#12B1D1' : 'transparent'),
  });
 
  return (
    <View style={styles.registerPage}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <View style={styles.container}>
          <Text style={styles.heading}>User Registration</Text>
          {error && <Text style={styles.error}>{error}</Text>}
         
          <TextInput
            style={inputStyle('name')}
            placeholder="name"
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
            onFocus={() => handleFocus('name')}
            onBlur={handleBlur}
            placeholderTextColor="black"
          />
          <TextInput
            style={inputStyle('phoneNumber')}
            placeholder="Mobile Number"
            value={formData.phoneNumber}
            onChangeText={(value) => handleChange('phoneNumber', value)}
            keyboardType="numeric"
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
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
         
          <TouchableOpacity style={styles.registerButton} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
          </TouchableOpacity>
          <Text style={styles.loginPrompt}>
            Already have an account?
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}> Login here</Text>
          </Text>
        </View>
      )}
    </View>
  );
};
 
const styles = StyleSheet.create({
  registerPage: {
    backgroundColor: '#e72967',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: 'black',
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
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
  },
  eyeText: {
    color: '#e72967',
  },
  registerButton: {
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
  loginPrompt: {
    textAlign: 'center',
    marginTop: 10,
    color: 'black',
  },
  loginLink: {
    color: '#e72967',
    textDecorationLine: 'underline',
  },
});
 
export default Register;
 