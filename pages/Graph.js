import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, ScrollView, Button } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Papa from 'papaparse';


const screenWidth = Dimensions.get('window').width;



const Graph = ({ route }) => {
  const { siteId, startDate, endDate } = route.params;
  console.log("paras: ", route.params);
  
  const [loading, setLoading] = useState(true);
  const [dailyData, setDailyData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]); 
  const [viewMode, setViewMode] = useState('daily');
  const [avg, setAvg] = useState(24)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = `http://atmos.urbansciences.in/adp/v4/getDeviceDataParam/imei/${siteId}/params/pm2.5cnc,pm10cnc/startdate/${startDate}/enddate/${endDate}/ts/mm/avg/${avg}/api/63h3AckbgtY?gaps=1&gap_value=NaN`;
        console.log("Fetching data from:", API_URL);
        const response = await fetch(API_URL);
        const csvData = await response.text();
        const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
        
        console.log("Total data points:", parsedData.data.length);


        const groupedData = parsedData.data.reduce((acc, curr) => {
          if (curr["pm2.5cnc"] === "NaN" || curr["pm10cnc"] === "NaN") return acc;
          
          const date = curr.dt_time.split(' ')[0];
          const pm25 = parseFloat(curr["pm2.5cnc"]);
          const pm10 = parseFloat(curr["pm10cnc"]);
          
          if (!acc[date]) {
            acc[date] = {
              pm25: [pm25],
              pm10: [pm10],
              timestamp: curr.dt_time,
              count: 1
            };
          } else {
            acc[date].pm25.push(pm25);
            acc[date].pm10.push(pm10);
            acc[date].count++;
          }
          return acc;
        }, {});

        const processedData = Object.entries(groupedData).map(([date, values]) => ({
          date,
          pm25: values.pm25.reduce((a, b) => a + b) / values.count,
          pm10: values.pm10.reduce((a, b) => a + b) / values.count,
          timestamp: values.timestamp
        }));

        setDailyData(processedData);
        console.log("daily data", processedData);
        
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [siteId, startDate, endDate]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }


  const chartData = {
    labels: dailyData.map(item => item.date.split('-')[2]), // Show only day
    datasets: [
      {
        data: dailyData.map(item => item.pm25.toFixed(2)),
        color: (opacity = 1) => rgba(0, 0, 255, `${opacity}`),
        strokeWidth: 2,
        label: 'PM2.5',
      },
      {
        data: dailyData.map(item => item.pm10.toFixed(2)),
        color: (opacity = 1) => rgba(0, 255, 0, `${opacity}`),
        strokeWidth: 2,
        label: 'PM10',
      }
    ],
    legend: ['PM2.5', 'PM10']
  };





  const renderViewToggle = () => (
    <View style={styles.toggleContainer}>
      <Button
        title="Daily View"
        onPress={() => setViewMode('daily')}
        color={viewMode === 'daily' ? '#4CAF50' : '#888'}
      />
      <Button
        title="Hourly View"
        onPress={() => setViewMode('hourly')}
        color={viewMode === 'hourly' ? '#4CAF50' : '#888'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Air Quality Analysis</Text>
        <Text style={styles.subtitle}>Location: {siteId}</Text>
      </View>


      {renderViewToggle()}
      
     
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>7-Day PM2.5</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={chartData}
              width={Math.max(screenWidth - 32, dailyData.length * 100)}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(220, 0, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForBackgroundLines: {
                  strokeDasharray: ''
                }
              }}
              style={styles.chart}
              showValuesOnTopOfBars
            />
          </ScrollView>
        </View>


      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Daily Summary</Text>
        {dailyData.map((day, index) => (
          <View key={index} style={styles.summaryCard}>
            <Text style={styles.summaryDate}>{day.date}</Text>
            <View style={styles.summaryValues}>
              <Text style={styles.summaryText}>PM2.5: {day.pm25.toFixed(1)} µg/m³</Text>
              <Text style={styles.summaryText}>PM10: {day.pm10.toFixed(1)} µg/m³</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4
  },
  healthCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  healthValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8
  },
  healthAdvice: {
    fontSize: 16,
    color: '#444'
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333'
  },
  chart: {
    borderRadius: 12
  },
  comparisonContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2
  },
  summaryContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333'
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  summaryDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444'
  },
  summaryValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  summaryText: {
    fontSize: 14,
    color: '#666'
  },
  comparisonText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center'
  },
  infoCard: {
    backgroundColor: '#FFF9C4',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  peakHourText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 12
  },
  timeAnalysis: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  analysisText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  }
});

export default Graph;