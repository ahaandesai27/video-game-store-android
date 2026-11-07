import { useState } from "react";
import {
  Pressable,
  Text,
  Image,
  View,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

interface Game {
  _id: string;
  title: string;
  url: string;
  price?: number;
  coverImage: string;
  link?: string;
}

const FALLBACK_IMAGE =
  "https://static.vecteezy.com/system/resources/thumbnails/001/826/199/small_2x/progress-loading-bar-buffering-download-upload-and-loading-icon-vector.jpg";

const GameCard = ({
  _id,
  url,
  title,
  coverImage,
  price,
  link = "",
}: Game) => {
  const router = useRouter();
  const [src, setSrc] = useState(coverImage);

  const handleImageError = () => {
    setSrc(FALLBACK_IMAGE);
  };

  const handlePress = () => {
    router.push(
      `/${(link || `games/${url}`).replace(/^\/+/, "")}` as any
    );
  };

  return (
    <Pressable
      key={_id}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: src }}
          accessibilityLabel={title}
          style={styles.image}
          resizeMode="cover"
          onError={handleImageError}
        />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      {price !== undefined && price !== null && (
        <Text style={styles.price}>
          {price !== 0 ? `${price}$` : "Free"}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.75,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    color: "#ffffff",
  },
  price: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 4,
    color: "#ffffff",
  },
});

export default GameCard;