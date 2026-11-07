import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';

type Props = {
  gameUrl: string;
  onReviewSubmitted?: () => void;
};

type MutationProps = {
  addReview: {
    review: string;
  };
};

const POST_REVIEW = gql`
  mutation Review($review: AddReviewInput!) {
    addReview(review: $review) {
      review
    }
  }
`;

const FETCH_GAME_URL = gql`
  query Query($url: String!) {
    gameByUrl(url: $url) {
      _id
    }
  }
`;

const PostReview = ({ gameUrl, onReviewSubmitted }: Props) => {
  const { userId, isLoggedIn } = useUser();
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { data } = useQuery<{ gameByUrl: { _id: string } }>(FETCH_GAME_URL, {
    variables: { url: gameUrl },
  });

  const [addReview] = useMutation<MutationProps>(POST_REVIEW);

  const handleSubmit = async () => {
    if (!isLoggedIn || !userId) {
      Alert.alert('Notice', 'Must be logged in to post a review!');
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert('Notice', 'Please write a review before submitting.');
      return;
    }

    const gameId: string | undefined = data?.gameByUrl?._id;
    if (!gameId) {
      Alert.alert('Error', 'Unable to find game information.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await addReview({
        variables: {
          review: {
            game: gameId,
            user: userId,
            rating,
            review: reviewText.trim(),
          },
        },
      });

      if (res?.data) {
        Alert.alert('Success', 'Review submitted successfully!');
        setReviewText('');
        setRating(5);
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        Alert.alert('Error', 'An error occurred while submitting review.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave a Review</Text>

      {/* Star Rating Picker */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Rating: {rating} / 5</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              activeOpacity={0.7}
              style={styles.starTouch}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={28}
                color="#eab308"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Review Text Input */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Your Review</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={reviewText}
          onChangeText={setReviewText}
          placeholder="Share your thoughts about this game..."
          placeholderTextColor="#71717a"
          textAlignVertical="top"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.8}
      >
        {submitting ? (
          <ActivityIndicator size="small" color="#000000" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Review</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 14,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starTouch: {
    padding: 2,
  },
  textArea: {
    backgroundColor: '#09090b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 8,
    color: '#ffffff',
    padding: 12,
    fontSize: 15,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#eab308',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PostReview;
