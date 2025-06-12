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
  KeyboardAvoidingView
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const RideComparisonScreen = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [currentLocation] = useState({
    latitude: 33.6844,
    longitude: 73.0479,
    city: 'Rawalpindi'
  });
  const [priceEstimate, setPriceEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Yango API credentials
  const CLID = 'ak240927';
  const APIKEY = 'jYfnzTHjIXAqMxXRNxnWlzBdowxyZgoLWp';

  const mapRef = useRef(null);
  const pickupInputRef = useRef(null);
  const destinationInputRef = useRef(null);

  const rideOptions = [
    { id: 1, name: 'Bike', icon: 'motorcycle', type: 'bike' },
    { id: 3, name: 'Ride Mini', icon: 'car', type: 'mini' },
    { id: 4, name: 'Ride AC', icon: 'car', type: 'ac' },
  ];

  const menuItems = [
    { name: 'Profile', icon: 'person', screen: 'Profile' },
    { name: 'Help & Support', icon: 'help', screen: 'HelpSupport' },
    { name: 'Privacy Policy', icon: 'privacy-tip', screen: 'PrivacyPolicy' },
    { name: 'Saved Places', icon: 'bookmark', screen: 'SavedPlaces' },
    { name: 'Rate Us', icon: 'star', screen: 'Rating' },
    { name: 'Settings', icon: 'settings', screen: 'Settings' },
  ];

  // Mock prices for fallback
  const mockPrices = {
    bike: { amount: 150, currency: 'PKR' },
    mini: { amount: 300, currency: 'PKR' },
    ac: { amount: 450, currency: 'PKR' },
  };

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

// Updated fetchSuggestions with proper error handling
  const fetchSuggestions = useCallback(async (query, type) => {
    if (query.length < 3) {
      type === 'pickup' ? setPickupSuggestions([]) : setDestinationSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}+${currentLocation.city}`,
        {
          headers: { 
            'User-Agent': 'Tapley-Ride-App/1.0 (com.yourcompany.tapley; contact@yourcompany.com)',
            'Accept-Language': 'en-US,en;q=0.9'
          },
          timeout: 5000
        }
      );

      const suggestions = response.data.map((item, index) => ({
        id: index.toString(),
        name: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        isLocal: item.display_name.includes(currentLocation.city)
      }));

      suggestions.sort((a, b) => (b.isLocal - a.isLocal));

      type === 'pickup' 
        ? setPickupSuggestions(suggestions.slice(0, 5))
        : setDestinationSuggestions(suggestions.slice(0, 5));
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      Alert.alert(
        'Connection Error',
        'Could not fetch location suggestions. Please check your internet connection.',
        [{ text: 'OK' }]
      );
      type === 'pickup' ? setPickupSuggestions([]) : setDestinationSuggestions([]);
    }
  }, [currentLocation.city]);

  // Updated fetchPriceEstimate with proper Yango API implementation
  const fetchPriceEstimate = useCallback(async () => {
    if (!pickupCoords || !destinationCoords || !selectedRide) return;

    setLoading(true);
    setApiError(null);
    const selectedRideType = rideOptions.find(r => r.id === selectedRide)?.type;

    try {
      // First try the Yango API
      const response = await axios.get('https://yango.taxi.yandex.net/api/estimate', {
        headers: {
          'CLID': CLID,
          'APIKEY': APIKEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Tapley-Ride-App/1.0'
        },
        params: {
          pickup_lat: pickupCoords.latitude,
          pickup_lon: pickupCoords.longitude,
          dropoff_lat: destinationCoords.latitude,
          dropoff_lon: destinationCoords.longitude,
          vehicle_type: selectedRideType,
        },
        timeout: 8000
      });

      if (response.data?.price) {
        setPriceEstimate(response.data.price);
      } else {
        console.warn("Unexpected API response format, using mock data");
        setPriceEstimate(mockPrices[selectedRideType]);
      }
    } catch (error) {
      console.error("API request failed:", error);
      
      // Fallback to taxi.yandex.net API if first attempt fails
      try {
        const fallbackResponse = await axios.get(
          'https://taxi-routeinfo.taxi.yandex.net/taxi_info',
          {
            headers: {
              'YaTaxi-Api-Key': APIKEY,
              'Accept': 'application/json',
              'User-Agent': 'Tapley-Ride-App/1.0'
            },
            params: {
              clid: CLID,
              rll: `${pickupCoords.longitude},${pickupCoords.latitude}~${destinationCoords.longitude},${destinationCoords.latitude}`,
              class: selectedRideType,
            },
            timeout: 5000
          }
        );
        
        if (fallbackResponse.data?.price) {
          setPriceEstimate(fallbackResponse.data.price);
        } else {
          throw new Error("Fallback API also failed");
        }
      } catch (fallbackError) {
        console.error("Fallback API also failed:", fallbackError);
        setApiError('Failed to get live prices. Showing approximate pricing.');
        setPriceEstimate(mockPrices[selectedRideType]);
      }
    } finally {
      setLoading(false);
      setShowPriceModal(true);
    }
  }, [pickupCoords, destinationCoords, selectedRide]);



  // const fetchPriceEstimate = useCallback(async () => {
  //   if (!pickupCoords || !destinationCoords || !selectedRide) return;

  //   setLoading(true);
  //   setApiError(null);
  //   const selectedRideType = rideOptions.find(r => r.id === selectedRide)?.type;

  //   try {
  //     // Create custom axios instance with specific headers
  //     const taxiAxios = axios.create({
  //       baseURL: 'https://api.yango.yandex.com',
  //       headers: {
  //         'CLID': CLID,
  //         'APIKEY': APIKEY,
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //         'User-Agent': 'Tapley-Ride-App/1.0'
  //       },
  //       timeout: 8000
  //     });

  //     const response = await taxiAxios.get('/api/estimate', {
  //       params: {
  //         pickup_lat: pickupCoords.latitude,
  //         pickup_lon: pickupCoords.longitude,
  //         dropoff_lat: destinationCoords.latitude,
  //         dropoff_lon: destinationCoords.longitude,
  //         vehicle_type: selectedRideType,
  //       }
  //     });

  //     if (response.data?.price) {
  //       setPriceEstimate(response.data.price);
  //     } else {
  //       console.warn("Unexpected API response format, using mock data");
  //       setPriceEstimate(mockPrices[selectedRideType]);
  //     }
  //   } catch (error) {
  //     console.error("API request failed:", error);
  //     setApiError('Failed to get price estimate. Using approximate pricing.');
  //     setPriceEstimate(mockPrices[selectedRideType]);
  //   } finally {
  //     setLoading(false);
  //     setShowPriceModal(true);
  //   }
  // }, [pickupCoords, destinationCoords, selectedRide]);

  // const clearLocation = useCallback((type) => {
  //   if (type === 'pickup') {
  //     setPickup('');
  //     setPickupCoords(null);
  //     setPickupSuggestions([]);
  //   } else {
  //     setDestination('');
  //     setDestinationCoords(null);
  //     setDestinationSuggestions([]);
  //   }
  //   setPriceEstimate(null);
  //   setApiError(null);
  // }, []);

  // const fetchSuggestions = useCallback(async (query, type) => {
  //   if (query.length < 3) {
  //     if (type === 'pickup') {
  //       setPickupSuggestions([]);
  //     } else {
  //       setDestinationSuggestions([]);
  //     }
  //     return;
  //   }

  //   try {
  //     const response = await axios.get(
  //       `https://nominatim.openstreetmap.org/search?format=json&q=${query}+${currentLocation.city}`,
  //       {
  //         headers: { 'User-Agent': 'Tapley-Ride-App' },
  //         timeout: 5000
  //       }
  //     );

  //     const suggestions = response.data.map((item, index) => ({
  //       id: index.toString(),
  //       name: item.display_name,
  //       latitude: parseFloat(item.lat),
  //       longitude: parseFloat(item.lon),
  //       isLocal: item.display_name.includes(currentLocation.city)
  //     }));

  //     suggestions.sort((a, b) => (b.isLocal - a.isLocal));

  //     if (type === 'pickup') {
  //       setPickupSuggestions(suggestions.slice(0, 5));
  //     } else {
  //       setDestinationSuggestions(suggestions.slice(0, 5));
  //     }
  //   } catch (error) {
  //     console.error('Error fetching location suggestions:', error);
  //     if (type === 'pickup') {
  //       setPickupSuggestions([]);
  //     } else {
  //       setDestinationSuggestions([]);
  //     }
  //   }
  // }, [currentLocation.city]);

  const handleInputChange = useCallback((text, type) => {
    if (type === 'pickup') {
      setPickup(text);
      setActiveInput('pickup');
      fetchSuggestions(text, 'pickup');
    } else {
      setDestination(text);
      setActiveInput('destination');
      fetchSuggestions(text, 'destination');
    }
    setPriceEstimate(null);
    setApiError(null);
  }, [fetchSuggestions]);

  const handleSelectLocation = useCallback((item, type) => {
    if (type === 'pickup') {
      setPickup(item.name);
      setPickupCoords({
        latitude: item.latitude,
        longitude: item.longitude
      });
      setPickupSuggestions([]);
    } else {
      setDestination(item.name);
      setDestinationCoords({
        latitude: item.latitude,
        longitude: item.longitude
      });
      setDestinationSuggestions([]);
    }

    Keyboard.dismiss();
    
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: item.latitude,
          longitude: item.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, []);

  const renderSuggestionItem = useCallback(({ item }, type) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectLocation(item, type)}
    >
      <MaterialIcons
        name={type === 'pickup' ? 'my-location' : 'location-on'}
        size={20}
        color="#FF8C00"
      />
      <View style={styles.suggestionTextContainer}>
        <Text style={styles.suggestionText} numberOfLines={1}>
          {item.name.split(',')[0]}
        </Text>
        <Text style={styles.suggestionSubtext}>
          {item.name.split(',').slice(1).join(',').trim()}
        </Text>
      </View>
    </TouchableOpacity>
  ), [handleSelectLocation]);

  const getInitialRegion = useCallback(() => {
    if (pickupCoords && destinationCoords) {
      return {
        latitude: (pickupCoords.latitude + destinationCoords.latitude) / 2,
        longitude: (pickupCoords.longitude + destinationCoords.longitude) / 2,
        latitudeDelta: Math.abs(pickupCoords.latitude - destinationCoords.latitude) * 1.5,
        longitudeDelta: Math.abs(pickupCoords.longitude - destinationCoords.longitude) * 1.5,
      };
    }
    return {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }, [pickupCoords, destinationCoords, currentLocation]);

  const renderRideOptions = useCallback(() => (
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
  ), [selectedRide]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <MaterialIcons name="menu" size={28} color="#FF8C00" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Tapley</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={getInitialRegion()}
          region={getInitialRegion()}
          showsUserLocation={true}
          showsCompass={true}
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

      {/* Location Inputs */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="my-location" size={20} color="#FF8C00" />
          <TextInput
            ref={pickupInputRef}
            style={styles.input}
            placeholder="Enter pickup location"
            placeholderTextColor="#aaa"
            value={pickup}
            onChangeText={(text) => handleInputChange(text, 'pickup')}
            onFocus={() => setActiveInput('pickup')}
          />
          {pickup && (
            <TouchableOpacity onPress={() => clearLocation('pickup')}>
              <MaterialIcons name="close" size={20} color="#FF8C00" />
            </TouchableOpacity>
          )}
        </View>
        {activeInput === 'pickup' && pickupSuggestions.length > 0 && (
          <FlatList
            style={styles.suggestionsList}
            data={pickupSuggestions}
            renderItem={(item) => renderSuggestionItem(item, 'pickup')}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="always"
          />
        )}

        <View style={styles.inputWrapper}>
          <MaterialIcons name="location-on" size={20} color="#FF8C00" />
          <TextInput
            ref={destinationInputRef}
            style={styles.input}
            placeholder="Enter destination"
            placeholderTextColor="#aaa"
            value={destination}
            onChangeText={(text) => handleInputChange(text, 'destination')}
            onFocus={() => setActiveInput('destination')}
          />
          {destination && (
            <TouchableOpacity onPress={() => clearLocation('destination')}>
              <MaterialIcons name="close" size={20} color="#FF8C00" />
            </TouchableOpacity>
          )}
        </View>
        {activeInput === 'destination' && destinationSuggestions.length > 0 && (
          <FlatList
            style={styles.suggestionsList}
            data={destinationSuggestions}
            renderItem={(item) => renderSuggestionItem(item, 'destination')}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="always"
          />
        )}
      </View>

      {/* Ride Options */}
      {renderRideOptions()}

      {/* Price Comparison Button */}
      <TouchableOpacity 
        style={[
          styles.compareButton,
          (!pickup || !destination || !selectedRide) && styles.disabledButton
        ]}
        onPress={fetchPriceEstimate}
        disabled={!pickup || !destination || !selectedRide || loading}
      >
        <Text style={styles.compareButtonText}>
          {loading ? 'Calculating...' : 'Price Comparison'}
        </Text>
      </TouchableOpacity>

      {/* Price Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPriceModal}
        onRequestClose={() => setShowPriceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.priceModal}>
            <Text style={styles.priceModalTitle}>Price Estimate</Text>
            
            {apiError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{apiError}</Text>
              </View>
            )}
            
            <View style={styles.priceDetail}>
              <Text style={styles.priceLabel}>Ride Type:</Text>
              <Text style={styles.priceValue}>
                {rideOptions.find(r => r.id === selectedRide)?.name}
              </Text>
            </View>
            
            <View style={styles.priceDetail}>
              <Text style={styles.priceLabel}>Estimated Price:</Text>
              <Text style={styles.priceValue}>
                {priceEstimate?.amount} {priceEstimate?.currency}
              </Text>
            </View>
            
            <View style={styles.priceButtons}>
              <TouchableOpacity 
                style={styles.priceButton}
                onPress={() => setShowPriceModal(false)}
              >
                <Text style={styles.priceButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sidebar Menu */}
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
            
            <View style={styles.sidebarContent}>
              {menuItems.map((item, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    toggleSidebar();
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
  suggestionsList: {
    maxHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 5,
    elevation: 3,
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  rideOption: {
    width: width * 0.28,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceModal: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  priceModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C00',
    textAlign: 'center',
    marginBottom: 20,
  },
  priceDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  priceLabel: {
    fontSize: 16,
    color: '#555',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  priceButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  priceButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  priceButtonText: {
    color: 'white',
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
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default RideComparisonScreen;