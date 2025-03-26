import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RideComparisonScreen from '../screens/Ride/Ride_comparison_screen';
// Import other screens...

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="RideComparison"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF8C00', // Orange header for all screens
          },
          headerTintColor: '#fff', // White text
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="RideComparison"
          component={RideComparisonScreen}
          options={{
            title: 'Compare Ride Options',
            // Additional orange theme elements can be added here
          }}
        />
        {/* Add other screens... */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;