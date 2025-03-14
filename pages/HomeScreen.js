

import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert} from "react-native";
import sites  from "./data"; 

function levenshteinDistance(s1, s2) {
  const dp = Array(s1.length + 1)
    .fill(null)
    .map(() => Array(s2.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i++) dp[i][0] = i;
  for (let j = 0; j <= s2.length; j++) dp[0][j] = j;

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  return dp[s1.length][s2.length];
}

function matchStrings(str1, str2) {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());

  const maxLen = Math.max(str1.length, str2.length);
  const similarity = (maxLen - distance) / maxLen;
  console.log("similarity: ", similarity,distance,maxLen);

  return similarity >= 0.5;
}

const findSiteByCity = (city) => {
  console.log("city: ", city);
  for (let i in sites) {
    console.log(i, "-> ", sites[i]);
    if (sites[i]?.name && matchStrings(city, sites[i]?.name)) {
      return sites[i];
    }
    if (sites[i]?.city && matchStrings(city, sites[i]?.city)) {
      return sites[i];
    }
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const HomeScreen = ({ navigation }) => {

  const currentDate = new Date();
  const pastDate = new Date(currentDate);
  pastDate.setDate(currentDate.getDate() - 7);

  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState(formatDate(pastDate));
  const [endDate, setEndDate] = useState(formatDate(currentDate));

  const handleSubmit = () => {
    console.log("city: ", city);
    if (!city.trim()) {

      Alert.alert("Invalid Input", "Please enter a city name.");
      return;
    }

    const site = findSiteByCity(city);
    console.log("site: ", sites, site);

    if (!site) {
      Alert.alert(
        "No Monitoring Site", 
        `No air quality monitoring site found in ${city}. Available cities: Delhi, Mumbai, Bengaluru, Hyderabad, Kolkata`
      );
      return;
    }

    Alert.alert(
      "Monitoring Site Found", 
      `Site: ${site.name}\nCity: ${site.city}\nID: ${site.id}`
    );

    navigation.navigate("GraphScreen", {
      siteId: site.id,
      startDate,
      endDate,
    });
  };

  return (
    <View>
      <Text>AirAware</Text>
      <Text>Available Cities: Delhi, Mumbai, Bengaluru, Hyderabad, Kolkata</Text>

      <View>
        <Text>City:</Text>
        <TextInput value={city} onChangeText={setCity} placeholder="Enter city name " />

        <Text>Start Date:</Text>
        <TextInput value={startDate} onChangeText={setStartDate} />

        <Text>End Date:</Text>
        <TextInput value={endDate} onChangeText={setEndDate} />

        <Button title="Find Site & Fetch Data" onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default HomeScreen;
