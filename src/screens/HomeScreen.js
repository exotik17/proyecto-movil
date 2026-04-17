import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            {/* Cabecera */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hola,</Text>
                    <Text style={styles.userName}>Usuario</Text>
                </View>
                <TouchableOpacity style={styles.profileIcon}>
                    <Ionicons name="person-circle-outline" size={40} color={colors.variante1} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Sección de Medicamentos de Hoy */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Medicamentos de Hoy</Text>
                </View>
                
                <View style={styles.emptyStateCard}>
                    <Ionicons name="medical-outline" size={48} color={colors.subtitilo} />
                    <Text style={styles.emptyStateTitle}>Sin medicamentos</Text>
                    <Text style={styles.emptyStateText}>No tienes tratamientos programados para el día de hoy.</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Ionicons name="add-circle-outline" size={20} color={colors.iluminado} />
                        <Text style={styles.addButtonText}>Añadir Medicamento</Text>
                    </TouchableOpacity>
                </View>

                {/* Sección de Alertas de Stock */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Alertas de Stock</Text>
                    <Ionicons name="alert-circle-outline" size={20} color={colors.advertencia} />
                </View>

                <View style={styles.emptyStateCard}>
                    <Ionicons name="checkmark-circle-outline" size={48} color={colors.exito} />
                    <Text style={styles.emptyStateTitle}>¡Todo en orden!</Text>
                    <Text style={styles.emptyStateText}>Tienes suficiente reserva de todos tus medicamentos.</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: colors.iluminado,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    greeting: {
        fontSize: 16,
        color: colors.oscuro,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.variante1,
    },
    profileIcon: {
        padding: 5,
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
        fontSize: 20,
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
        marginBottom: 20,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.variante4,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    addButtonText: {
        color: colors.iluminado,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
});

export default HomeScreen;
