
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

const games = [
  {
    id: 1,
    title: "Featured Game One",
    image: require("../../../assets/images/game1.jpg"),
  },
  {
    id: 2,
    title: "Featured Game Two",
    image: require("../../../assets/images/game2.jpg"),
  },
  {
    id: 3,
    title: "Featured Game Three",
    image: require("../../../assets/images/game3.jpg"),
  },
  {
    id: 4,
    title: "Featured Game Four",
    image: require("../../../assets/images/game4.jpg"),
  },
];

export default function GameCarousel() {
  const { width: screenWidth, height: screenHeight } =
    useWindowDimensions();

  const isMobile = screenWidth < 640;

  const carouselWidth = Math.max(
    1,
    Math.min(screenWidth - (isMobile ? 24 : 64), 1400)
  );

  const carouselHeight = Math.max(
    280,
    Math.min(
      screenHeight * (isMobile ? 0.5 : 0.75),
      carouselWidth * 0.75,
      800
    )
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const activeIndexRef = useRef(0);

  const goToSlide = (index: number) => {
    const nextIndex = (index + games.length) % games.length;

    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);

    scrollRef.current?.scrollTo({
      x: nextIndex * carouselWidth,
      animated: true,
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide(activeIndexRef.current + 1);
    }, 4000);

    return () => clearInterval(timer);
  }, [carouselWidth]);

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / carouselWidth);

    if (index >= 0 && index < games.length) {
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, isMobile && styles.mobileHeading]}>
        Featured Games
      </Text>

      <View
        style={[
          styles.carousel,
          {
            width: carouselWidth,
            height: carouselHeight,
          },
        ]}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          style={{ width: carouselWidth, height: carouselHeight }}
        >
          {games.map((game) => (
            <View
              key={game.id}
              style={[
                styles.slide,
                {
                  width: carouselWidth,
                  height: carouselHeight,
                },
              ]}
            >
              <Image
                source={game.image}
                style={styles.image}
                resizeMode="contain"
              />

              {/*<View style={styles.caption}>
                <Text style={styles.gameTitle}>{game.title}</Text>
              </View>*/}
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.pagination}>
        {games.map((game, index) => (
          <Pressable
            key={game.id}
            onPress={() => goToSlide(index)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Go to slide ${index + 1}`}
          >
            <View
              style={[
                styles.dot,
                activeIndex === index && styles.activeDot,
              ]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingVertical: 24,
  },

  heading: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },

  mobileHeading: {
    fontSize: 26,
    marginBottom: 18,
  },

  carousel: {
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "#111111",
  },

  slide: {
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  caption: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  gameTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 18,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#666666",
  },

  activeDot: {
    width: 24,
    backgroundColor: "#ffffff",
  },
});
