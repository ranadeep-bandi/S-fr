import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CookieManager from '@react-native-cookies/cookies';
 
 
 
 
 
import Login from './Components/Login';
import Register from './Components/Register';
import Articles from './Components/Articles';
import CategoriesScreen from './Components/CategoriesScreen';
import LoadingScreen from './Components/LoadingScreen';
import CustomerTabNavigator from './Components/CustomerTabNavigator';
 
const Stack = createNativeStackNavigator();
 
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
 
  useEffect(() => {
    const checkLoginCookie = async () => {
      const cookies = await CookieManager.get('https://suman-backend.onrender.com');
      setIsLoggedIn(!!cookies.jwtToken);
    };
    checkLoginCookie();
  }, []);
 
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        {isLoggedIn === null ? (
         
          <Stack.Screen name="Loading" component={LoadingScreen} />
        ) : isLoggedIn ? (
       
          <>
            <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CustomerTabNavigator" component={CustomerTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          </>
        ) : (
 
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CustomerTabNavigator" component={CustomerTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
 
export default App;
 
 