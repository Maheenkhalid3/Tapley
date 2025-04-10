import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  TextInput
} from 'react-native';
import MapView from 'react-native-maps';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const RideComparisonScreen = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);

  const rideOptions = [
    { id: 1, name: 'Bike', icon: 'motorcycle' },
    { id: 3, name: 'Ride Mini', icon: 'car' },
    { id: 4, name: 'Ride AC', icon: 'car' },
    { id: 5, name: 'Courier', icon: 'cube' },
    { id: 6, name: 'Cargo', icon: 'truck' },
  ];

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const handlePriceComparison = () => {
    navigation.navigate('PriceResults');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <MaterialIcons name="menu" size={28} color="#FF8C00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tapley</Text>
        <TouchableOpacity>
          <FontAwesome name="user-circle" size={28} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 33.6844,
            longitude: 73.0479,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="my-location" size={20} color="#FF8C00" />
          <TextInput
            style={styles.input}
            placeholder="Enter pickup location"
            value={pickup}
            onChangeText={setPickup}
          />
        </View>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="location-on" size={20} color="#FF8C00" />
          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            value={destination}
            onChangeText={setDestination}
          />
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.rideTypeContainer}
      >
        {rideOptions.map((ride) => (
          <TouchableOpacity
            key={ride.id}
            style={[
              styles.rideOption,
              selectedRide === ride.id && styles.selectedRideOption
            ]}
            onPress={() => setSelectedRide(ride.id)}
          >
            <FontAwesome 
              name={ride.icon} 
              size={24} 
              color={selectedRide === ride.id ? '#fff' : '#FF8C00'} 
            />
            <Text 
              style={[
                styles.rideOptionText,
                selectedRide === ride.id && styles.selectedRideText
              ]}
            >
              {ride.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.compareButton}
        onPress={handlePriceComparison}
      >
        <Text style={styles.compareButtonText}>Price Comparison</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={toggleSidebar}
      >
        <View style={styles.sidebarOverlay}>
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Menu</Text>
              <TouchableOpacity onPress={toggleSidebar}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.sidebarContent}>
              <TouchableOpacity style={styles.menuItem}>
                <MaterialIcons name="person" size={24} color="#FF8C00" />
                <Text style={styles.menuItemText}>Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
  style={styles.menuItem}
  onPress={() => {
    toggleSidebar();
    navigation.navigate('Help and Support', { fromSidebar: true }); // Pass parameter
  }}
>
  <MaterialIcons name="help" size={24} color="#FF8C00" />
  <Text style={styles.menuItemText}>Help & Support</Text>
</TouchableOpacity>

<TouchableOpacity 
  style={styles.menuItem}
  onPress={() => {
    toggleSidebar();
    navigation.navigate('PrivacyPolicy', { fromSidebar: true }); // Pass parameter
  }}
>
  <MaterialIcons name="privacy-tip" size={24} color="#FF8C00" />
  <Text style={styles.menuItemText}>Privacy Policy</Text>
</TouchableOpacity>
              
             
<TouchableOpacity 
  style={styles.menuItem}
  onPress={() => {
    toggleSidebar();
    navigation.navigate('SavedPlaces'); // Navigate to the SavedPlaces screen
  }}
>
  <MaterialIcons name="bookmark" size={24} color="#FF8C00" />
  <Text style={styles.menuItemText}>Saved Places</Text>
</TouchableOpacity>
              
<TouchableOpacity 
  style={styles.menuItem}
  onPress={() => {
    toggleSidebar();
    navigation.navigate('Rating'); // Navigate to the Rating screen
  }}
>
  <MaterialIcons name="star" size={24} color="#FF8C00" />
  <Text style={styles.menuItemText}>Rate Us</Text>
</TouchableOpacity>
              
<TouchableOpacity 
  style={styles.menuItem}
  onPress={() => {
    toggleSidebar();
    navigation.navigate('Settings');
  }}
>
  <MaterialIcons name="settings" size={24} color="#FF8C00" />
  <Text style={styles.menuItemText}>Settings</Text>
</TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  mapContainer: {
    height: height * 0.4,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  inputContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  rideTypeContainer: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  rideOption: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  selectedRideOption: {
    backgroundColor: '#FF8C00',
  },
  rideOptionText: {
    marginTop: 4,
    color: '#FF8C00',
    fontSize: 12,
  },
  selectedRideText: {
    color: '#fff',
  },
  compareButton: {
    backgroundColor: '#FF8C00',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  compareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  sidebar: {
    width: width * 0.7,
    height: '100%',
    backgroundColor: '#fff',
  },
  sidebarHeader: {
    backgroundColor: '#FF8C00',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sidebarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sidebarContent: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
});

export default RideComparisonScreen;