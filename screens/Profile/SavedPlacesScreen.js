import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '@context/ThemeContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SavedPlacesScreen = ({ navigation }) => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    pickup: '',
    destination: '',
    name: ''
  });
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with orange background and white text */}
      <View style={[styles.header, { backgroundColor: '#FF8C00' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Places</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      {/* Saved Locations List */}
      <KeyboardAwareScrollView
        style={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
      >
        {savedLocations.length > 0 ? (
          savedLocations.map((location) => (
            <TouchableOpacity 
              key={location.id} 
              style={[styles.locationCard, { backgroundColor: colors.card }]}
              onPress={() => handleUseLocation(location)}
            >
              <FontAwesome name="bookmark" size={20} color="#FF8C00" />
              <View style={styles.locationInfo}>
                <Text style={[styles.locationName, { color: colors.text }]}>{location.name}</Text>
                <Text style={[styles.locationText, { color: colors.textSecondary }]}>From: {location.pickup}</Text>
                <Text style={[styles.locationText, { color: colors.textSecondary }]}>To: {location.destination}</Text>
              </View>
              <MaterialIcons name="directions" size={24} color="#FF8C00" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No saved locations yet</Text>
        )}
      </KeyboardAwareScrollView>

      {/* Save Location Modal */}
      <Modal visible={showSaveModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>Save This Location</Text>
            
            <TextInput
              style={[
                styles.input, 
                { 
                  borderColor: colors.border, 
                  color: colors.text,
                  backgroundColor: colors.inputBackground
                }
              ]}
              placeholder="Name this location (e.g. Home to Work)"
              placeholderTextColor={colors.textSecondary}
              value={currentLocation.name}
              onChangeText={(text) => setCurrentLocation({...currentLocation, name: text})}
            />
            
            <View style={[styles.locationPreview, { backgroundColor: colors.background }]}>
              <Text style={[styles.previewText, { color: colors.text }]}>From: {currentLocation.pickup}</Text>
              <Text style={[styles.previewText, { color: colors.text }]}>To: {currentLocation.destination}</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton, { backgroundColor: colors.buttonSecondary }]}
                onPress={() => setShowSaveModal(false)}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton, { backgroundColor: '#FF8C00' }]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    marginBottom: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  locationPreview: {
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  previewText: {
    fontSize: 14,
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
    marginRight: 10,
  },
  saveButton: {
    marginLeft: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default SavedPlacesScreen;