import React, { useRef, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const WelcomeScreen = ({ navigation }) => {
    const scrollAnim = useRef(new Animated.Value(screenWidth)).current; // Start from the right side

    useEffect(() => {
        Animated.sequence([
            Animated.timing(scrollAnim, {
                toValue: 0,   // Ends at the center
                duration: 8000, // Speed control (adjust as needed)
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(scrollAnim, {
                toValue: 0,   // Hold position at the center
                duration: 2000, // Pause for a moment to settle
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require("../assets/logo.png")} style={styles.logo} />
            </View>

            <Text style={styles.title}>AirAware</Text>

            {/* Marquee Effect with Center Stop */}
            <View style={styles.marqueeContainer}>
                <Animated.Text style={[styles.tagline, { transform: [{ translateX: scrollAnim }] }]}>
                    Breathe Better, Live Healthier!
                </Animated.Text>
            </View>

            <Text style={styles.description}>
                Stay informed about the air quality around you with real-time updates 
                and personalized insights. Protect your health and make better 
                environmental choices with AirAware.
            </Text>

            <TouchableOpacity
                style={styles.getStartedButton}
                onPress={() => navigation.navigate("LoginOrSignup")}
            >
                <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
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
    logoContainer: {
        backgroundColor: "#ffffff",
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#00BFFF",
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
        overflow: "hidden",
    },
    logo: {
        width: "100%",
        height: "100%",
        borderRadius: 70,
        resizeMode: "cover",
    },
    title: {
        fontSize: 42,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 5,
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 8,
    },
    marqueeContainer: {
        width: "100%",
        overflow: "hidden",
        marginBottom: 20,
    },
    tagline: {
        fontSize: 22,
        color: "#00BFFF",
        fontWeight: "700",
        textAlign: "center",
        whiteSpace: "nowrap",
    },
    description: {
        fontSize: 17,
        textAlign: "center",
        color: "#B0C4DE",
        marginBottom: 40,
        lineHeight: 26,
        paddingHorizontal: 20,
        fontWeight: "500",
    },
    getStartedButton: {
        backgroundColor: "#0A1E32",
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
        shadowColor: "#00BFFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 12,
        elevation: 8,
    },
    getStartedButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default WelcomeScreen;
