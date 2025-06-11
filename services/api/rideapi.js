import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Keyboard,
    Modal,
    Pressable,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const MapScreen = ({ navigation, route }) => {
    const mapRef = useRef(null);
    const [pickup, setPickup] = useState(route.params?.initialPickup || '');
    const [destination, setDestination] = useState(route.params?.initialDestination || '');
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [activeInput, setActiveInput] = useState(null);
    const [region, setRegion] = useState({
        latitude: 33.6844,
        longitude: 73.0479,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [markers, setMarkers] = useState({
        pickup: route.params?.pickupCoords || null,
        destination: route.params?.destinationCoords || null,
    });
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [priceEstimate, setPriceEstimate] = useState(null);
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Yango API credentials
    const CLID = 'ak240927';
    const APIKEY = 'jYfnzTHjIXAqMxXRNxnWlzBdowxyZgoLWp';

    // Vehicle types
    const vehicleTypes = [
        { id: 'bike', name: 'Bike', description: 'Affordable two-wheeler', icon: 'motorcycle' },
        { id: 'mini', name: 'Ride Mini', description: 'Compact car', icon: 'car' },
        { id: 'ac', name: 'Ride AC', description: 'Air-conditioned sedan', icon: 'car' },
    ];

    // Mock prices for fallback
    const mockPrices = {
        bike: { amount: 150, currency: 'PKR' },
        mini: { amount: 300, currency: 'PKR' },
        ac: { amount: 450, currency: 'PKR' },
    };


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
      const response = await axios.get('https://api.yango.yandex.com/api/estimate', {
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

//     // Memoized fetchPriceEstimate function
//     const fetchPriceEstimate = useCallback(async () => {
//         if (!markers.pickup || !markers.destination || !selectedVehicle) return;

//         setLoading(true);
//         console.log('Fetching price for:', selectedVehicle.name);

//        try {
//     // Correct API endpoint
//     const response = await axios.get(
//         'https://taxi-routeinfo.taxi.yandex.net/taxi_info', 
//         {
//             headers: {
//                 'YaTaxi-Api-Key': APIKEY,  // Correct header name for API authentication
//             },
//             params: {
//                 clid: CLID, // Client ID required
//                 rll: `${markers.pickup.longitude},${markers.pickup.latitude}~${markers.destination.longitude},${markers.destination.latitude}`, // Correct format for coordinates
//                 class: selectedVehicle.id, // Vehicle type (if applicable)
//             },
//             timeout: 5000
//         }
//     );

//     setPriceEstimate(response.data?.price || mockPrices[selectedVehicle.id]);
// } catch (error) {
//     console.warn('API failed, using mock data:', error);
//     setPriceEstimate(mockPrices[selectedVehicle.id]);
// } finally {
//     setLoading(false);
// }
//     }, [markers.pickup, markers.destination, selectedVehicle]);

//     // Memoized fetchSuggestions function
//     const fetchSuggestions = useCallback(async (query, type) => {
//         if (query.length < 3) {
//             type === 'pickup' ? setPickupSuggestions([]) : setDestinationSuggestions([]);
//             return;
//         }

//         try {
//             const response = await axios.get(
//                 `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
//                 { headers: { 'User-Agent': 'Your-App-Name' } }
//             );

//             const suggestions = response.data.map((item, index) => ({
//                 id: index.toString(),
//                 name: item.display_name,
//                 latitude: parseFloat(item.lat),
//                 longitude: parseFloat(item.lon),
//             }));

//             type === 'pickup' 
//                 ? setPickupSuggestions(suggestions) 
//                 : setDestinationSuggestions(suggestions);
//         } catch (error) {
//             console.error('Location search error:', error);
//         }
//     }, []);

//     // Update price when locations or vehicle changes
//     useEffect(() => {
//         if (markers.pickup && markers.destination && selectedVehicle) {
//             fetchPriceEstimate();
//         }
//     }, [markers.pickup, markers.destination, selectedVehicle, fetchPriceEstimate]);

    const handleSelectLocation = useCallback((item, type) => {
        const newMarkers = { ...markers };
        if (type === 'pickup') {
            setPickup(item.name);
            newMarkers.pickup = item;
        } else {
            setDestination(item.name);
            newMarkers.destination = item;
        }
        setMarkers(newMarkers);
        setActiveInput(null);
        Keyboard.dismiss();

        mapRef.current?.animateToRegion({
            latitude: item.latitude,
            longitude: item.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 1000);
    }, [markers]);

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
                <Text style={styles.suggestionText}>{item.name}</Text>
                <Text style={styles.suggestionSubtext}>Powered by OpenStreetMap</Text>
            </View>
        </TouchableOpacity>
    ), [handleSelectLocation]);

    const renderVehicleItem = useCallback(({ item }) => (
        <TouchableOpacity
            style={[
                styles.vehicleItem,
                selectedVehicle?.id === item.id && styles.selectedVehicleItem
            ]}
            onPress={() => {
                setSelectedVehicle(item);
                setShowVehicleModal(false);
            }}
        >
            <MaterialIcons name={item.icon} size={24} color="#FF8C00" />
            <View style={styles.vehicleTextContainer}>
                <Text style={styles.vehicleName}>{item.name}</Text>
                <Text style={styles.vehicleDescription}>{item.description}</Text>
            </View>
            {selectedVehicle?.id === item.id && priceEstimate && (
                <Text style={styles.vehiclePrice}>
                    {priceEstimate.amount} {priceEstimate.currency}
                </Text>
            )}
        </TouchableOpacity>
    ), [selectedVehicle, priceEstimate]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {/* Input Fields */}
            <View style={styles.inputContainer}>
                <View style={styles.inputField}>
                    <MaterialIcons name="my-location" size={20} color="#FF8C00" />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter pickup location"
                        value={pickup}
                        onChangeText={(text) => {
                            setPickup(text);
                            setActiveInput('pickup');
                            fetchSuggestions(text, 'pickup');
                        }}
                        onFocus={() => setActiveInput('pickup')}
                    />
                </View>
                <View style={styles.inputField}>
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
                </View>
            </View>

            {/* Vehicle Selection Button */}
            <TouchableOpacity
                style={styles.vehicleButton}
                onPress={() => setShowVehicleModal(true)}
                disabled={!markers.pickup || !markers.destination}
            >
                <Text style={styles.vehicleButtonText}>
                    {selectedVehicle ? selectedVehicle.name : 'Select Vehicle Type'}
                </Text>
                {loading ? (
                    <Text style={styles.vehicleButtonPrice}>Calculating...</Text>
                ) : (
                    priceEstimate && selectedVehicle && (
                        <Text style={styles.vehicleButtonPrice}>
                            {priceEstimate.amount} {priceEstimate.currency}
                        </Text>
                    )
                )}
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
                region={region}
                onRegionChangeComplete={setRegion}
                showsUserLocation={true}
            >
                {markers.pickup && (
                    <Marker
                        coordinate={{
                            latitude: markers.pickup.latitude,
                            longitude: markers.pickup.longitude,
                        }}
                        title="Pickup"
                        pinColor="#FF8C00"
                    />
                )}
                {markers.destination && (
                    <Marker
                        coordinate={{
                            latitude: markers.destination.latitude,
                            longitude: markers.destination.longitude,
                        }}
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
                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setShowVehicleModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    inputContainer: {
        padding: 10,
        backgroundColor: '#fff',
    },
    inputField: {
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
    suggestionSubtext: {
        fontSize: 12,
        color: '#888',
    },
    vehicleButton: {
        backgroundColor: '#FF8C00',
        padding: 15,
        margin: 10,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    vehicleButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    vehicleButtonPrice: {
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
    vehiclePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF8C00',
    },
    closeButton: {
        margin: 20,
        padding: 10,
        backgroundColor: '#FF8C00',
        borderRadius: 5,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default MapScreen;