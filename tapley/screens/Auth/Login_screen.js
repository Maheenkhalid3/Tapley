import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  // Form state
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const API_URL = 'http://192.168.1.102:3000';

  const handleAuth = async () => {
    if (isLogin) {
      // Login logic
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        
        if (response.ok) {
          // Save user data to AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            phoneNumber: data.user.phoneNumber,
            // Include any other user data from your backend
          }));
          
          // Navigate to Home which contains the Drawer Navigator
          navigation.navigate('Home');
        } else {
          Alert.alert('Error', data.error || 'Login failed');
        }
      } catch (error) {
        Alert.alert('Error', 'Cannot connect to server');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Signup logic
      if (!signupEmail || !signupPassword || !confirmPassword || !phoneNumber || !firstName) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }
      
      if (signupPassword !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: signupEmail,
            password: signupPassword,
            phoneNumber,
            firstName,
            lastName 
          }),
        });
        const data = await response.json();
        if (response.ok) {
          // Save user data to AsyncStorage after registration
          await AsyncStorage.setItem('user', JSON.stringify({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            phoneNumber: data.user.phoneNumber,
          }));
          
          Alert.alert('Success', 'Account created successfully!');
          setIsLogin(true); // Switch back to login
        } else {
          Alert.alert('Error', data.error || 'Registration failed');
        }
      } catch (error) {
        Alert.alert('Error', 'Cannot connect to server');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/icons/L.png')}
            style={styles.logo}
          />
        </View>

        {/* Auth Form */}
        <View style={styles.formContainer}>
          {isLogin ? (
            /* LOGIN FORM */
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity 
                style={styles.forgotPassword}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </>
          ) : (
            /* SIGNUP FORM */
            <>
              <View style={{ flexDirection: 'row' }}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name*"
                    placeholderTextColor="#999"
                    value={firstName}
                    onChangeText={setFirstName}
                    editable={!isLoading}
                  />
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#999"
                    value={lastName}
                    onChangeText={setLastName}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email*"
                  placeholderTextColor="#999"
                  value={signupEmail}
                  onChangeText={setSignupEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number*"
                  placeholderTextColor="#999"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password*"
                  placeholderTextColor="#999"
                  value={signupPassword}
                  onChangeText={setSignupPassword}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password*"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>
            </>
          )}

          {/* Auth Button */}
          <TouchableOpacity 
            style={[styles.authButton, isLoading && { opacity: 0.7 }]}
            onPress={handleAuth}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.authButtonText}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={styles.socialButton}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Image 
                source={require('../../assets/icons/googlelogo.png')} 
                style={styles.googleIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Image 
                source={require('../../assets/icons/f.png')} 
                style={styles.facebookIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Switch Auth Mode */}
        <TouchableOpacity 
          style={styles.switchContainer}
          onPress={() => setIsLogin(!isLogin)}
          disabled={isLoading}
          activeOpacity={0.6}
        >
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Text style={styles.switchButtonText}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: 'contain',
    borderRadius: 20,
    backgroundColor: '#FF8C00',
    padding: 15,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#FFE5CC',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: '600',
  },
  authButton: {
    backgroundColor: '#FF8C00',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  authButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    backgroundColor: '#FFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE5CC',
  },
  googleIcon: {
    width: 28,
    height: 28,
  },
  facebookIcon: {
    width: 28,
    height: 28,
  },
  switchContainer: {
    marginTop: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  switchText: {
    color: '#666',
    fontSize: 14,
  },
  switchButtonText: {
    color: '#FF8C00',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  dividerText: {
    width: 120,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  }
});

export default LoginScreen;