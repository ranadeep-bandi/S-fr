import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  Animated,
} from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
 
const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [token, setToken] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value
  const [messageVisible, setMessageVisible] = useState(false);
  const navigation = useNavigation();
 
  useEffect(() => {
    const getToken = async () => {
      const cookies = await CookieManager.get('https://suman-backend.onrender.com');
      const jwtToken = cookies.jwtToken ? cookies.jwtToken.value : null;
      setToken(jwtToken);
    };
 
    getToken();
  }, []);
 
  useEffect(() => {
    if (token) {
      fetch('https://suman-backend.onrender.com/get-all-categorys', {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => setCategories(data))
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [token]);
 
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };
 
  const handleNext = () => {
    console.log('Selected categories:', selectedCategories);
    navigation.navigate('CustomerTabNavigator', { selectedCategoryIds: selectedCategories });
   
    // Show success message
    setMessageVisible(true);
    fadeIn();
    setTimeout(() => {
      fadeOut();
    }, 2000); // Duration for message display
  };
 
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
 
  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setMessageVisible(false)); // Hide message after fade out
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Your Favorite Categories</Text>
      <ScrollView contentContainerStyle={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryButton, selectedCategories.includes(category.id) && styles.selected]}
            onPress={() => toggleCategory(category.id)}
          >
            <Image
              source={{
                uri: category.image.includes('localhost')
                  ? category.image.replace('http://localhost:4000', 'https://suman-backend.onrender.com')
                  : category.image,
              }}
              style={styles.categoryImage}
              resizeMode="cover"
            />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: selectedCategories.length === 0 ? '#ccc' : '#e72967' } // Change colors as needed
        ]}
        onPress={handleNext}
        disabled={selectedCategories.length === 0}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
 
      {/* Animated Success Message */}
      {messageVisible && (
        <Animated.View style={[styles.successMessage, { opacity: fadeAnim }]}>
          <Text style={styles.successText}>Categories selected successfully!</Text>
        </Animated.View>
      )}
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  categoryButton: {
    width: 110,
    height: 140,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#e72967',
  },
  selected: {
    backgroundColor: '#add8e6',
  },
  categoryImage: {
    width: '90%',
    height: 100,
    borderRadius: 8,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
  },
  submitButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  successText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
 
export default CategoriesScreen;
 