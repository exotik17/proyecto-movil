import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../constants/colors';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = Appearance.getColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme !== null) {
                    setIsDarkMode(savedTheme === 'dark');
                }
            } catch (error) {
                console.error("Error loading theme preference", error);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        try {
            await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
        } catch (error) {
            console.error("Error saving theme preference", error);
        }
    };

    const colors = isDarkMode ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};
