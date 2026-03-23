import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import CustomText from '../components/CustomText';
import CustomBox from '../components/CustomBox';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { Button } from '@/components/ui/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_BASE_URL } from '../config/config';

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const navigateToLoginScreen = async () => {
    setErrors({}); // clear old errors
    try {
      const response = await fetch(`${SERVER_BASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          username: userName
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
            else if (lower.includes('first name')) newErrors.firstName = msg;
            else if (lower.includes('last name')) newErrors.lastName = msg;
            else if (lower.includes('email')) newErrors.email = msg;
            else newErrors.general = msg;
          });

          setErrors(newErrors);
        } else {
          setErrors({ general: 'Signup failed. Try again.' });
        }
        return;
      }

      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.token);

      navigation.navigate('Home', { name: 'Home' });
    } catch (error) {
      setErrors({ general: 'Network error. Please try again later.' });
      console.error('Error during sign up:', error);
    }
  };

  const goToLoginWithoutValidation = () => {
    navigation.navigate('Login', { name: 'Login' });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.signupContainer}>
        <CustomBox style={signUpBox}>
          <CustomText style={styles.heading}>Sign Up</CustomText>

          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.textInput}
            placeholderTextColor="#888"
          />
          {errors.firstName && <CustomText style={styles.errorText}>{errors.firstName}</CustomText>}

          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.textInput}
            placeholderTextColor="#888"
          />
          {errors.lastName && <CustomText style={styles.errorText}>{errors.lastName}</CustomText>}

          <TextInput
            placeholder="User Name"
            value={userName}
            onChangeText={setUserName}
            style={styles.textInput}
            placeholderTextColor="#888"
          />
          {errors.username && <CustomText style={styles.errorText}>{errors.username}</CustomText>}

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.textInput}
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
          {errors.email && <CustomText style={styles.errorText}>{errors.email}</CustomText>}

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.textInput}
            placeholderTextColor="#888"
            secureTextEntry
          />
          {errors.passwDoeord && <CustomText style={styles.errorText}>{errors.password}</CustomText>}

          {errors.general && <CustomText style={styles.errorText}>{errors.general}</CustomText>}
        </CustomBox>

        <Button onPressIn={navigateToLoginScreen} style={styles.button}>
          <CustomBox style={buttonBox}>
            <CustomText style={{ textAlign: 'center' }}>Sign Up</CustomText>
          </CustomBox>
        </Button>

        <Button onPressIn={goToLoginWithoutValidation} style={styles.button}>
          <CustomBox style={buttonBox}>
            <CustomText style={{ textAlign: 'center' }}>Login</CustomText>
          </CustomBox>
        </Button>
      </View>
    </GestureHandlerRootView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  signupContainer: {
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

const signUpBox = {
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
