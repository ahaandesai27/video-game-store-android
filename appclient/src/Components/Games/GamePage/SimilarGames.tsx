import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import GameCard from '../GameCard';

type Props = {
  categories: any[];
  url: string;
};

const FETCH_SIMILAR_GAMES = gql`
  query SimilarGames($categories: [ID!]!, $offset: Int!, $limit: Int!) {
    gamesByCategory(categories: $categories, offset: $offset, limit: $limit) {
      title
      url
      _id
      coverImage
      price
    }
  }
`;

const LIMIT = 8;

const SimilarGames: React.FC<Props> = ({ categories, url }) => {
  const categoryIds = (categories || [])
    .map((c: any) => (typeof c === 'string' ? c : c?._id))
    .filter(Boolean);

  const { loading, error, data } = useQuery<{ gamesByCategory: any[] }>(FETCH_SIMILAR_GAMES, {
    variables: {
      categories: categoryIds,
      offset: 0,
      limit: LIMIT,
    },
    skip: categoryIds.length === 0,
  });

  const games = (data?.gamesByCategory || []).filter(
    (game: any) => game.url !== url
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#a855f7" />
        <Text style={styles.loadingText}>Loading similar games...</Text>
      </View>
    );
  }

  if (error || games.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Similar Games</Text>
      <FlatList
        data={games}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <GameCard link={`games/${item.url}`} {...item} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  center: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 8,
    fontSize: 14,
  },
  cardWrapper: {
    width: 170,
  },
  listContent: {
    paddingHorizontal: 12,
  },
});

export default SimilarGames;