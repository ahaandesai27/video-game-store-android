import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import Review from './Review';
import PostReview from './PostReview';

type ReviewProps = {
  url: string;
};

const GET_GAME_ID = gql`
  query Game($url: String!) {
    gameByUrl(url: $url) {
      _id
    }
  }
`;

const REVIEWS_BY_GAME = gql`
  query reviews($game: ID!, $offset: Int!, $limit: Int!) {
    reviewsByGame(game: $game, offset: $offset, limit: $limit) {
      _id
      review
      rating
      user {
        username
      }
      date
    }
  }
`;

const LIMIT = 3;

const Reviews: React.FC<ReviewProps> = ({ url }) => {
  const [loadingMore, setLoadingMore] = useState(false);

  const {
    loading: idLoading,
    error: idError,
    data: idData,
  } = useQuery<{ gameByUrl: { _id: string } }>(GET_GAME_ID, {
    variables: { url },
  });

  const gameId: string | undefined = idData?.gameByUrl?._id;

  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
    fetchMore,
    refetch,
  } = useQuery<{ reviewsByGame: any[] }>(REVIEWS_BY_GAME, {
    variables: {
      game: gameId,
      offset: 0,
      limit: LIMIT,
    },
    skip: !gameId,
  });

  const reviews = reviewsData?.reviewsByGame || [];

  const handleGetMore = async () => {
    if (!gameId || loadingMore) return;
    try {
      setLoadingMore(true);
      await fetchMore({
        variables: {
          game: gameId,
          offset: reviews.length,
          limit: LIMIT,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          if (!fetchMoreResult || !fetchMoreResult.reviewsByGame) return prev;
          return {
            ...prev,
            reviewsByGame: [
              ...prev.reviewsByGame,
              ...fetchMoreResult.reviewsByGame,
            ],
          };
        },
      });
    } finally {
      setLoadingMore(false);
    }
  };

  if (idLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="small" color="#a855f7" />
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </View>
    );
  }

  if (idError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>An error occurred loading reviews.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Reviews</Text>

      <PostReview gameUrl={url} onReviewSubmitted={() => refetch()} />

      {reviewsLoading && reviews.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color="#a855f7" />
        </View>
      ) : reviewsError ? (
        <Text style={styles.errorText}>Could not load reviews.</Text>
      ) : reviews.length === 0 ? (
        <Text style={styles.emptyText}>No reviews yet. Be the first to review!</Text>
      ) : (
        reviews.map((item: any) => <Review key={item._id} review={item} />)
      )}

      {reviews.length > 0 && (
        <TouchableOpacity
          style={styles.moreButton}
          onPress={handleGetMore}
          disabled={loadingMore}
          activeOpacity={0.7}
        >
          {loadingMore ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.moreButtonText}>More Reviews</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#000000',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  centerContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginVertical: 12,
    fontSize: 14,
  },
  emptyText: {
    color: '#71717a',
    fontSize: 15,
    fontStyle: 'italic',
    marginVertical: 16,
    textAlign: 'center',
  },
  moreButton: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  moreButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default Reviews;