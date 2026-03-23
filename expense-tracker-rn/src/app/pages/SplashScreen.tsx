import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import LoginService from '../api/LoginService';

const SplashScreen = ({ navigation }) => {
  const loginService = new LoginService();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await loginService.isLoggedIn();
        navigation.replace(isLoggedIn ? 'Home' : 'Login');
      } catch (error) {
        console.error("Error during login check:", error);
        navigation.replace('Login');
      }
    };

    const timer = setTimeout(checkLoginStatus, 1500); // Optional: to show splash effect

    return () => clearTimeout(timer); // cleanup
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('/assets/logo.png')} // Update path if needed
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
