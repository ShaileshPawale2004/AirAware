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
  onPress={() => {
    if (!siteId) {
      alert("Please select a site.");
      return;
    }
    if (!startDate || !endDate) {
      alert("Please select valid dates.");
      return;
    }
    navigation.navigate("Graph", { siteId, startDate, endDate, place });
  }}
  color="#4CAF50"
/>

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F3B5F",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 40,
    marginBottom: 40,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
    width: 160, // Improved size for spacing
  },
  image: {
    width: 140, 
    height: 140, 
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#00BFFF",
    backgroundColor: "#E6F7FF", 
    shadowColor: "#00BFFF",
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 12,
  },
  cityText: {
    fontSize: 20,
    marginTop: 8,
    color: "#B0C4DE",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    width: "90%",
    fontSize: 18,
    backgroundColor: "#f0f8ff",
  },
  result: {
    fontSize: 16,
    padding: 8,
    backgroundColor: "#ddd",
    marginVertical: 2,
  },
  dropdownItem: {
    padding: 12,
    backgroundColor: "#e0e0e0",
    marginVertical: 4,
  },
  selectedSite: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 12,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "90%",
    maxHeight: 200,
    minHeight:100,
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 40,
    marginBottom: 40,
    width: "90%",
  },
  label:{
    color:'#fff',
    fontSize:30,
    marginTop:20,
    marginBottom:20,
    fontWeight:"bold",
  },
  find:{
    marginTop:20,
  },
});



export default HomeScreen;