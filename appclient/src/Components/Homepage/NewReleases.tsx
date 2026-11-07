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

const FETCH_NEW_GAMES = gql`
  query Games($offset: Int!, $limit: Int!, $newest: Boolean) {
    games(offset: $offset, limit: $limit, newest: $newest) {
      title
      url
      _id
      price
      coverImage
    }
  }
`;

const LIMIT = 8;

interface Game {
  _id: string;
  title: string;
  url: string;
  price: number;
  coverImage: string;
}

const NewGames = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= 640;
  const columns = isMobile ? 2 : width >= 1280 ? 8 : 4;

  const { loading, error, data } = useQuery<{ games: Game[] }>(FETCH_NEW_GAMES, {
    variables: {
      offset: 0,
      limit: LIMIT,
      newest: true,
    },
  });

  const games: Game[] = data?.games ?? [];

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.message}>Loading games...</Text>
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
    marginTop: 12,
  },
  error: {
    color: "#ff6b6b",
  },
});

export default NewGames;