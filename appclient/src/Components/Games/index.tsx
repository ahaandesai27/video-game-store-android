import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';

import Navbar from '../Navbar';
import GameCard from './GameCard';
import GameRowCard from './GameRowCard';
import PlatformFilter from './Filters/PlatformFilter';
import SearchForm from './Filters/SearchForm';
import PriceSlider from './Filters/PriceSlider';
import CategoryFilter from './Filters/CategoryFilter';
import LoadingPage from '../Utils/Loading';
import ErrorPage from '../Utils/Error';

const LIMIT = 8;

interface Game {
  _id: string;
  title: string;
  url: string;
  price: number;
  coverImage: string;
}

const GET_GAMES = gql`
  query Games(
    $offset: Int!
    $limit: Int!
    $platform: String
    $price: Float
    $search: String
    $category: ID
  ) {
    games(
      offset: $offset
      limit: $limit
      platform: $platform
      price: $price
      search: $search
      category: $category
    ) {
      _id
      title
      url
      price
      coverImage
    }
  }
`;

export default function GamesScreen() {
  const [platform, setPlatform] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const numColumns = isLargeScreen ? 4 : 1;

  const variables = useMemo(
    () => ({
      offset: 0,
      limit: LIMIT,
      platform: platform || undefined,
      price: price !== null ? price : undefined,
      search: search || undefined,
      category: category || undefined,
    }),
    [platform, price, search, category]
  );

  const { loading, error, data, fetchMore, refetch } = useQuery<{ games: Game[] }>(GET_GAMES, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  const games: Game[] = data?.games || [];

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch(variables);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGetMore = async () => {
    if (loading || isFetchingMore || games.length === 0 || games.length % LIMIT !== 0) {
      return;
    }

    try {
      setIsFetchingMore(true);
      await fetchMore({
        variables: {
          ...variables,
          offset: games.length,
          limit: LIMIT,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          if (!fetchMoreResult || !fetchMoreResult.games || fetchMoreResult.games.length === 0) {
            return prev;
          }
          return {
            ...prev,
            games: [...prev.games, ...fetchMoreResult.games],
          };
        },
      });
    } finally {
      setIsFetchingMore(false);
    }
  };

  const activeFilterCount =
    (platform ? 1 : 0) +
    (price !== null ? 1 : 0) +
    (search ? 1 : 0) +
    (category ? 1 : 0);

  const clearAllFilters = () => {
    setPlatform(null);
    setPrice(null);
    setSearch(null);
    setCategory(null);
  };

  const renderFilterPanel = () => (
    <View style={styles.filterSection}>
      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>Filters</Text>
        {activeFilterCount > 0 && (
          <TouchableOpacity onPress={clearAllFilters}>
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      <SearchForm setSearch={setSearch} initialValue={search} />
      <PriceSlider setPrice={setPrice} currentPrice={price} />
      <PlatformFilter setFilter={setPlatform} selectedPlatform={platform} />
      <CategoryFilter setFilter={setCategory} selectedCategory={category} />
    </View>
  );

  const getHeadingTitle = () => {
    if (search) return `Search results for "${search}"`;
    if (platform) return `${platform} games`;
    return 'All Games';
  };

  if (loading && !data && !isRefreshing) {
    return (
      <View style={styles.screen}>
        <LoadingPage />
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.screen}>
        <ErrorPage />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.mainContainer, isLargeScreen && styles.mainContainerLarge]}>
        {/* Mobile Filters Toggle Button */}
        {!isLargeScreen && (
          <View style={styles.mobileFilterBar}>
            <TouchableOpacity
              style={styles.mobileFilterToggle}
              onPress={() => setShowMobileFilters(!showMobileFilters)}
              activeOpacity={0.8}
            >
              <Ionicons name="filter-outline" size={18} color="#ffffff" />
              <Text style={styles.mobileFilterText}>
                {showMobileFilters ? 'Hide Filters' : 'Filters'}
              </Text>
              {activeFilterCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{activeFilterCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {activeFilterCount > 0 && (
              <TouchableOpacity onPress={clearAllFilters} style={styles.mobileClearButton}>
                <Text style={styles.clearAllText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Mobile Filters Drawer/Collapsible View */}
        {!isLargeScreen && showMobileFilters && (
          <ScrollView style={styles.mobileFiltersContainer}>
            {renderFilterPanel()}
          </ScrollView>
        )}

        {/* Desktop Sidebar Filters */}
        {isLargeScreen && (
          <View style={styles.sidebarContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderFilterPanel()}
            </ScrollView>
          </View>
        )}

        {/* Games List Content */}
        <View style={styles.productsContainer}>
          <FlatList
            key={`games-grid-${numColumns}`}
            data={games}
            numColumns={numColumns}
            columnWrapperStyle={isLargeScreen ? styles.columnWrapper : undefined}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) =>
              !isLargeScreen ? (
                <GameRowCard {...item} />
              ) : (
                <View style={styles.gridItemWrapper}>
                  <GameCard {...item} />
                </View>
              )
            }
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Text style={styles.resultsHeading}>{getHeadingTitle()}</Text>
                {games.length > 0 && (
                  <Text style={styles.resultsCount}>
                    {games.length} {games.length === 1 ? 'game' : 'games'} found
                  </Text>
                )}
              </View>
            }
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="game-controller-outline" size={56} color="#52525b" />
                  <Text style={styles.noGamesText}>No games found</Text>
                  <Text style={styles.noGamesSubtext}>
                    Try adjusting your filters or search keywords
                  </Text>
                  {activeFilterCount > 0 && (
                    <TouchableOpacity
                      style={styles.resetFiltersButton}
                      onPress={clearAllFilters}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.resetFiltersButtonText}>Reset Filters</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : null
            }
            onEndReached={handleGetMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingMore ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color="#a855f7" />
                  <Text style={styles.footerLoaderText}>Loading more games...</Text>
                </View>
              ) : null
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#a855f7"
                colors={['#a855f7']}
              />
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContainerLarge: {
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: 300,
    borderRightWidth: 1,
    borderRightColor: '#27272a',
    backgroundColor: '#09090b',
    padding: 16,
  },
  productsContainer: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  clearAllText: {
    color: '#a855f7',
    fontSize: 14,
    fontWeight: '600',
  },
  mobileFilterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#18181b',
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  mobileFilterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  mobileFilterText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  mobileClearButton: {
    padding: 8,
  },
  badge: {
    backgroundColor: '#a855f7',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  mobileFiltersContainer: {
    maxHeight: 320,
    backgroundColor: '#09090b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  gridItemWrapper: {
    width: '25%',
    maxWidth: '25%',
  },
  listHeader: {
    marginBottom: 16,
  },
  resultsHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  resultsCount: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noGamesText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  noGamesSubtext: {
    color: '#71717a',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  resetFiltersButton: {
    marginTop: 20,
    backgroundColor: '#a855f7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  resetFiltersButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerLoaderText: {
    color: '#9ca3af',
    fontSize: 13,
  },
});
