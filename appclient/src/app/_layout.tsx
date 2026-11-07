import { View, StyleSheet, StatusBar } from "react-native";
import { Stack } from "expo-router";
import Navbar from "../Components/Navbar";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { UserProvider } from "../context/UserContext";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000/api/graphql",
  }),
  cache: new InMemoryCache(),
});

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#3b0764" />
          <Navbar />
          <View style={styles.content}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#000000" },
                animation: "none",
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="games/index" />
              <Stack.Screen name="games/[slug]" />
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
            </Stack>
          </View>
        </View>
      </UserProvider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
    width: "100%",
  },
});
