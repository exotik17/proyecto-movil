import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { addContact } from '../services/contactService';
import { auth } from '../services/firebaseService';

const AddContactScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [phone, setPhone] = useState('');

    const handleSave = () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Error', 'Debes iniciar sesión para guardar.');
            return;
        }

        if (!name || !specialty || !phone) {
            Alert.alert('Incompleto', 'Por favor, llena todos los campos.');
            return;
        }

        try {
            const data = {
                userId: user.uid,
                name: name.trim(),
                specialty: specialty.trim(),
                phone: phone.trim(),
            };

            addContact(data);
            Alert.alert('Éxito', 'El contacto médico se agregó correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Hubo un problema al guardar el contacto.');
        }
    };

    const dynamicStyles = {
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
            color: colors.oscuro,
        },
        saveButton: {
            backgroundColor: colors.variante2,
            paddingVertical: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 10,
        },
        saveButtonText: {
            color: colors.iluminado, // Using iluminado for contrast 
            fontSize: 18,
            fontWeight: 'bold',
        },
    };

    return (
        <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
            <View style={dynamicStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={dynamicStyles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.oscuro} />
                </TouchableOpacity>
                <Text style={dynamicStyles.headerTitle}>Añadir Contacto</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={dynamicStyles.formContainer}>
                <Text style={dynamicStyles.label}>Nombre del Contacto</Text>
                <TextInput
                    style={dynamicStyles.input}
                    placeholder="Ej. Dr. Juan Pérez"
                    placeholderTextColor={colors.subtitilo}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={dynamicStyles.label}>Especialidad o Relación</Text>
                <TextInput
                    style={dynamicStyles.input}
                    placeholder="Ej. Cardiólogo / Familiar"
                    placeholderTextColor={colors.subtitilo}
                    value={specialty}
                    onChangeText={setSpecialty}
                />

                <Text style={dynamicStyles.label}>Número de Teléfono</Text>
                <TextInput
                    style={dynamicStyles.input}
                    placeholder="Ej. 555-1234"
                    placeholderTextColor={colors.subtitilo}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />

                <TouchableOpacity style={dynamicStyles.saveButton} onPress={handleSave}>
                    <Text style={dynamicStyles.saveButtonText}>Guardar Contacto</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AddContactScreen;
