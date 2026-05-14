import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut, auth } from "../services/firebaseService";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { colors, isDarkMode, toggleTheme } = useTheme();
    const styles = getStyles(colors);
    
    const [loading, setLoading] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const notifs = await AsyncStorage.getItem('notifications');
                if (notifs !== null) {
                    setNotificationsEnabled(notifs === 'true');
                }
            } catch (e) {
                console.error("Error loading settings", e);
            }
        };
        loadSettings();
    }, []);

    const toggleNotifications = async () => {
        const newValue = !notificationsEnabled;
        setNotificationsEnabled(newValue);
        try {
            await AsyncStorage.setItem('notifications', newValue.toString());
            if (newValue) {
                Alert.alert("Notificaciones", "Las notificaciones han sido activadas.");
            } else {
                Alert.alert("Notificaciones", "Las notificaciones han sido desactivadas.");
            }
        } catch (error) {
            console.error("Error saving notifications preference", error);
        }
    };

    const handleLogout = async() => {
        try {
           setLoading(true);
           await signOut(auth);
           Alert.alert("Sesión finalizada", "Has cerrado sesión correctamente",[
            {text: "OK", onPress: () => navigation.reset({index:0, routes: [{name:"Login"}]})}
           ]);
        } catch (error) {
            console.log("Error al cerrar sesión: ", error);
            Alert.alert("Error al cerrar sesión", "Intenta de nuevo más tarde");
        } finally {
            setLoading(false);
        }
    };

    const SettingOption = ({ icon, title, onPress, value, type = 'chevron' }) => (
        <TouchableOpacity style={styles.optionRow} onPress={onPress} disabled={type === 'switch' && !onPress}>
            <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={22} color={colors.variante2} />
                </View>
                <Text style={styles.optionTitle}>{title}</Text>
            </View>
            {type === 'switch' ? (
                <Switch 
                    value={value} 
                    onValueChange={onPress} 
                    trackColor={{ false: colors.subtitilo, true: colors.variante2 }}
                    thumbColor={colors.iluminado}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.subtitilo} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Configuración</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <Text style={styles.sectionHeader}>Preferencias</Text>
                <View style={styles.card}>
                    <SettingOption 
                        icon="notifications-outline" 
                        title="Notificaciones" 
                        type="switch" 
                        value={notificationsEnabled} 
                        onPress={toggleNotifications} 
                    />
                    <View style={styles.divider} />
                    <SettingOption icon="volume-high-outline" title="Sonidos de alarma" />
                    <View style={styles.divider} />
                    <SettingOption 
                        icon="moon-outline" 
                        title="Modo Oscuro" 
                        type="switch" 
                        value={isDarkMode} 
                        onPress={toggleTheme} 
                    />
                </View>


                <Text style={styles.sectionHeader}>Cuenta</Text>
                <View style={styles.card}>
                    <SettingOption icon="lock-closed-outline" title="Cambiar Contraseña" />
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.optionRow} onPress={handleLogout} disabled={loading}>
                        <View style={styles.optionLeft}>
                            <View style={[styles.iconContainer, {backgroundColor: 'rgba(220, 38, 38, 0.1)'}]}>
                                <Ionicons name="log-out-outline" size={22} color={colors.alerta} />
                            </View>
                            <Text style={[styles.optionTitle, {color: colors.alerta, fontWeight: 'bold'}]}>
                                Cerrar Sesión
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
};

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.principal,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.iluminado,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.oscuro,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.subtitilo,
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 15,
        marginLeft: 10,
    },
    card: {
        backgroundColor: colors.iluminado,
        borderRadius: 16,
        paddingVertical: 5,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: 'rgba(15, 118, 110, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    optionTitle: {
        fontSize: 16,
        color: colors.oscuro,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginLeft: 66,
    },
});

export default SettingsScreen;
