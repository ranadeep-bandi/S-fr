import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SavedPage from './SavedPage';
import SettingsPage from './SettingsPage';
import Header from './Header';
import CookieManager from '@react-native-cookies/cookies';
import Articles from './Articles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faNewspaper, faBookmark, faList, faCog } from '@fortawesome/free-solid-svg-icons';
import CategoriesScreen from './CategoriesScreen';
 
const Tab = createBottomTabNavigator();
 
const CustomerTabNavigator = ({ navigation, route }) => {
  const [username, setUsername] = useState(null);
  const selectedCategoryIds = route.params?.selectedCategoryIds || [];
 
  useEffect(() => {
    const getUsernameFromCookies = async () => {
      const cookies = await CookieManager.get('https://suman-backend.onrender.com');
      if (cookies.username) {
        setUsername(cookies.username.value);
      }
    };
 
    getUsernameFromCookies();
  }, []);
 
  const handleLogout = async () => {
    try {
      await CookieManager.clearAll();
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };
 
  return (
    <View style={{ flex: 1 }}>
      <Header username={username} onLogout={handleLogout} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#e72967',
            borderTopWidth: 0,
            elevation: 5,
            height: 60,
          },
          tabBarIcon: ({ focused, color, size }) => {
            let icon;
 
            switch (route.name) {
              case 'Articles':
                icon = faNewspaper;
                break;
              case 'Saved':
                icon = faBookmark;
                break;
              case 'Categories':
                icon = faList;
                break;
              case 'Settings':
                icon = faCog;
                break;
              default:
                icon = faNewspaper;
            }
 
            return (
              <FontAwesomeIcon
                icon={icon}
                size={size}
                color={focused ? '#CBD2A4' : 'white'}
                style={{marginTop:'auto'}}
              />
            );
          },
          tabBarLabel: '', // Remove text labels
        })}
      >
        <Tab.Screen
          name="Articles"
          children={() => <Articles selectedCategoryIds={selectedCategoryIds} />}
        />
        <Tab.Screen name="Saved" component={SavedPage} />
        <Tab.Screen name="Categories" component={CategoriesScreen} />
        <Tab.Screen name="Settings" component={SettingsPage} />
      </Tab.Navigator>
    </View>
  );
};
 
export default CustomerTabNavigator;
 
 