// screens/Ride/RideComparisonScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import RideOptionCard from '../../components/ride/RideOptionCard';

const RideComparisonScreen = ({ navigation }) => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [rideOptions, setRideOptions] = useState([]);

  // Mock data - replace with actual API calls to Yango, Bykea etc.
  useEffect(() => {
    const mockData = [
      {
        id: '1',
        provider: 'Yango',
        price: '₨ 450',
        eta: '5 min',
        carType: 'Economy',
        logo: require('../../assets/images/yango.png'),
      },
      // ... other providers
    ];
    setRideOptions(mockData);
  }, []);

  const handleSelectRide = (provider) => {
    // Redirect to provider app or show booking details
    Linking.openURL(`${provider}://book?pickup=${pickup}&destination=${destination}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="my-location" size={24} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Enter pickup location"
          value={pickup}
          onChangeText={setPickup}
        />
      </View>
      
      <View style={styles.searchContainer}>
        <MaterialIcons name="location-on" size={24} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={destination}
          onChangeText={setDestination}
        />
      </View>

      <FlatList
        data={rideOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RideOptionCard 
            option={item} 
            onPress={() => handleSelectRide(item.provider)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
});

export default RideComparisonScreen;