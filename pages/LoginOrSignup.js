import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from "react-native";
import { storeUser, getUsers } from "../config/firebase"; 

const { width } = Dimensions.get("window");

const LoginOrSignup = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState("");

    const handleAction = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Both fields are required!");
            return;
        }

        if (isLogin) {
            const users = await getUsers();
            const userExists = users.some(user => user.username === email && user.password === password);

            if (userExists) {
                Alert.alert("Success", "Login Successful!");
                navigation.navigate("HomeScreen");
                setMessage("Logged in successfully!");
            } else {
                Alert.alert("Error", "Invalid credentials!");
                setMessage("Invalid username or password.");
            }
        } else {
            await storeUser(email, password);
            Alert.alert("Success", "Signup Successful!");
            setMessage("User registered successfully!");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Air Quality Dashboard</Text>
            <View style={styles.card}>
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[styles.toggleButton, isLogin && styles.activeButton]}
                        onPress={() => setIsLogin(true)}
                    >
                        <Text style={styles.toggleText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleButton, !isLogin && styles.activeButton]}
                        onPress={() => setIsLogin(false)}
                    >
                        <Text style={styles.toggleText}>Signup</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#B0C4DE"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#B0C4DE"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {message !== "" && <Text style={styles.message}>{message}</Text>}
                <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
                    <Text style={styles.actionButtonText}>{isLogin ? "Login" : "Signup"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1F3B5F",
        paddingHorizontal: 30,
    },
    title: {
        fontSize: width < 400 ? 28 : 36,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 20,
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 8,
    },
    card: {
        width: "90%",
        maxWidth: 450,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: 40,
        borderRadius: 20,
        shadowColor: "#00BFFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 10,
        alignItems: "center",
    },
    toggleContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    toggleButton: {
        paddingVertical: 12,
        paddingHorizontal: 35,
        borderRadius: 30,
        marginHorizontal: 5,
        backgroundColor: "#3A4F70", // Default inactive button color
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    activeButton: {
        backgroundColor: "#1E3A8A", // Deep blue with glowing border for both Login and Signup
        borderColor: "#60A5FA",     
        borderWidth: 2,
        shadowColor: "#60A5FA",     
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 8,
    },
    toggleText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    input: {
        width: "100%",
        padding: 14,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#B0C4DE",
        backgroundColor: "#F0F8FF",
        borderRadius: 8,
        color: "#1F3B5F",
        fontSize: 16,
    },
    message: {
        color: "red",
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center",
    },
    actionButton: {
        backgroundColor: "#0A1E32",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
        marginTop: 10,
        shadowColor: "#00BFFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 12,
        elevation: 8,
    },
    actionButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default LoginOrSignup;
