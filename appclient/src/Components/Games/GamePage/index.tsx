import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import Navbar from '../../Navbar';
import Reviews from '../Reviews/Reviews';
import SimilarGames from './SimilarGames';
import GameInfo from './GameInfo';
import LoadingPage from '../../Utils/Loading';
import ErrorPage from '../../Utils/Error';

const GET_GAME = gql`
  query Game($url: String!) {
    gameByUrl(url: $url) {
      _id
      coverImage
      description
      developer
      platform
      price
      publisher
      releaseDate
      title
      url
      reviews {
        _id
        rating
      }
      categories {
        _id
      }
    }
  }
`;

export default function GamePage() {
  const params = useLocalSearchParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const url = slug;

  const { loading, error, data } = useQuery<{ gameByUrl: any }>(GET_GAME, {
    variables: { url },
    skip: !url,
  });

  if (loading) return <LoadingPage />;
  if (error || (!loading && url && !data?.gameByUrl)) {
    return <ErrorPage />;
  }

  const game = data?.gameByUrl;
  const categories = game?.categories;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {game ? (
          <>
            <GameInfo game={game} />
            {url && <Reviews url={url} />}
            {categories && url && <SimilarGames categories={categories} url={url} />}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Game not found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
  },
});
