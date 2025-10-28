import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { COLORS } from '../src/constants/colors';
import { useAuthStore } from '../src/store/authStore';

export default function LoginScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const { login, loading } = useAuthStore();
  const router = useRouter();

  const validate = () => {
    const newErrors: any = {};
    if (!emailOrPhone) newErrors.emailOrPhone = 'Email or phone is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await login(emailOrPhone, password);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email or Phone"
            placeholder="Enter your email or phone number"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            autoCapitalize="none"
            icon="mail"
            error={errors.emailOrPhone}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed"
            error={errors.password}
          />

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <Button
            title="Create Account"
            onPress={() => router.push('/register')}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  form: {
    flex: 1,
  },
  loginButton: {
    marginBottom: 12,
  },
});
