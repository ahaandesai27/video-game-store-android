import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useJwt } from 'react-jwt';
import { useUser } from '../../../context/UserContext';

type Review = {
  _id: string;
  rating: number;
};

type Category = {
  _id: string;
};

type Game = {
  _id: string;
  coverImage: string;
  description: string;
  developer: string;
  platform: string[];
  price: number;
  publisher: string;
  releaseDate: string;
  title: string;
  url: string;
  reviews: Review[];
  categories: Category[];
};

type Props = {
  game: Game;
};

const ADD_GAME_TO_USER = gql`
  mutation addGameToUser($gameID: ID!, $userID: ID!) {
    addGameToUser(gameID: $gameID, userID: $userID) {
      _id
      ownedGames {
        _id
      }
    }
  }
`;

const ADD_GAME_TO_USER_CART = gql`
  mutation addGameToUserCart($gameID: ID!, $userID: ID!) {
    addGameToUserCart(gameID: $gameID, userID: $userID) {
      _id
      cart {
        _id
      }
    }
  }
`;

const FALLBACK_IMAGE =
  'https://static.vecteezy.com/system/resources/thumbnails/001/826/199/small_2x/progress-loading-bar-buffering-download-upload-and-loading-icon-vector.jpg';

const GameInfo: React.FC<Props> = ({ game }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const [imageSrc, setImageSrc] = useState(game.coverImage || FALLBACK_IMAGE);
  const [addingToLibrary, setAddingToLibrary] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    AsyncStorage.getItem('token').then(setToken);
  }, []);
  const { decodedToken, isExpired } = useJwt<any>(token || '');

  const contextUser = useUser();

  const effectiveUserId =
    contextUser?.userId || (!isExpired && decodedToken ? decodedToken.userId : null);
  const owned = contextUser?.userGames ? contextUser.userGames.has(game._id) : false;

  const [addGameToUser] = useMutation(ADD_GAME_TO_USER);
  const [addGameToUserCart] = useMutation(ADD_GAME_TO_USER_CART);

  const averageReview =
    game?.reviews && game.reviews.length > 0
      ? game.reviews.reduce((acc: number, review: Review) => acc + (review.rating || 0), 0) /
        game.reviews.length
      : 0;

  const date = new Date(game.releaseDate);
  const dateString = isNaN(date.getTime())
    ? game.releaseDate || 'N/A'
    : date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  const handleCheckout = () => {
    router.push({
      pathname: `/games/${game.url}/buy` as any,
      params: {
        _id: game._id,
        price: game.price.toString(),
        title: game.title,
      },
    });
  };

  const handleAddGame = async () => {
    if (!effectiveUserId) {
      Alert.alert('Notice', 'Please log in to add games to your library.');
      return;
    }
    try {
      setAddingToLibrary(true);
      await addGameToUser({
        variables: {
          gameID: game._id,
          userID: effectiveUserId,
        },
      });
      Alert.alert('Success', 'Game added to library!');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to add game to library.');
    } finally {
      setAddingToLibrary(false);
    }
  };

  const handleAddToCart = async () => {
    if (!effectiveUserId) {
      Alert.alert('Notice', 'Please log in to add items to your cart.');
      return;
    }
    try {
      setAddingToCart(true);
      await addGameToUserCart({
        variables: {
          gameID: game._id,
          userID: effectiveUserId,
        },
      });
      Alert.alert('Success', 'Game added to cart!');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to add game to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.mainLayout, isLargeScreen && styles.mainLayoutRow]}>
        {/* Cover Image */}
        <View style={[styles.imageContainer, isLargeScreen && styles.imageContainerLarge]}>
          <Image
            source={{ uri: imageSrc }}
            accessibilityLabel={game.title}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageSrc(FALLBACK_IMAGE)}
          />
        </View>

        {/* Details & Actions */}
        <View style={[styles.infoContainer, isLargeScreen && styles.infoContainerLarge]}>
          <Text style={styles.title}>{game.title}</Text>

          {/* Price & Rating */}
          <View style={styles.priceRatingRow}>
            <Text style={styles.price}>
              {game.price === 0 ? 'Free' : `$${game.price}`}
            </Text>

            <View style={styles.ratingBadge}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= Math.round(averageReview) ? 'star' : 'star-outline'}
                    size={18}
                    color="#eab308"
                  />
                ))}
              </View>
              <Text style={styles.ratingScore}>
                ({averageReview ? averageReview.toFixed(1) : '0'})
              </Text>
              <Text style={styles.reviewCount}>
                {game?.reviews?.length || 0} Reviews
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            {owned ? (
              <View style={[styles.primaryButton, styles.ownedButton]}>
                <Text style={styles.ownedButtonText}>Owned</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={game.price === 0 ? handleAddGame : handleCheckout}
                disabled={addingToLibrary}
                activeOpacity={0.8}
              >
                {addingToLibrary ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {game.price === 0 ? 'Add to Library' : 'Buy Now'}
                  </Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cartButton}
              onPress={handleAddToCart}
              disabled={addingToCart}
              activeOpacity={0.8}
            >
              {addingToCart ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <View style={styles.cartButtonContent}>
                  <Ionicons name="cart-outline" size={20} color="#ffffff" style={styles.cartIcon} />
                  <Text style={styles.cartButtonText}>Add to cart</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>About this game</Text>
            <Text style={styles.descriptionText}>{game.description || 'No description provided.'}</Text>
          </View>

          {/* Specs / Meta info */}
          <View style={styles.specsCard}>
            <Text style={styles.specsTitle}>Details</Text>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Developer:</Text>
              <Text style={styles.specValue}>{game.developer || 'N/A'}</Text>
            </View>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Publisher:</Text>
              <Text style={styles.specValue}>{game.publisher || 'N/A'}</Text>
            </View>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Platforms:</Text>
              <Text style={styles.specValue}>
                {Array.isArray(game.platform) ? game.platform.join(', ') : 'N/A'}
              </Text>
            </View>

            <View style={[styles.specRow, styles.specRowLast]}>
              <Text style={styles.specLabel}>Release Date:</Text>
              <Text style={styles.specValue}>{dateString}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#000000',
  },
  mainLayout: {
    flexDirection: 'column',
  },
  mainLayoutRow: {
    flexDirection: 'row',
    gap: 24,
  },
  imageContainer: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 2 / 3,
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#18181b',
    marginBottom: 20,
  },
  imageContainerLarge: {
    width: 320,
    height: 480,        // explicit, 2:3 of the width
    maxWidth: 320,
    aspectRatio: undefined,
    flexShrink: 0,
    alignSelf: 'flex-start',
    marginBottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
  },
  infoContainerLarge: {
    flex: 1.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
  },
  priceRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#a855f7',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stars: {
    flexDirection: 'row',
  },
  ratingScore: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewCount: {
    color: '#d1d5db',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#a855f7',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  ownedButton: {
    backgroundColor: '#3f3f46',
  },
  ownedButtonText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '700',
  },
  cartButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  cartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartIcon: {
    marginRight: 6,
  },
  cartButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#27272a',
    marginVertical: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#9ca3af',
    fontSize: 15,
    lineHeight: 22,
  },
  specsCard: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 8,
    padding: 16,
  },
  specsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  specRowLast: {
    borderBottomWidth: 0,
  },
  specLabel: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  specValue: {
    color: '#9ca3af',
    fontSize: 14,
    maxWidth: '60%',
    textAlign: 'right',
  },
});

export default GameInfo;