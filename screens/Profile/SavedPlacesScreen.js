import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const SavedPlacesScreen = ({ navigation }) => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    pickup: '',
    destination: '',
    name: ''
  });

  // Load saved locations from storage (you'll need to implement AsyncStorage)
  useEffect(() => {
    // Example: Load from AsyncStorage
    // const loadLocations = async () => {
    //   const saved = await AsyncStorage.getItem('savedLocations');
    //   if (saved) setSavedLocations(JSON.parse(saved));
    // };
    // loadLocations();
    
    // Mock data for demonstration
    setSavedLocations([
      { id: '1', name: 'Home', pickup: 'House 123, Street 45', destination: 'Office Tower, Downtown' },
      { id: '2', name: 'Weekly Shopping', pickup: 'My Apartment', destination: 'Mega Mall' }
    ]);
  }, []);

  const handleSaveLocation = () => {
    if (!currentLocation.name) {
      Alert.alert('Error', 'Please give this location pair a name');
      return;
    }

    const newLocation = {
      id: Date.now().toString(),
      ...currentLocation
    };

    setSavedLocations([...savedLocations, newLocation]);
    // Save to AsyncStorage
    // AsyncStorage.setItem('savedLocations', JSON.stringify([...savedLocations, newLocation]));
    setShowSaveModal(false);
    setCurrentLocation({ pickup: '', destination: '', name: '' });
  };

  const handleUseLocation = (location) => {
    navigation.navigate('RideComparison', {
      savedPickup: location.pickup,
      savedDestination: location.destination
    });
  };

  return (
    <View style={styles.container}>
      
      {/* Saved Locations List */}
      <ScrollView style={styles.content}>
        {savedLocations.length > 0 ? (
          savedLocations.map((location) => (
            <TouchableOpacity 
              key={location.id} 
              style={styles.locationCard}
              onPress={() => handleUseLocation(location)}
            >
              <FontAwesome name="bookmark" size={20} color="#FF8C00" />
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locationText}>From: {location.pickup}</Text>
                <Text style={styles.locationText}>To: {location.destination}</Text>
              </View>
              <MaterialIcons name="directions" size={24} color="#FF8C00" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No saved locations yet</Text>
        )}
      </ScrollView>

      {/* Save Location Modal */}
      <Modal visible={showSaveModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save This Location</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Name this location (e.g. Home to Work)"
              value={currentLocation.name}
              onChangeText={(text) => setCurrentLocation({...currentLocation, name: text})}
            />
            
            <View style={styles.locationPreview}>
              <Text style={styles.previewText}>From: {currentLocation.pickup}</Text>
              <Text style={styles.previewText}>To: {currentLocation.destination}</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowSaveModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveLocation}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Add this to your RideComparisonScreen.js to trigger the save modal:
/*
const [showSaveModal, setShowSaveModal] = useState(false);

// After setting pickup/destination locations
const handleSavePrompt = () => {
  setShowSaveModal(true);
  navigation.navigate('SavedPlaces', { 
    pickup: pickup, 
    destination: destination 
  });
};

// In your JSX where you want to trigger the save
<Button title="Save This Route" onPress={handleSavePrompt} />
*/

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
  content: {
    flex: 1,
    padding: 16,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  locationPreview: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  previewText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#FF8C00',
    marginLeft: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default SavedPlacesScreen;