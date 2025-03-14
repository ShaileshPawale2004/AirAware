import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Alert } from "react-native";

const LoginOrSignup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState("");

    return (
        <View >
            <Text >🌍 Air Quality Dashboard</Text>
            <View >
                <View >
                    <TouchableOpacity onPress={() => setIsLogin(true)}>
                        <Text >Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsLogin(false)}>
                        <Text >Signup</Text>
                    </TouchableOpacity>
                </View>
                <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
                <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
                {message !== "" && <Text >{message}</Text>}
                <TouchableOpacity>
                    <Text >{isLogin ? "Login" : "Signup"}</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}

export default LoginOrSignup;