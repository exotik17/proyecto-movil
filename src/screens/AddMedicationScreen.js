import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { addMedication } from '../services/medicationService';
import { auth } from '../services/firebaseService';

const AddMedicationScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');
    const [stock, setStock] = useState('');
    const [alertThreshold, setAlertThreshold] = useState('');

    const handleSave = () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Error', 'Debes iniciar sesión para guardar.');
            return;
        }

        if (!name || !dosage || !frequency || !stock || !alertThreshold) {
            Alert.alert('Incompleto', 'Por favor, llena todos los campos.');
            return;
        }

        const parsedStock = parseInt(stock, 10);
        const parsedAlert = parseInt(alertThreshold, 10);
        const parsedFrequency = parseInt(frequency, 10);

        if (isNaN(parsedStock) || isNaN(parsedAlert) || isNaN(parsedFrequency) || parsedStock < 0 || parsedAlert < 0 || parsedFrequency <= 0) {
            Alert.alert('Datos inválidos', 'El stock, frecuencia y umbral deben ser números positivos válidos.');
            return;
        }

        try {
            const data = {
                userId: user.uid,
                name: name.trim(),
                dosage: dosage.trim(),
                frequency: parsedFrequency.toString(),
                stock: parsedStock,
                alertThreshold: parsedAlert,
            };

            addMedication(data);
            Alert.alert('Éxito', 'El medicamento se agregó correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Hubo un problema al guardar el medicamento.');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.oscuro} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Añadir Medicamento</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.label}>Nombre del Medicamento</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej. Paracetamol"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Dosis</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej. 500mg"
                    value={dosage}
                    onChangeText={setDosage}
                />

                <Text style={styles.label}>¿Cuántas veces al día lo tomas?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej. 3"
                    keyboardType="numeric"
                    value={frequency}
                    onChangeText={setFrequency}
                />

                <Text style={styles.label}>Stock Actual (Cantidad)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej. 20"
                    keyboardType="numeric"
                    value={stock}
                    onChangeText={setStock}
                />

                <Text style={styles.label}>Avisar cuando queden (Umbral)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej. 5"
                    keyboardType="numeric"
                    value={alertThreshold}
                    onChangeText={setAlertThreshold}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Guardar Medicamento</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.principal,
    },
    content: {
        padding: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.oscuro,
    },
    formContainer: {
        backgroundColor: colors.iluminado,
        padding: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        color: colors.oscuro,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.principal,
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.variante3,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: colors.variante2,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: colors.iluminado,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddMedicationScreen;
