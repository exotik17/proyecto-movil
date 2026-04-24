import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { useFocusEffect } from "@react-navigation/native";
import { auth } from "../services/firebaseService";
import { getUserData, updateUserProfilePhoto } from "../services/userService";
import { pickImage, uploadImageToCloudinary } from "../services/cloudinaryService";
import { getAdherenceLogs } from "../services/medicationService";
import { getContacts } from "../services/contactService";

const UserScreen = ({navigation}) => {

    const user = auth.currentUser;
    const [imageuri, setimageuri] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectImage, setSelectImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [logs, setLogs] = useState([]);
    const [contacts, setContacts] = useState([]);
    const defaultImage = "https://ui-avatars.com/api/?name=Usuario&background=0D8ABC&color=fff&size=200";

    const fetchUserProfile = useCallback(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
               const firestoreUserData = await getUserData(currentUser.uid);
               setUserData(firestoreUserData);
               setimageuri(firestoreUserData?.photoURL || currentUser.photoURL || defaultImage);
            } catch (error) {
                console.error("Error al obtener perfil (silencioso):", error);
                setimageuri(currentUser.photoURL || defaultImage);
            }
        }
    }, [defaultImage]);

    const fetchBusinessData = useCallback(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setLogs(getAdherenceLogs(currentUser.uid));
            setContacts(getContacts(currentUser.uid));
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchUserProfile();
            fetchBusinessData();
        }, [fetchUserProfile, fetchBusinessData])
    );

    const handleImageSelection = async () => {
        try {
            const imageAsset = await pickImage();
            if (imageAsset) {
                setSelectImage(imageAsset);
                setShowPreview(true);
            }
        } catch (error) {
            console.error("Error al seleccionar la imagen:", error);
            Alert.alert("Error", "No se pudo seleccionar la imagen. Intenta de nuevo.");
        }
    }

    const handleCancelSelection = () => {
        setSelectImage(null);
        setShowPreview(false);
    }

    const handleConfirmUpload = async () => {
        if (!selectImage) return;
        try {
            setLoading(true);
            setShowPreview(false);

            const imageUrl = await uploadImageToCloudinary(selectImage.uri);
            await updateUserProfilePhoto(user.uid, imageUrl);

            setimageuri(imageUrl);

            setSelectImage(null);
            Alert.alert("Éxito", "Tu foto de perfil ha sido actualizada.");

        } catch (error) {
            console.error("Error al cargar la imagen:", error);
            Alert.alert("Error", "No se pudo actualizar la foto de perfil. Intenta de nuevo.");

        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView>
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
                    <Ionicons name="pie-chart-outline" size={48} color={logs.length > 0 ? colors.variante1 : colors.subtitilo} />
                    <Text style={styles.emptyStateTitle}>{logs.length > 0 ? `${logs.length} Dosis Registradas` : "Aún no hay datos"}</Text>
                    <Text style={styles.emptyStateText}>{logs.length > 0 ? "Sigue así, llevar control preciso de tu medicina te da mejor salud." : "Comienza a registrar y tomar tus medicamentos."}</Text>
                </View>

                {/* Sección de Médicos/Contactos */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Contactos Médicos</Text>
                    <Ionicons name="people-outline" size={20} color={colors.variante3} />
                </View>

                {contacts.length === 0 ? (
                    <View style={styles.emptyStateCard}>
                        <Ionicons name="calendar-outline" size={48} color={colors.subtitilo} />
                        <Text style={styles.emptyStateTitle}>Sin contactos</Text>
                        <Text style={styles.emptyStateText}>Agrega la información de tus doctores de cabecera para tenerla a la mano.</Text>
                    </View>
                ) : (
                    contacts.map(c => (
                        <View key={c.id} style={{backgroundColor: colors.iluminado, padding: 15, borderRadius: 10, marginBottom: 10}}>
                            <Text style={{fontWeight: 'bold', fontSize: 16}}>{c.name}</Text>
                            <Text>{c.specialty} - {c.phone}</Text>
                        </View>
                    ))
                )}

                <View style={{alignItems: 'center', marginVertical: 20}}>
                    {selectImage ? (
                        <Image 
                            source={{uri: selectImage.uri}} 
                            style={{width: 120, height: 120, borderRadius: 60, marginBottom: 10}} 
                            resizeMode="cover"
                        />
                    ) : imageuri ? (
                        <Image 
                            source={{uri: imageuri}} 
                            style={{width: 120, height: 120, borderRadius: 60, marginBottom: 10}} 
                            resizeMode="cover"
                        />
                    ) : null}

                    {!selectImage ? (
                        <TouchableOpacity 
                            style={{backgroundColor: colors.variante2, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20}} 
                            onPress={handleImageSelection} 
                            disabled={loading}
                        >
                            <Text style={{color: colors.iluminado, fontWeight: 'bold'}}>Cambiar Foto</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                            <TouchableOpacity 
                                style={{backgroundColor: colors.variante1, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20}} 
                                onPress={handleCancelSelection} 
                                disabled={loading}
                            >
                                <Text style={{color: colors.iluminado, fontWeight: 'bold'}}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={{backgroundColor: colors.exito, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20}} 
                                onPress={handleConfirmUpload} 
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color={colors.iluminado} />
                                ):(
                                    <Text style={{color: colors.iluminado, fontWeight: 'bold'}}>Guardar en Nube</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

            </ScrollView>
        </View>
        </ScrollView>
        
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
