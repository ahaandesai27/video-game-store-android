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
    const target = link || `games/${url}`;
    router.push(`/${target.replace(/^\/+/, "")}` as any);
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
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: src }}
          accessibilityLabel={title}
          onError={handleImageError}
          resizeMode="cover"
          style={styles.image}
        />
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {price !== undefined && price !== null && (
          <Text style={styles.price}>
            {price !== 0 ? `${price}$` : "Free"}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#18181b",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  pressed: {
    opacity: 0.75,
  },
  imageWrapper: {
    width: 95,
    aspectRatio: 3 / 4,
    backgroundColor: "#262626",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    color: "#60a5fa",
    fontWeight: "600",
  },
  price: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default GameRowCard;