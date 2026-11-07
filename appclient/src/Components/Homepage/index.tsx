import { ScrollView, Text, View, StyleSheet } from "react-native";

import Navbar from "../Navbar";
import GameCarousel from "./GameCarousel";
import NewReleases from "./NewReleases";
import Recomms from "./Recomms";
import { useUser } from "../../context/UserContext";

export default function Homepage() {
  const { userId } = useUser();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      {/*<Navbar />*/}

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heading}>
          Discover & Buy the Best Games at{" "}
          <Text style={styles.highlight}>GameShop</Text>
        </Text>

        <Text style={styles.description}>
          Browse our collection of games, read reviews, and find your next
          favorite adventure.
        </Text>
      </View>

      <GameCarousel />

      {/* New Releases */}
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>New Releases</Text>
      </View>

      <NewReleases />

      {/* Personalized Recommendations */}
      {userId && (
        <View>
          <View style={styles.recommendationHeading}>
            <Text style={styles.sectionTitle}>
              Recommended for you
            </Text>
          </View>

          <Recomms />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000000",
  },
  content: {
    flexGrow: 1,
    backgroundColor: "#000000",
    paddingBottom: 24,
  },
  hero: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 64,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 57,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
  },
  highlight: {
    color: "#a855f7",
  },
  description: {
    fontSize: 18,
    color: "#d1d5db",
    textAlign: "center",
    maxWidth: 768,
    lineHeight: 28,
  },
  sectionHeading: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
  },
  recommendationHeading: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 32,
  },
});
