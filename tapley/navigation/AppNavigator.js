import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/Login_screen'; // Import your LoginScreen
import RideComparisonScreen from '../screens/Ride/Ride_comparison_screen';
// Import other screens...

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login" // Changed to LoginScreen
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF8C00', // Orange header
          },
          headerTintColor: '#fff', // White text
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerBackTitleVisible: false,
        }}
      >
        {/* Login Screen (No header since it's the first screen) */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Hide header for login
        />

        {/* Ride Comparison Screen (Visible after login) */}
        <Stack.Screen
          name="RideComparison"
          component={RideComparisonScreen}
          options={{ title: 'Compare Ride Options' }}
        />
        {/* Add other screens... */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;