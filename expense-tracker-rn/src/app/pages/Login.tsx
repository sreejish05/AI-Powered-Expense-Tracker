import { View, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomText from '../components/CustomText';
import CustomBox from '../components/CustomBox';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { Button } from "@/components/ui/button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginService from '../api/LoginService';
import { SERVER_BASE_URL } from '../config/config';

const Login = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(true);
  const [errors, setErrors] = useState({});

  const loginService = new LoginService();

  const refreshToken = async () => {
    
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await fetch(`${SERVER_BASE_URL}/auth/v1/refreshToken`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.token);
    }

    return response.ok;
  };

  const gotoHomePageWithLogin = async () => {
    setErrors({}); 
    try {
      const response = await fetch(`${SERVER_BASE_URL}/auth/v1/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          username: userName,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.errors)) {
          const newErrors = {};
          data.errors.forEach((msg) => {
            const lower = msg.toLowerCase();
            if (lower.includes('username')) newErrors.username = msg;
            else if (lower.includes('password')) newErrors.password = msg;
            else newErrors.general = msg;
          });
          setErrors(newErrors);
        } else {
          setErrors({ general: 'Login failed. Try again.' });
        }
        return;
      }

      await AsyncStorage.setItem('refreshToken', data.token);
      await AsyncStorage.setItem('accessToken', data.accessToken);
      navigation.navigate('Home', { name: 'Home' });
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
      console.error('Login error:', error);
    }
  };

  const gotoSignup = () => {
    navigation.navigate('SignUp', { name: 'SignUp' });
  };

  useEffect(() => {
    const handleLogin = async () => {
      const isLoggedIn = await loginService.isLoggedIn();
      setLoggedIn(isLoggedIn);
      if (isLoggedIn) {
        navigation.navigate('Home', { name: 'Home' });
      } else {
        const refreshed = await refreshToken();
        setLoggedIn(refreshed);
        if (refreshed) {
          navigation.navigate('Home', { name: 'Home' });
        }
      }
    };
    handleLogin();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.loginContainer}>
        <CustomBox style={loginBox}>
          <CustomText style={styles.heading}>Login</CustomText>

          <TextInput
            placeholder="User Name"
            value={userName}
            onChangeText={setUserName}
            style={styles.textInput}
            placeholderTextColor="#888"
          />
          {errors.username && <CustomText style={styles.errorText}>{errors.username}</CustomText>}

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.textInput}
            placeholderTextColor="#888"
            secureTextEntry
          />
          {errors.password && <CustomText style={styles.errorText}>{errors.password}</CustomText>}

          {errors.general && <CustomText style={styles.errorText}>{errors.general}</CustomText>}
        </CustomBox>

        <Button onPressIn={gotoHomePageWithLogin} style={styles.button}>
          <CustomBox style={buttonBox}>
            <CustomText style={{ textAlign: 'center' }}>Submit</CustomText>
          </CustomBox>
        </Button>

        <Button onPressIn={gotoSignup} style={styles.button}>
          <CustomBox style={buttonBox}>
            <CustomText style={{ textAlign: 'center' }}>Signup</CustomText>
          </CustomBox>
        </Button>
      </View>
    </GestureHandlerRootView>
  );
};

export default Login;

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    marginTop: 20,
    width: '30%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    color: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
    marginTop: -5,
  },
});

const loginBox = {
  mainBox: {
    backgroundColor: '#fff',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
  },
  shadowBox: {
    backgroundColor: 'gray',
    borderRadius: 10,
  },
};

const buttonBox = {
  mainBox: {
    backgroundColor: '#fff',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  shadowBox: {
    backgroundColor: 'gray',
    borderRadius: 10,
  },
};
