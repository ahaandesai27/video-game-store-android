import { useState } from "react";
import {
  Image,
  Pressable,
  View,
  Text,
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

const GameRowCard = ({
  _id,
  url,
  title,
  coverImage,
  price,
  link = "",
}: Game) => {
  const [src, setSrc] = useState(coverImage);
  const router = useRouter();

  const handleImageError = () => {
    setSrc(FALLBACK_IMAGE);
  };

  const handlePress = () => {
    const path = (link || `games/${url}`).replace(/^\/+/, "");
    router.push(`/${path}` as any);
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
      <View>
        <Image
          source={{ uri: src }}
          accessibilityLabel={title}
          onError={handleImageError}
          resizeMode="cover"
          style={styles.image}
        />

        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          <Text style={styles.price}>
            {price !== 0 ? `${price}$` : "Free"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.75,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    backgroundColor: "#262626",
  },
  details: {
    marginTop: 16,
  },
  title: {
    fontSize: 14,
    color: "#60a5fa",
    fontWeight: "500",
  },
  price: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "500",
    color: "#ffffff",
  },
});

export default GameRowCard;