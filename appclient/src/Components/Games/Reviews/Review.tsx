import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  review: {
    date: string;
    rating: number;
    review: string;
    user: {
      username: string;
    };
  };
};

function formatDate(date: string): string {
  if (!date) return '';
  return date.slice(0, 10).split('-').reverse().join(' ');
}

const Review = ({ review }: Props) => {
  const rating = Math.max(1, Math.min(5, review.rating || 0));

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= rating ? 'star' : 'star-outline'}
              size={16}
              color="#eab308"
              style={styles.starIcon}
            />
          ))}
          <Text style={styles.ratingNumber}>({rating}/5)</Text>
        </View>
        <Text style={styles.date}>{formatDate(review.date)}</Text>
      </View>

      <Text style={styles.reviewText}>{review.review}</Text>

      <View style={styles.userRow}>
        <Ionicons name="person-circle-outline" size={16} color="#9ca3af" />
        <Text style={styles.userName}>{review.user?.username || 'Anonymous'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  ratingNumber: {
    color: '#eab308',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  date: {
    color: '#71717a',
    fontSize: 13,
  },
  reviewText: {
    color: '#f3f4f6',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default Review;
