import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { useFocusEffect } from "@react-navigation/native";
import { auth } from "../services/firebaseService";
import { getUserData, updateUserProfilePhoto } from "../services/userService";
import { pickImage, uploadImageToCloudinary } from "../services/cloudinaryService";
import { getAdherenceLogs, getMedications, getAdherenceLogsToday } from "../services/medicationService";
import { getContacts } from "../services/contactService";

const UserScreen = ({navigation}) => {

    const user = auth.currentUser;
    const [imageUri, setImageUri] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectImage, setSelectImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [logs, setLogs] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [medications, setMedications] = useState([]);
    const [dosesToday, setDosesToday] = useState({});
    const defaultImage = "https://ui-avatars.com/api/?name=Usuario&background=0D8ABC&color=fff&size=200";

    const fetchUserProfile = useCallback(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
               const firestoreUserData = await getUserData(currentUser.uid);
               setUserData(firestoreUserData);
               setImageUri(firestoreUserData?.photoURL || currentUser.photoURL || defaultImage);
            } catch (error) {
                console.error("Error al obtener perfil (silencioso):", error);
                setImageUri(currentUser.photoURL || defaultImage);
            }
        }
    }, [defaultImage]);

    const fetchBusinessData = useCallback(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setLogs(getAdherenceLogs(currentUser.uid));
            setContacts(getContacts(currentUser.uid));
            setMedications(getMedications(currentUser.uid));

            const todayLogs = getAdherenceLogsToday(currentUser.uid);
            const counts = {};
            todayLogs.forEach(log => {
                counts[log.medicationId] = (counts[log.medicationId] || 0) + 1;
            });
            setDosesToday(counts);
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

            setImageUri(imageUrl);

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
                <View style={[styles.avatarContainer, imageUri ? { backgroundColor: 'transparent' } : {}]}>
                    {imageUri ? (
                        <Image source={{uri: imageUri}} style={{width: 100, height: 100, borderRadius: 50}} resizeMode="cover" />
                    ) : (
                        <Ionicons name="person" size={60} color={colors.iluminado} />
                    )}
                </View>
                <Text style={styles.userName}>{user?.displayName || 'Mi Perfil'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'Sin correo registrado'}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Sección de Adherencia */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Progreso de hoy</Text>
                    <Ionicons name="stats-chart-outline" size={20} color={colors.variante3} />
                </View>

                {(() => {
                    let totalDoses = 0;
                    let takenDoses = 0;
                    medications.forEach(med => {
                        const max = parseInt(med.frequency, 10) || 1;
                        totalDoses += max;
                        takenDoses += Math.min(dosesToday[med.id] || 0, max);
                    });
                    const pct = totalDoses === 0 ? 0 : Math.round((takenDoses / totalDoses) * 100);

                    return (
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryHeaderRow}>
                                <Text style={styles.summaryLabel}>Dosis tomadas hoy</Text>
                                <Text style={styles.summaryPct}>{pct}%</Text>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
                            </View>
                            <Text style={styles.summarySubtext}>{takenDoses} de {totalDoses} dosis programadas</Text>

                            {medications.length > 0 && (
                                <View style={{ marginTop: 16 }}>
                                    {medications.map(med => {
                                        const max = parseInt(med.frequency, 10) || 1;
                                        const taken = Math.min(dosesToday[med.id] || 0, max);
                                        const medPct = Math.round((taken / max) * 100);
                                        return (
                                            <View key={med.id} style={{ marginBottom: 10 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                                    <Text style={{ fontSize: 14, color: colors.oscuro, fontWeight: '600' }}>{med.name}</Text>
                                                    <Text style={{ fontSize: 13, color: colors.subtitilo }}>{taken}/{max}</Text>
                                                </View>
                                                <View style={styles.progressBarBg}>
                                                    <View style={[styles.progressBarFill, { width: `${medPct}%`, backgroundColor: medPct >= 100 ? colors.exito : colors.variante3 }]} />
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    );
                })()}

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
                    ) : imageUri ? (
                        <Image 
                            source={{uri: imageUri}} 
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
    summaryCard: {
        backgroundColor: colors.iluminado,
        borderRadius: 16,
        padding: 20,
        marginBottom: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
    summaryLabel: { fontSize: 16, fontWeight: '600', color: colors.oscuro },
    summaryPct: { fontSize: 26, fontWeight: 'bold', color: colors.variante2 },
    progressBarBg: { height: 10, backgroundColor: colors.principal, borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
    progressBarFill: { height: '100%', backgroundColor: colors.variante2, borderRadius: 5 },
    summarySubtext: { fontSize: 13, color: colors.subtitilo },
});



export default UserScreen;
