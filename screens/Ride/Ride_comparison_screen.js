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
  Alert,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const PAKISTAN_REGION = {
  latitude: 30.3753,
  longitude: 69.3451,
  latitudeDelta: 8.0,
  longitudeDelta: 8.0
};

const RideComparisonScreen = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [pickup, setPickup] = useState('Getting your location...');
  const [destination, setDestination] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapPickerType, setMapPickerType] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(PAKISTAN_REGION);

  const mapRef = useRef(null);
  const pickupInputRef = useRef(null);
  const destinationInputRef = useRef(null);

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

  const rideOptions = [
    { id: 'bike', name: 'Bike', icon: 'motorcycle', class: 'econom', multiplier: 0.7 },
    { id: 'mini', name: 'Ride Mini', icon: 'car', class: 'econom', multiplier: 1.0 },
    { id: 'ac', name: 'Ride AC', icon: 'car', class: 'comfortplus', multiplier: 1.5 },
  ];

  const menuItems = [
    { name: 'Profile', icon: 'person', screen: 'Profile' },
    { name: 'Help & Support', icon: 'help', screen: 'HelpSupport' },
    { name: 'Privacy Policy', icon: 'privacy-tip', screen: 'PrivacyPolicy' },
    { name: 'Saved Places', icon: 'bookmark', screen: 'SavedPlaces' },
    { name: 'Rate Us', icon: 'star', screen: 'Rating' },
    { name: 'Settings', icon: 'settings', screen: 'Settings' },
  ];

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setApiError('Permission to access location was denied');
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
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });

        const address = await reverseGeocode(coords.latitude, coords.longitude);
        setPickup(address || 'Current Location');

        mapRef.current?.animateToRegion({
          ...coords,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);
      } catch (error) {
        console.error('Error getting location:', error);
        setApiError('Could not get your current location');
        mapRef.current?.animateToRegion(PAKISTAN_REGION, 1000);
      }
    };

    getLocation();
  }, []);

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await axios.get(API_CONFIG.ENDPOINTS.REVERSE_GEOCODE, {
        params: {
          format: 'json',
          lat: lat,
          lon: lon,
          zoom: 18,
          addressdetails: 1,
          'accept-language': 'en'
        },
        headers: { 'User-Agent': 'Tapley-Ride-App/1.0' },
        timeout: API_CONFIG.TIMEOUT
      });

      return response.data.display_name;
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return null;
    }
  };

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
          'accept-language': 'en'
        },
        headers: { 'User-Agent': 'Tapley-Ride-App/1.0' },
        timeout: API_CONFIG.TIMEOUT
      });

      const suggestions = response.data.map((item, index) => ({
        id: index.toString(),
        name: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }));

      type === 'pickup' 
        ? setPickupSuggestions(suggestions)
        : setDestinationSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      Alert.alert('Error', 'Could not fetch location suggestions');
    }
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  const fetchPriceEstimate = useCallback(async () => {
    if (!pickupCoords || !destinationCoords || !selectedRide) return;

    setLoading(true);
    setApiError(null);

    const selectedRideOption = rideOptions.find(r => r.id === selectedRide);
    if (!selectedRideOption) return;

    try {
      // First get the Ride Mini price as baseline
      const miniPrice = await fetchYangoPrice(
        pickupCoords,
        destinationCoords,
        'econom' // Force Ride Mini class
      );

      const distanceKm = calculateDistance(
        pickupCoords.latitude,
        pickupCoords.longitude,
        destinationCoords.latitude,
        destinationCoords.longitude
      );

      const timeMinutes = Math.round(10 + (distanceKm * 2));

      let yangoPrice, discountText;
      
      if (selectedRide === 'bike') {
        // For Bike option, calculate 40-50% discount from Ride Mini
        const discountPercentage = 40 + (Math.random() * 10); // Random between 40-50
        yangoPrice = Math.round(miniPrice * (1 - (discountPercentage/100)));
        discountText = `${Math.round(discountPercentage)}% cheaper than Ride Mini`;
      } else {
        // For other options, get normal price
        yangoPrice = await fetchYangoPrice(
          pickupCoords,
          destinationCoords,
          selectedRideOption.class
        );
        discountText = selectedRide === 'mini' ? 'Standard price' : 'Premium service';
      }

      navigation.navigate('PriceComparison', {
        yangoPrice: yangoPrice,
        bykeaPrice: Math.round(yangoPrice * 0.9), // Bykea is always 10% cheaper than Yango
        currency: 'PKR',
        distance: `${distanceKm.toFixed(1)} km`,
        time: `${timeMinutes} min`,
        vehicleType: selectedRideOption.name,
        pickup: pickup,
        destination: destination,
        discount: discountText
      });

    } catch (error) {
      console.error('Price estimation failed:', error);
      Alert.alert('Error', 'Could not get price estimate. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pickupCoords, destinationCoords, selectedRide, pickup, destination]);

  const fetchYangoPrice = async (start, end, rideClass) => {
    try {
      const params = {
        clid: API_CONFIG.CLID,
        apikey: API_CONFIG.APIKEY,
        rll: `${start.longitude},${start.latitude}~${end.longitude},${end.latitude}`,
        class: rideClass
      };

      const response = await axios.get(API_CONFIG.ENDPOINTS.PRICE_ESTIMATE, {
        params,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Tapley-Ride-App/1.0'
        },
        timeout: API_CONFIG.TIMEOUT
      });

      if (response.data?.options) {
        const option = response.data.options.find(opt => 
          opt.class_name === rideClass
        ) || response.data.options[0];

        if (option) {
          const distanceKm = calculateDistance(
            start.latitude,
            start.longitude,
            end.latitude,
            end.longitude
          );
          const minPrice = 50 + Math.round(distanceKm * 15);
          return Math.max(option.price, minPrice);
        }
      }
      throw new Error('No price options available');
    } catch (error) {
      console.error('Yango API error:', error);
      const distanceKm = calculateDistance(
        start.latitude,
        start.longitude,
        end.latitude,
        end.longitude
      );
      
      const selectedRideOption = rideOptions.find(r => r.class === rideClass);
      return 50 + Math.round(distanceKm * 15 * selectedRideOption.multiplier);
    }
  };

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
      
      setShowMapPicker(false);
    } catch (error) {
      console.error('Error handling map selection:', error);
      Alert.alert('Error', 'Could not get address for selected location');
    }
  };

  const renderMapPicker = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={showMapPicker}
      onRequestClose={() => setShowMapPicker(false)}
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
            onPress={() => setShowMapPicker(false)}
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

  const renderRideOptions = () => (
    <View style={styles.rideOptionsContainer}>
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
    </View>
  );

  const renderInputFields = () => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="my-location" size={20} color="#FF8C00" />
        <TextInput
          ref={pickupInputRef}
          style={styles.input}
          placeholder="Pickup location"
          placeholderTextColor="#aaa"
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
            setShowMapPicker(true);
            Keyboard.dismiss();
          }}
        >
          <MaterialIcons name="map" size={20} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <MaterialIcons name="location-on" size={20} color="#FF8C00" />
        <TextInput
          ref={destinationInputRef}
          style={styles.input}
          placeholder="Enter destination"
          placeholderTextColor="#aaa"
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
            setShowMapPicker(true);
            Keyboard.dismiss();
          }}
        >
          <MaterialIcons name="map" size={20} color="#FF8C00" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <Text style={styles.suggestionText}>{item.name.split(',')[0]}</Text>
        <Text style={styles.suggestionSubtext}>
          {item.name.split(',').slice(1).join(',').trim()}
        </Text>
      </View>
    </TouchableOpacity>
  ), []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <MaterialIcons name="menu" size={28} color="#FF8C00" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Tapley</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={PAKISTAN_REGION}
          region={currentRegion}
          showsUserLocation={true}
          showsCompass={true}
          minZoomLevel={9}
          maxZoomLevel={18}
        >
          {pickupCoords && (
            <Marker
              coordinate={pickupCoords}
              title="Pickup Location"
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
      </View>

      {renderInputFields()}

      {activeInput === 'pickup' && pickupSuggestions.length > 0 && (
        <FlatList
          style={styles.suggestionsList}
          data={pickupSuggestions}
          renderItem={(item) => renderSuggestionItem(item, 'pickup')}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="always"
        />
      )}

      {activeInput === 'destination' && destinationSuggestions.length > 0 && (
        <FlatList
          style={styles.suggestionsList}
          data={destinationSuggestions}
          renderItem={(item) => renderSuggestionItem(item, 'destination')}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="always"
        />
      )}

      {renderRideOptions()}

      <TouchableOpacity 
        style={[
          styles.compareButton,
          (!pickupCoords || !destinationCoords || !selectedRide) && styles.disabledButton
        ]}
        onPress={fetchPriceEstimate}
        disabled={!pickupCoords || !destinationCoords || !selectedRide || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.compareButtonText}>Price Comparison</Text>
        )}
      </TouchableOpacity>

      {renderMapPicker()}

      <Modal
        animationType="slide"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.sidebarOverlay}>
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setSidebarVisible(false)}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.sidebarContent}>
              {menuItems.map((item, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    setSidebarVisible(false);
                    navigation.navigate(item.screen);
                  }}
                >
                  <MaterialIcons 
                    name={item.icon} 
                    size={24} 
                    color="#FF8C00" 
                  />
                  <Text style={styles.menuItemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

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
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C00',
    textAlign: 'center',
  },
  mapContainer: {
    height: height * 0.35,
    marginBottom: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  inputContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
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
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  mapSelectButton: {
    marginLeft: 8,
    padding: 5,
  },
  suggestionsList: {
    maxHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 5,
    elevation: 3,
    marginHorizontal: 16,
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
    flex: 1,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  suggestionSubtext: {
    fontSize: 12,
    color: '#888',
  },
  rideOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  rideOption: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    width: '30%',
  },
  selectedRideOption: {
    backgroundColor: '#FF8C00',
  },
  rideOptionText: {
    marginTop: 5,
    color: '#FF8C00',
    fontSize: 12,
    textAlign: 'center',
  },
  selectedRideText: {
    color: '#fff',
  },
  compareButton: {
    backgroundColor: '#FF8C00',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowColor: '#000',
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
    flex: 1,
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

export default RideComparisonScreen;