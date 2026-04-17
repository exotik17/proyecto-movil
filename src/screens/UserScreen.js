import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

const UserScreen = () => {
    return (
        <View style={styles.container}>
            {/* Cabecera del Perfil */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={60} color={colors.iluminado} />
                </View>
                <Text style={styles.userName}>Mi Perfil</Text>
                <Text style={styles.userEmail}>usuario@correo.com</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Sección de Adherencia */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Adherencia a Tratamientos</Text>
                    <Ionicons name="stats-chart-outline" size={20} color={colors.variante3} />
                </View>
                
                <View style={styles.emptyStateCard}>
                    <Ionicons name="pie-chart-outline" size={48} color={colors.subtitilo} />
                    <Text style={styles.emptyStateTitle}>Aún no hay datos</Text>
                    <Text style={styles.emptyStateText}>Comienza a registrar y tomar tus medicamentos para ver tus estadísticas de cumplimiento aquí.</Text>
                </View>

                {/* Sección de Médicos/Contactos */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Contactos Médicos</Text>
                    <Ionicons name="people-outline" size={20} color={colors.variante3} />
                </View>

                <View style={styles.emptyStateCard}>
                    <Ionicons name="calendar-outline" size={48} color={colors.subtitilo} />
                    <Text style={styles.emptyStateTitle}>Sin contactos</Text>
                    <Text style={styles.emptyStateText}>Agrega la información de tus doctores de cabecera para tenerla a la mano.</Text>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.principal,
    },
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 30,
        backgroundColor: colors.variante2,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.iluminado,
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        color: colors.suave,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.oscuro,
        marginRight: 8,
    },
    emptyStateCard: {
        backgroundColor: colors.iluminado,
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        marginBottom: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.oscuro,
        marginTop: 15,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: colors.subtitilo,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default UserScreen;
