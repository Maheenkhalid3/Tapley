// App.js (with conditional rendering)
import React from 'react';
import { View, Text, StyleSheet, StatusBar, Button } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [showNav, setShowNav] = React.useState(false);

  if (!showNav) {
    return (
      <View style={styles.container}>
        <Text>Bismillah First step towards FYP...</Text>
        <Button title="Continue" onPress={() => setShowNav(true)} />
        <StatusBar style="auto" />
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});