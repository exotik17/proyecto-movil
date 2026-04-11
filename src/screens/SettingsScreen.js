import colors from "../constants/colors";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import {signOut, auth} from "../services/firebaseService";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

const SettingsScreen = () => {

    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const handleLogout = async() => {
        try {
           setLoading(true);
           await signOut(auth);
           Alert.alert("Has cerrado sesión correctamente",[
            {text: "OK", onPress: () => navigation.reset({index:0, routes: [{name:"login"}]})}
           ]);
        } catch (error) {
            console.log("Error al cerrar sesión: ", error);
            Alert.alert("Error al cerrar sesión 😢", "Intenta de nuevo más tarde");
        } finally {
            setLoading(false);
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.spacer} />
            <TouchableOpacity style={styles.btn} activeOpacity={0.8} onPress={handleLogout} disabled={loading}>
                <Text style={styles.btnText}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: colors.principal,
        paddingBottom: 40,
    },
    spacer: {
        flex: 1,
    },
    btn: {
        borderWidth: 2,
        borderColor: colors.alerta,
        borderRadius: 999,
        paddingVertical: 14,
        paddingHorizontal: 40,
    },
    btnText: {
        color: colors.alerta,
        fontWeight: "600",
    },
};

export default SettingsScreen;
