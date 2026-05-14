import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { getMedications, recordDose, getAdherenceLogsToday, updateMedicationStock } from "../services/medicationService";
import { getContacts } from "../services/contactService";
import { auth } from "../services/firebaseService";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const HomeScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [medications, setMedications] = useState([]);
    const [lowStockMeds, setLowStockMeds] = useState([]);
    const [dosesToday, setDosesToday] = useState({});
    const [contacts, setContacts] = useState([]);

    // Stock modal state
    const [stockModalVisible, setStockModalVisible] = useState(false);
    const [selectedMed, setSelectedMed] = useState(null);
    const [newStock, setNewStock] = useState('');

    const fetchData = useCallback(() => {
        const user = auth.currentUser;
        if (user) {
            const meds = getMedications(user.uid);
            setMedications(meds);

            const lowStock = meds.filter(m => m.stock <= m.alertThreshold);
            setLowStockMeds(lowStock);

            // Obtener las tomas de hoy
            const todayLogs = getAdherenceLogsToday(user.uid);
            const counts = {};
            todayLogs.forEach(log => {
                counts[log.medicationId] = (counts[log.medicationId] || 0) + 1;
            });
            setDosesToday(counts);
            // Obtener contactos
            const userContacts = getContacts(user.uid);
            setContacts(userContacts);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    const handleTakeDose = (med) => {
        if (med.stock > 0) {
            recordDose(med.id, auth.currentUser.uid, med.stock);
            Alert.alert('Dosis registrada', `Has registrado la toma de ${med.name}.`);
            fetchData();
        } else {
            Alert.alert('Sin stock', `No tienes suficiente ${med.name} para tomar.`);
        }
    };

    const handleUpdateStock = () => {
        if (!selectedMed) return;
        const parsedStock = parseInt(newStock, 10);
        if (isNaN(parsedStock) || parsedStock < 0) {
            Alert.alert('Valor inválido', 'El stock debe ser un número entero válido (0 o mayor).');
            return;
        }
        updateMedicationStock(selectedMed.id, parsedStock);
        setStockModalVisible(false);
        fetchData();
        Alert.alert('Éxito', 'Stock actualizado correctamente.');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hola,</Text>
                    <Text style={styles.userName}>{auth.currentUser?.displayName || auth.currentUser?.email || 'Usuario'}</Text>
                </View>
                <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate("User")}>
                    {auth.currentUser?.photoURL ? (
                        <Image
                            source={{ uri: auth.currentUser.photoURL }}
                            style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: colors.variante1 }}
                        />
                    ) : (
                        <Ionicons name="person-circle-outline" size={40} color={colors.variante1} />
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <View style={[styles.sectionHeader, { justifyContent: 'space-between' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.sectionTitle}>Medicamentos</Text>
                    </View>
                    <TouchableOpacity style={styles.addButtonMedium} onPress={() => navigation.navigate("AddMedication")}>
                        <Ionicons name="add" size={18} color={colors.iluminado} />
                        <Text style={styles.addButtonMediumText}>Añadir</Text>
                    </TouchableOpacity>
                </View>

                {medications.length === 0 ? (
                    <View style={styles.emptyStateCard}>
                        <Ionicons name="medical-outline" size={48} color={colors.subtitilo} />
                        <Text style={styles.emptyStateTitle}>Sin medicamentos</Text>
                        <Text style={styles.emptyStateText}>No tienes tratamientos programados para el día de hoy.</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddMedication")}>
                            <Ionicons name="add-circle-outline" size={20} color={colors.iluminado} />
                            <Text style={styles.addButtonText}>Añadir Medicamento</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    medications.map((med) => {
                        const timesTaken = dosesToday[med.id] || 0;
                        const maxDoses = parseInt(med.frequency, 10) || 1;
                        const isCompleted = timesTaken >= maxDoses;

                        return (
                            <View key={med.id} style={[styles.medCard, isCompleted && { backgroundColor: '#f0fff0', borderColor: colors.exito, borderWidth: 1 }]}>
                                <View style={styles.medInfo}>
                                    <Text style={[styles.medName, isCompleted && { color: colors.exito }]}>
                                        {med.name} {isCompleted && <Ionicons name="checkmark-circle" size={20} color={colors.exito} />}
                                    </Text>
                                    <Text style={styles.medDosage}>{med.dosage}</Text>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                                            setSelectedMed(med);
                                            setNewStock(med.stock.toString());
                                            setStockModalVisible(true);
                                        }}>
                                            <Text style={styles.medStock}>📝 Stock: {med.stock}</Text>
                                            <Ionicons name="pencil" size={16} color={colors.variante1} style={{ marginLeft: 5 }} />
                                        </TouchableOpacity>

                                        <View style={{
                                            backgroundColor: isCompleted ? colors.exito : 'transparent',
                                            paddingHorizontal: isCompleted ? 12 : 0,
                                            paddingVertical: isCompleted ? 8 : 0,
                                            borderRadius: 12
                                        }}>
                                            <Text style={isCompleted ? { color: colors.iluminado, fontWeight: 'bold', fontSize: 14 } : styles.medTodayStatePending}>
                                                {isCompleted ? "¡DÍA COMPLETADO!" : `🔴 Llevas ${timesTaken} de ${maxDoses} dosis hoy`}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {!isCompleted && (
                                    <TouchableOpacity
                                        style={styles.takeButton}
                                        onPress={() => handleTakeDose(med)}
                                    >
                                        <Ionicons name="add" size={32} color={colors.iluminado} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })
                )}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Alertas de Stock</Text>
                    <Ionicons name="alert-circle-outline" size={20} color={colors.advertencia} />
                </View>

                {lowStockMeds.length === 0 ? (
                    <View style={styles.emptyStateCard}>
                        <Ionicons name="checkmark-circle-outline" size={48} color={colors.exito} />
                        <Text style={styles.emptyStateTitle}>¡Todo en orden!</Text>
                        <Text style={styles.emptyStateText}>Tienes suficiente reserva de todos tus medicamentos.</Text>
                    </View>
                ) : (
                    lowStockMeds.map((med) => (
                        <View key={`alert-${med.id}`} style={[styles.medCard, { borderLeftColor: colors.advertencia, borderLeftWidth: 4 }]}>
                            <View style={styles.medInfo}>
                                <Text style={styles.medName}>{med.name}</Text>
                                <Text style={styles.medDosage}>Quedan solo {med.stock} unidades.</Text>
                            </View>
                            <Ionicons name="warning-outline" size={30} color={colors.advertencia} />
                        </View>
                    ))
                )}

                <View style={[styles.sectionHeader, { justifyContent: 'space-between', marginTop: 20 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.sectionTitle}>Contactos Médicos</Text>
                    </View>
                    <TouchableOpacity style={styles.addButtonMedium} onPress={() => navigation.navigate("AddContact")}>
                        <Ionicons name="add" size={18} color={colors.iluminado} />
                        <Text style={styles.addButtonMediumText}>Añadir</Text>
                    </TouchableOpacity>
                </View>

                {contacts.length === 0 ? (
                    <View style={styles.emptyStateCard}>
                        <Ionicons name="call-outline" size={48} color={colors.subtitilo} />
                        <Text style={styles.emptyStateTitle}>Sin contactos</Text>
                        <Text style={styles.emptyStateText}>No tienes contactos de emergencia registrados.</Text>
                    </View>
                ) : (
                    contacts.map((contact) => (
                        <View key={`contact-${contact.id}`} style={styles.medCard}>
                            <View style={styles.medInfo}>
                                <Text style={styles.medName}>{contact.name}</Text>
                                <Text style={styles.medDosage}>{contact.specialty}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.medStock, { marginRight: 10 }]}>{contact.phone}</Text>
                                <TouchableOpacity
                                    style={[styles.takeButton, { backgroundColor: colors.variante3, width: 44, height: 44, borderRadius: 22 }]}
                                >
                                    <Ionicons name="call" size={20} color={colors.iluminado} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}

            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={stockModalVisible}
                onRequestClose={() => setStockModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Actualizar Stock</Text>
                        <Text style={styles.modalSubtitle}>{selectedMed?.name}</Text>

                        <TextInput
                            style={styles.modalInput}
                            keyboardType="numeric"
                            value={newStock}
                            onChangeText={setNewStock}
                            placeholder="Nuevo stock"
                            placeholderTextColor={colors.subtitilo}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.subtitilo }]}
                                onPress={() => setStockModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.variante2 }]}
                                onPress={handleUpdateStock}
                            >
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const getStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.principal },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
        backgroundColor: colors.iluminado, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    greeting: { fontSize: 16, color: colors.oscuro },
    userName: { fontSize: 24, fontWeight: 'bold', color: colors.variante1 },
    profileIcon: { padding: 5 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 10 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.oscuro, marginRight: 8 },
    emptyStateCard: {
        backgroundColor: colors.iluminado, borderRadius: 16, padding: 30, alignItems: 'center',
        marginBottom: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 3.84, elevation: 2,
    },
    emptyStateTitle: { fontSize: 18, fontWeight: 'bold', color: colors.oscuro, marginTop: 15, marginBottom: 8 },
    emptyStateText: { fontSize: 14, color: colors.subtitilo, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
    addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.variante4, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25 },
    addButtonText: { color: colors.iluminado, fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
    addButtonMedium: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.variante2, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15 },
    addButtonMediumText: { color: colors.iluminado, fontWeight: 'bold', fontSize: 14, marginLeft: 4 },
    medCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: colors.iluminado, borderRadius: 16, padding: 20, marginBottom: 15,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
    },
    medInfo: { flex: 1 },
    medName: { fontSize: 22, fontWeight: 'bold', color: colors.oscuro, marginBottom: 4 },
    medDosage: { fontSize: 16, color: colors.subtitilo, marginBottom: 2 },
    medStock: { fontSize: 14, color: colors.variante1, fontWeight: '600' },
    medTodayStatePending: { fontSize: 14, color: colors.alerta, fontWeight: 'bold' },
    medTodayStateOk: { fontSize: 14, color: colors.exito, fontWeight: 'bold' },
    takeButton: {
        backgroundColor: colors.exito, width: 56, height: 56, borderRadius: 28,
        alignItems: 'center', justifyContent: 'center', marginLeft: 15,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4
    },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '80%', backgroundColor: colors.iluminado, borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.oscuro, marginBottom: 5 },
    modalSubtitle: { fontSize: 16, color: colors.subtitilo, marginBottom: 20 },
    modalInput: { width: '100%', borderWidth: 1, borderColor: colors.variante3, borderRadius: 8, padding: 12, fontSize: 16, color: colors.oscuro, textAlign: 'center', marginBottom: 20 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
    modalButtonText: { color: colors.iluminado, fontSize: 16, fontWeight: 'bold' }
});

export default HomeScreen;
