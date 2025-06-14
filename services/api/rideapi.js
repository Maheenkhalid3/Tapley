import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  Keyboard,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation }) => {
  // State variables
  const [pickup, setPickup] = useState('Getting your location...');
  const [destination, setDestination] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 33.6844,
    longitude: 73.0479,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [mapPickerVisible, setMapPickerVisible] = useState(false);
  const [mapPickerType, setMapPickerType] = useState(null);

  // API Configuration
  const API_CONFIG = {
    CLID: 'ak240927',
    APIKEY: 'jYfnzTHjIXAqMxXRNxnWlzBdowxyZgoLWp',
    ENDPOINTS: {
      PRICE_ESTIMATE: 'https://taxi-routeinfo.taxi.yandex.net/taxi_info',
      SUGGESTIONS: 'https://nominatim.openstreetmap.org/search',
      REVERSE_GEOCODE: 'https://nominatim.openstreetmap.org/reverse'
    },
    TIMEOUT: 8000
  };

  // Vehicle types
  const vehicleTypes = [
    { id: 'bike', name: 'Bike', description: 'Affordable two-wheeler', icon: 'motorcycle', class: 'econom' },
    { id: 'mini', name: 'Ride Mini', description: 'Compact car', icon: 'car', class: 'econom' },
    { id: 'ac', name: 'Ride AC', description: 'Air-conditioned sedan', icon: 'car', class: 'comfortplus' },
  ];

  // Format address to show properly (e.g., "Model Colony, RWP")
  const formatAddress = (address) => {
    if (!address) return null;
    // Remove country and postal code, keep the first two relevant parts
    const parts = address.split(',').map(part => part.trim());
    if (parts.length > 2) {
      // For addresses like "Model Colony, Rawalpindi, Pakistan" return "Model Colony, Rawalpindi"
      return `${parts[0]}, ${parts[1]}`;
    }
    return address;
  };

  // Get current location on component mount
  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        };
        setPickupCoords(coords);
        setCurrentRegion({
          ...coords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        const address = await reverseGeocode(coords.latitude, coords.longitude);
        setPickup(address || 'Current Location');
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getLocation();
  }, []);

  // Reverse geocode coordinates to get address in English
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await axios.get(API_CONFIG.ENDPOINTS.REVERSE_GEOCODE, {
        params: {
          format: 'json',
          lat: lat,
          lon: lon,
          zoom: 18,
          addressdetails: 1,
          'accept-language': 'en' // Force English results
        },
        headers: { 'User-Agent': 'Tapley-Ride-App/1.0' },
        timeout: API_CONFIG.TIMEOUT
      });
      return formatAddress(response.data.display_name);
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return null;
    }
  };

  // Fetch location suggestions in English
  const fetchSuggestions = useCallback(async (query, type) => {
    if (query.length < 3) {
      type === 'pickup' ? setPickupSuggestions([]) : setDestinationSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(API_CONFIG.ENDPOINTS.SUGGESTIONS, {
        params: {
          format: 'json',
          q: query,
          limit: 5,
          'accept-language': 'en' // Force English results
        },
        headers: { 'User-Agent': 'Tapley-Ride-App/1.0' },
        timeout: API_CONFIG.TIMEOUT
      });

      const suggestions = response.data.map((item, index) => ({
        id: index.toString(),
        name: formatAddress(item.display_name),
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }));

      type === 'pickup' 
        ? setPickupSuggestions(suggestions)
        : setDestinationSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, []);

  // Generate Bykea price with random variation (-15% to +15%)
  const generateBykeaPrice = (yangoPrice) => {
    const variation = (Math.random() * 0.3) - 0.15; // -15% to +15% variation
    return Math.max(50, Math.round(yangoPrice * (1 + variation))); // Minimum 50 PKR
  };

  // Fetch price estimates for both Yango and Bykea
  const fetchPriceComparison = useCallback(async () => {
    if (!pickupCoords || !destinationCoords || !selectedVehicle) return;

    setLoading(true);

    try {
      const params = {
        clid: API_CONFIG.CLID,
        rll: `${pickupCoords.longitude},${pickupCoords.latitude}~${destinationCoords.longitude},${destinationCoords.latitude}`,
        class: selectedVehicle.class
      };

      const response = await axios.get(API_CONFIG.ENDPOINTS.PRICE_ESTIMATE, {
        params,
        headers: {
          'YaTaxi-Api-Key': API_CONFIG.APIKEY,
          'Accept': 'application/json',
          'User-Agent': 'Tapley-Ride-App/1.0'
        },
        timeout: API_CONFIG.TIMEOUT
      });

      if (response.data?.options) {
        const option = response.data.options.find(opt => 
          opt.class_name === selectedVehicle.class
        ) || response.data.options[0];

        if (option) {
          const yangoPrice = option.price;
          const bykeaPrice = generateBykeaPrice(yangoPrice);
          
          navigation.navigate('PriceComparison', {
            yangoPrice: yangoPrice,
            bykeaPrice: bykeaPrice,
            currency: response.data.currency || 'PKR',
            distance: `${(response.data.distance / 1000).toFixed(1)} km`,
            time: response.data.time_text,
            vehicleType: selectedVehicle.name,
            pickup: pickup,
            destination: destination
          });
          return;
        }
      }
      throw new Error('No price options available');
    } catch (error) {
      console.error('Price estimation failed:', error);
    } finally {
      setLoading(false);
    }
  }, [pickupCoords, destinationCoords, selectedVehicle, pickup, destination]);

  // Handle location selection from map picker
  const handleMapLocationSelect = async (coordinate) => {
    try {
      const address = await reverseGeocode(coordinate.latitude, coordinate.longitude);
      
      if (mapPickerType === 'pickup') {
        setPickup(address || 'Selected Location');
        setPickupCoords(coordinate);
      } else {
        setDestination(address || 'Selected Location');
        setDestinationCoords(coordinate);
      }
      
      setMapPickerVisible(false);
    } catch (error) {
      console.error('Error handling map selection:', error);
    }
  };

  // Render the map picker modal
  const renderMapPicker = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={mapPickerVisible}
      onRequestClose={() => setMapPickerVisible(false)}
    >
      <View style={styles.fullScreenMapContainer}>
        <MapView
          style={styles.fullScreenMap}
          provider={PROVIDER_GOOGLE}
          initialRegion={currentRegion}
          onPress={(e) => handleMapLocationSelect(e.nativeEvent.coordinate)}
          showsUserLocation={true}
          showsCompass={true}
        >
          <Marker
            coordinate={currentRegion}
            title="Select Location"
            pinColor="#FF8C00"
          />
        </MapView>
        
        <View style={styles.mapPickerControls}>
          <TouchableOpacity
            style={styles.mapPickerButton}
            onPress={() => setMapPickerVisible(false)}
          >
            <Text style={styles.mapPickerButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <View style={styles.mapPickerMarkerContainer}>
            <MaterialIcons name="location-pin" size={40} color="#FF8C00" />
          </View>
        </View>
      </View>
    </Modal>
  );

  // Render input fields with map selection buttons
  const renderInputFields = () => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="my-location" size={20} color="#FF8C00" />
        <TextInput
          style={styles.input}
          placeholder="Pickup location"
          value={pickup}
          onChangeText={(text) => {
            setPickup(text);
            setActiveInput('pickup');
            fetchSuggestions(text, 'pickup');
          }}
          onFocus={() => setActiveInput('pickup')}
        />
        <TouchableOpacity 
          style={styles.mapSelectButton}
          onPress={() => {
            setMapPickerType('pickup');
            setMapPickerVisible(true);
            Keyboard.dismiss();
          }}
        >
          <MaterialIcons name="map" size={20} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <MaterialIcons name="location-on" size={20} color="#FF8C00" />
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={destination}
          onChangeText={(text) => {
            setDestination(text);
            setActiveInput('destination');
            fetchSuggestions(text, 'destination');
          }}
          onFocus={() => setActiveInput('destination')}
        />
        <TouchableOpacity 
          style={styles.mapSelectButton}
          onPress={() => {
            setMapPickerType('destination');
            setMapPickerVisible(true);
            Keyboard.dismiss();
          }}
        >
          <MaterialIcons name="map" size={20} color="#FF8C00" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render suggestion item
  const renderSuggestionItem = useCallback(({ item }, type) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => {
        if (type === 'pickup') {
          setPickup(item.name);
          setPickupCoords({
            latitude: item.latitude,
            longitude: item.longitude
          });
        } else {
          setDestination(item.name);
          setDestinationCoords({
            latitude: item.latitude,
            longitude: item.longitude
          });
        }
        setActiveInput(null);
        Keyboard.dismiss();
      }}
    >
      <MaterialIcons
        name={type === 'pickup' ? 'my-location' : 'location-on'}
        size={20}
        color="#FF8C00"
      />
      <View style={styles.suggestionTextContainer}>
        <Text style={styles.suggestionText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  ), []);

  // Render vehicle item
  const renderVehicleItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.vehicleItem,
        selectedVehicle?.id === item.id && styles.selectedVehicleItem
      ]}
      onPress={() => setSelectedVehicle(item)}
    >
      <MaterialIcons name={item.icon} size={24} color="#FF8C00" />
      <View style={styles.vehicleTextContainer}>
        <Text style={styles.vehicleName}>{item.name}</Text>
        <Text style={styles.vehicleDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  ), [selectedVehicle]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Input Fields with Map Selection */}
      {renderInputFields()}

      {/* Vehicle Selection Button */}
      <TouchableOpacity
        style={styles.vehicleButton}
        onPress={() => setShowVehicleModal(true)}
        disabled={!pickupCoords || !destinationCoords}
      >
        <Text style={styles.vehicleButtonText}>
          {selectedVehicle ? selectedVehicle.name : 'Select Vehicle Type'}
        </Text>
      </TouchableOpacity>

      {/* Suggestions List */}
      {activeInput && (
        <FlatList
          style={styles.suggestionsContainer}
          data={activeInput === 'pickup' ? pickupSuggestions : destinationSuggestions}
          renderItem={(item) => renderSuggestionItem(item, activeInput)}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="always"
        />
      )}

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={currentRegion}
        onRegionChangeComplete={setCurrentRegion}
        showsUserLocation={true}
      >
        {pickupCoords && (
          <Marker
            coordinate={pickupCoords}
            title="Pickup"
            pinColor="#FF8C00"
          />
        )}
        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            title="Destination"
            pinColor="#0000FF"
          />
        )}
      </MapView>

      {/* Vehicle Selection Modal */}
      <Modal
        visible={showVehicleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVehicleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Vehicle Type</Text>
            <FlatList
              data={vehicleTypes}
              renderItem={renderVehicleItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.vehicleList}
            />
            <TouchableOpacity
              style={[
                styles.compareButton,
                !selectedVehicle && styles.disabledButton
              ]}
              onPress={() => {
                setShowVehicleModal(false);
                fetchPriceComparison();
              }}
              disabled={!selectedVehicle}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.compareButtonText}>Compare Prices</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Map Picker Modal */}
      {renderMapPicker()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  mapSelectButton: {
    marginLeft: 8,
    padding: 5,
  },
  map: {
    flex: 1,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 110,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    maxHeight: 200,
    borderRadius: 8,
    elevation: 3,
    zIndex: 100,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionTextContainer: {
    marginLeft: 10,
  },
  suggestionText: {
    fontSize: 14,
  },
  vehicleButton: {
    backgroundColor: '#FF8C00',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  vehicleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  vehicleList: {
    paddingHorizontal: 10,
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedVehicleItem: {
    backgroundColor: '#FFF5E6',
  },
  vehicleTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vehicleDescription: {
    fontSize: 14,
    color: '#666',
  },
  compareButton: {
    backgroundColor: '#FF8C00',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  compareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullScreenMapContainer: {
    flex: 1,
  },
  fullScreenMap: {
    ...StyleSheet.absoluteFillObject,
  },
  mapPickerControls: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapPickerButton: {
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 5,
  },
  mapPickerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mapPickerMarkerContainer: {
    position: 'absolute',
    top: height / 2 - 40,
    left: width / 2 - 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;