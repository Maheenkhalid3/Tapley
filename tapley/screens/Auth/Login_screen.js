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
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = () => {
    navigation.navigate('RideComparison');
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
        {/* Logo with optimized size and alignment */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/icons/L.png')}
            style={styles.logo}
          />
        </View>

        {/* Auth Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
            />
          </View>

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.authButton}
            onPress={handleAuth}
            activeOpacity={0.8}
          >
            <Text style={styles.authButtonText}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Text>
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
              activeOpacity={0.7}
            >
              <Image 
                source={require('../../assets/icons/googlelogo.png')} 
                style={styles.googleIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
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
    width: width * 0.3, // Adjusted for better alignment
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
    width: 120, // Fixed width for perfect centering
    textAlign: 'center', // Center text within its container
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen;
