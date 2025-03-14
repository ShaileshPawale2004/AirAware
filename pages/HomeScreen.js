import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import sites from "./data";

const cityImages = [
  { name: "Bengaluru", src: require("../assets/bengaluru.jpeg") },
  { name: "Hyderabad", src: require("../assets/hyderabad.jpeg") },
  { name: "Kolkata", src: require("../assets/kolkata.jpeg") },
  { name: "Mumbai", src: require("../assets/mumbai.jpeg") },
  { name: "Delhi", src: require("../assets/delhi.jpeg") },
];

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

function matchStrings(query, target) {
  query = query.toLowerCase();
  target = target.toLowerCase();

  if (target.includes(query)) return 1; 

  const distance = levenshteinDistance(query, target);
  const maxLen = Math.max(query.length, target.length);
  const similarity = (maxLen - distance) / maxLen;

  return similarity >= 0.5 ? similarity : 0;
}

const findSiteByCity = (city, query) => {
  if (!city) return [];
  console.log("query: ", query);
  let results = sites.filter(site => site.city?.toLowerCase() === city.toLowerCase());

  if (query) {
    results = results
      .map(site => ({ site, matchScore: matchStrings(query, site.name) }))
      .filter(item => item.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore) // Prioritize exact substring matches
      .map(item => item.site);
  }
  console.log("results: ", results);
  
  return results;
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
  const [selectedCity, setSelectedCity] = useState(null);
  const [query, setQuery] = useState("");
  const [filteredSites, setFilteredSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [siteId, setSiteId] = useState("");
  const [place, setPlace] = useState("");

  const currentDate = new Date();
  const pastDate = new Date(currentDate);
  pastDate.setDate(currentDate.getDate() - 7);

  const [startDate, setStartDate] = useState(formatDate(pastDate));
  const [endDate, setEndDate] = useState(formatDate(currentDate));

  useEffect(() => {
    if (selectedCity) {
      const results = findSiteByCity(selectedCity, query);
      setFilteredSites(results);
    }
  }, [query, selectedCity]);

  if (!selectedCity) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Select a City</Text>
        <FlatList
          data={cityImages}
          keyExtractor={(item) => item.name}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedCity(item.name)} style={styles.imageContainer}>
              <Image source={item.src} style={styles.image} />
              <Text style={styles.cityText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected City: {selectedCity}</Text>

      <TextInput
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setSelectedSite(null);
        }}
        style={styles.input}
        placeholder="Enter site name..."
      />

      {query.length > 0 && !selectedSite && filteredSites.length > 0 && (
        <View style={[styles.dropdownContainer, { maxHeight: Math.min(filteredSites.length * 40, 200) }]}>
          <FlatList
            data={filteredSites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedSite(item.name);
                  setSiteId(item.id)
                  setPlace(item.name)
                  setFilteredSites([]);
                }}
                style={styles.dropdownItem}
              >
                <Text style={styles.result}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}


      {selectedSite && <Text style={styles.selectedSite}>Selected Site: {selectedSite}</Text>}

      <Text style={styles.label}>Start Date:</Text>
      <TextInput value={startDate} onChangeText={setStartDate} style={styles.input} />

      <Text style={styles.label}>End Date:</Text>
      <TextInput value={endDate} onChangeText={setEndDate} style={styles.input} />

      <Button
        title="Find Site & Fetch Data"
        onPress={() => navigation.navigate("Graph", { siteId: siteId, startDate, endDate, place })}
        color="#4CAF50"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    margin: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  cityText: {
    fontSize: 16,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  result: {
    fontSize: 16,
    padding: 8,
    backgroundColor: "#ddd",
    marginVertical: 2,
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    marginVertical: 2,
  },
  selectedSite: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    position: "absolute",
    top: 110,
    left: 20,
    right: 20,
    zIndex: 1000,
    elevation: 5,
    paddingVertical: 4,
    minWidth: 200, 
    minHeight: 100,
    maxWidth: "90%", 
  },
});

export default HomeScreen;