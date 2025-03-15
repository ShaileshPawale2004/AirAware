import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import data from './data'; // Assuming this file has city and site ID data

const Rank = ({route}) => {
    const [rankedData, setRankedData] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const fetchDataForSite = async (site) => {
        const { id: siteId, name: place } = site; // Extracting `name` for `place`

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const startDate = formatDate(yesterday);
        const endDate = startDate;

        const API_URL = `http://atmos.urbansciences.in/adp/v4/getDeviceDataParam/imei/${siteId}/params/pm2.5cnc/startdate/${startDate}T00:00/enddate/${endDate}T23:59/ts/hh/avg/1/api/63h3AckbgtY?gaps=1&gap_value=NaN`;

        try {
            const response = await fetch(API_URL);
            const textData = await response.text();

            if (!textData) throw new Error(`No data received for site ${siteId}`);

            const rows = textData.trim().split('\n').slice(1);
            const pm25Values = rows.map(row => {
                const columns = row.split(',');
                return parseFloat(columns[1]) || 0;
            });

            const avgPm25 = pm25Values.reduce((sum, val) => sum + val, 0) / pm25Values.length;

            return { place, avgPm25: avgPm25 || Infinity };
        } catch (error) {
            console.error(`Error fetching data for site ${siteId}:`, error);
            return { place, avgPm25: Infinity };
        }
    };

    const fetchAllData = async () => {
        const batchSize = 10;
        let results = [];

        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            const batchResults = await Promise.all(batch.map(site => fetchDataForSite(site)));
            results = [...results, ...batchResults];
        }

        const rankedResults = results
            .filter(site => site.avgPm25 !== Infinity)
            .sort((a, b) => a.avgPm25 - b.avgPm25);

        setRankedData(rankedResults);
        setLoading(false);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Air Quality Rankings (PM2.5)</Text>
            <FlatList
                data={rankedData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.rankCard}>
                        <Text style={styles.rankText}>
                            #{index + 1} - {item.place} (PM2.5: {item.avgPm25.toFixed(2)} µg/m³)
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
    },
    rankCard: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2
    },
    rankText: {
        fontSize: 16,
        color: '#333'
    }
});

export default Rank;
