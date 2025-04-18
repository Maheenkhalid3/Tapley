import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Keyboard,
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

    // Fetch location suggestions from Nominatim API
    const fetchSuggestions = async (query, type) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
                {
                    headers: {
                        'User-Agent': 'Your-App-Name' // Required by Nominatim usage policy
                    }
                }
            );

            const suggestions = response.data.map((item, index) => ({
                id: index.toString(),
                name: item.display_name,
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
            }));

            if (type === 'pickup') {
                setPickupSuggestions(suggestions);
            } else {
                setDestinationSuggestions(suggestions);
            }
        } catch (error) {
            console.error('Error fetching location:', error);
        }
    };

    const handleInputChange = (text, type) => {
        if (type === 'pickup') {
            setPickup(text);
            setActiveInput('pickup');
            if (text.length > 2) {
                fetchSuggestions(text, 'pickup');
            } else {
                setPickupSuggestions([]);
            }
        } else {
            setDestination(text);
            setActiveInput('destination');
            if (text.length > 2) {
                fetchSuggestions(text, 'destination');
            } else {
                setDestinationSuggestions([]);
            }
        }
    };

    const handleSelectLocation = (item, type) => {
        if (type === 'pickup') {
            setPickup(item.name);
            setMarkers({ ...markers, pickup: item });
            setPickupSuggestions([]);
        } else {
            setDestination(item.name);
            setMarkers({ ...markers, destination: item });
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
    };

    const renderSuggestionItem = ({ item }, type) => (
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
    );

    return (
        <View style={styles.container}>
            {/* Input Fields */}
            <View style={styles.inputContainer}>
                <View style={styles.inputField}>
                    <MaterialIcons name="my-location" size={20} color="#FF8C00" />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter pickup location"
                        placeholderTextColor="#aaa"
                        value={pickup}
                        onChangeText={(text) => handleInputChange(text, 'pickup')}
                    />
                </View>
                <View style={styles.inputField}>
                    <MaterialIcons name="location-on" size={20} color="#FF8C00" />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter destination"
                        placeholderTextColor="#aaa"
                        value={destination}
                        onChangeText={(text) => handleInputChange(text, 'destination')}
                    />
                </View>
            </View>

            {/* Suggestions List */}
            {activeInput &&
                (activeInput === 'pickup' ? pickupSuggestions : destinationSuggestions)
                    .length > 0 && (
                    <FlatList
                        style={styles.suggestionsContainer}
                        data={
                            activeInput === 'pickup'
                                ? pickupSuggestions
                                : destinationSuggestions
                        }
                        renderItem={(item) => renderSuggestionItem(item, activeInput)}
                        keyExtractor={(item) => item.id}
                    />
                )}

            {/* Map */}
            <MapView
                ref={mapRef}
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                showsUserLocation={true}
                showsCompass={true} // Re-enabled the default compass
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    inputContainer: {
        padding: 10,
        backgroundColor: '#fff',
        elevation: 2,
        zIndex: 10,
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
        fontSize: 14,
        color: '#333',
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
        zIndex: 20,
        borderRadius: 8,
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
    },
    suggestionText: {
        fontSize: 14,
        color: '#333',
    },
    suggestionSubtext: {
        fontSize: 12,
        color: '#888',
    },
});

export default MapScreen;