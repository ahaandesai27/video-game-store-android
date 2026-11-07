import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import GameCard from "./GameCard";
import GameRowCard from "./GameRowCard";
import { useUser } from "../../context/UserContext";

const RECOMMEND_GAMES = gql`
  query SimilarGames(
    $categories: [ID!]!
    $offset: Int!
    $limit: Int!
  ) {
    gamesByCategory(
      categories: $categories
      offset: $offset
      limit: $limit
    ) {
      title
      url
      _id
      coverImage
    }
  }
`;

const LIMIT = 8;

interface Game {
  _id: string;
  title: string;
  url: string;
  coverImage: string;
  price?: number;
}

const RecommendedGames = () => {
  const { userPreferences } = useUser();
  const { width } = useWindowDimensions();
  const isMobile = width <= 640;
  const columns = isMobile ? 2 : width >= 1280 ? 8 : 4;

  const categories = userPreferences ?? [];

  const { loading, error, data } = useQuery<{ gamesByCategory: Game[] }>(RECOMMEND_GAMES, {
    variables: {
      categories,
      offset: 0,
      limit: LIMIT,
    },
    skip: categories.length === 0,
  });

  const games: Game[] = data?.gamesByCategory ?? [];

  if (categories.length === 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Select your preferred categories to see recommendations.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.message}>Loading recommendations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.error}>
          Error: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        key={`columns-${columns}`}
        data={games}
        keyExtractor={(item) => item._id}
        numColumns={columns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) =>
          isMobile ? (
            <GameRowCard
              {...item}
              link={`games/${item.url}`}
            />
          ) : (
            <GameCard {...item} />
          )
        }
        ListEmptyComponent={
          <Text style={styles.message}>
            No recommendations found.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  messageContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    color: "#ffffff",
    textAlign: "center",
  },
  error: {
    color: "#ff6b6b",
  },
});

export default RecommendedGames;