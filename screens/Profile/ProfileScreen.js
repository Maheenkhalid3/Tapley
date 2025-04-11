import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext } from '@context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [updating, setUpdating] = useState(false);
  const { colors } = useContext(ThemeContext);

  const API_URL = 'http://192.168.1.101:3000';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUser(parsedData);
          setEditedUser(parsedData);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile data');
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need camera roll permissions to upload images');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        const imageUri = result.assets[0].uri;
        const updatedUser = {...user, profileImage: imageUri};
        setUser(updatedUser);
        setEditedUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        await updateProfilePicture(imageUri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Image picker error:', error);
    }
  };

  const updateProfilePicture = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append('profileImage', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg'
      });

      const response = await fetch(`${API_URL}/update-profile-picture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update profile picture');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error('Profile picture update error:', error);
      throw error;
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!editedUser.firstName?.trim() || !editedUser.email?.trim() || !editedUser.phoneNumber?.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
  
    setUpdating(true);
    try {
      const response = await fetch(`${API_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          firstName: editedUser.firstName,
          lastName: editedUser.lastName,
          email: editedUser.email,
          phoneNumber: editedUser.phoneNumber
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
  
      const responseData = await response.json();
      const updatedUser = { ...editedUser, ...responseData };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Profile update failed:', error);
      Alert.alert('Update Failed', error.message || 'Could not connect to server');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No user data found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.profileImageContainer}>
              {user.profileImage ? (
                <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
              ) : (
                <View style={[styles.profileImagePlaceholder, { borderColor: colors.primary }]}>
                  <Icon name="person" size={60} color={colors.primary} />
                </View>
              )}
              <View style={[styles.editIcon, { backgroundColor: colors.primary }]}>
                <Icon name="edit" size={20} color="#FFF" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={[styles.profileName, { color: colors.text }]}>
            {user.firstName} {user.lastName}
          </Text>
        </View>

        <View style={[styles.detailsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>First Name*</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.primary
                }]}
                value={editedUser.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
                placeholder="Enter first name"
                placeholderTextColor={colors.placeholder}
              />
            ) : (
              <View style={[styles.detailValueContainer, { borderColor: colors.border }]}>
                <Text style={[styles.detailValue, { color: colors.text }]}>{user.firstName}</Text>
              </View>
            )}
          </View>

          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Last Name</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.primary
                }]}
                value={editedUser.lastName || ''}
                onChangeText={(text) => handleInputChange('lastName', text)}
                placeholder="Enter last name"
                placeholderTextColor={colors.placeholder}
              />
            ) : (
              <View style={[styles.detailValueContainer, { borderColor: colors.border }]}>
                <Text style={[styles.detailValue, { color: colors.text }]}>{user.lastName || ''}</Text>
              </View>
            )}
          </View>

          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Email*</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.primary
                }]}
                value={editedUser.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                placeholder="Enter email"
                placeholderTextColor={colors.placeholder}
              />
            ) : (
              <View style={[styles.detailValueContainer, { borderColor: colors.border }]}>
                <Text style={[styles.detailValue, { color: colors.text }]}>{user.email}</Text>
              </View>
            )}
          </View>

          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Phone Number*</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.primary
                }]}
                value={editedUser.phoneNumber}
                onChangeText={(text) => handleInputChange('phoneNumber', text)}
                keyboardType="phone-pad"
                placeholder="Enter phone number"
                placeholderTextColor={colors.placeholder}
              />
            ) : (
              <View style={[styles.detailValueContainer, { borderColor: colors.border }]}>
                <Text style={[styles.detailValue, { color: colors.text }]}>{user.phoneNumber}</Text>
              </View>
            )}
          </View>

          {isEditing ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.editButton, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  setEditedUser(user);
                }}
                disabled={updating}
              >
                <Text style={styles.editButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.editButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: colors.primary }]}
              onPress={handleEditToggle}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  detailsContainer: {
    flex: 1,
    borderRadius: 8,
    padding: 20,
    marginHorizontal: 16,
    elevation: 2,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '600',
  },
  detailValueContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  detailValue: {
    fontSize: 16,
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  editButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#999',
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProfileScreen;