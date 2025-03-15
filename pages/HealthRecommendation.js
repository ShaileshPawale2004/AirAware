import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCY4cyaIQri_17pAfkDSNMyICyJeeQtPmk"); // Replace with your Gemini API key

const fetchDynamicRecommendation = async (pm25Level, place) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = `Provide detailed health recommendations and precautions for air quality when PM2.5 level is ${pm25Level} in ${place}. Focus on vulnerable groups, outdoor activity risks, and indoor safety. Give in only 3 to 4 points.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        const advice = response.text();

        return advice || "No specific recommendation available.";
    } catch (error) {
        console.error('Error fetching Gemini API recommendations:', error);
        return "Unable to fetch recommendations at the moment.";
    }
};

const HealthRecommendation = ({ pm25Level, place }) => {
    const [recommendation, setRecommendation] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getRecommendation = async () => {
            const advice = await fetchDynamicRecommendation(pm25Level, place);
            setRecommendation(advice);
            setLoading(false);
        };
        getRecommendation();
    }, [pm25Level, place]);

    if (loading) {
        return <ActivityIndicator size="large" color="#00796b" />;
    }

    return (
        <View style={styles.recommendationContainer}>
            <Text style={styles.recommendationTitle}>🌍 Dynamic Health Recommendation</Text>
            {recommendation.split('\n').map((point, index) => (
                <View key={index} style={styles.listItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.recommendationText}>{point.trim()}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    recommendationContainer: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 16,
        marginVertical: 10,
        borderLeftWidth: 6,
        borderLeftColor: '#00796b',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        width: 340,
        alignSelf: "center"
    },
    recommendationTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00796b',
        textAlign: 'center',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    recommendationText: {
        fontSize: 16,
        color: '#004d40',
        lineHeight: 24,
        textAlign: 'justify',
        paddingHorizontal: 5
    },
    bulletPoint: {
        fontSize: 16,
        color: '#00796b',
        fontWeight: 'bold',
        marginRight: 5
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    }
});

export default HealthRecommendation;
