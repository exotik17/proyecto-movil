import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import AppProvider from './navigation/AppProvider';
import { ThemeProvider } from './src/context/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { initDB } from './src/services/sqliteService';

export default function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <AppProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator/>
          <StatusBar/>
        </NavigationContainer>
      </ThemeProvider>
    </AppProvider>
  );
}
