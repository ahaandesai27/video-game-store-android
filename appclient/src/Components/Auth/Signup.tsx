import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";

interface SignupData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
}

interface AuthPayloadData {
  registerUser: {
    token: string;
  };
}

const SIGN_UP = gql`
  mutation Mutation($user: AddUserInput!) {
    registerUser(user: $user) {
      token
    }
  }
`;

export default function Signup() {
  const router = useRouter();
  const { login: userLogin } = useUser();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");

  const [loading, setLoading] = useState(false);

  const [signup] = useMutation<AuthPayloadData>(SIGN_UP);

  const handleSubmit = async () => {
    if (
      !username.trim() ||
      !email.trim() ||
      !password ||
      !firstName.trim() ||
      !lastName.trim() ||
      !age.trim()
    ) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

    const parsedAge = Number(age);

    if (!Number.isInteger(parsedAge) || parsedAge <= 0) {
      Alert.alert("Invalid age", "Please enter a valid age.");
      return;
    }

    try {
      setLoading(true);

      const user: SignupData = {
        username: username.trim(),
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: parsedAge,
      };

      const { data } = await signup({
        variables: { user },
      });

      if (data?.registerUser?.token) {
        const token = data.registerUser.token;
        await userLogin(token);
        router.replace("/");
      } else {
        Alert.alert("Registration failed", "No token was returned.");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during registration.";

      Alert.alert("Registration failed", message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Create an Account</Text>

          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                style={styles.input}
              />
            </View>

            <View style={styles.nameField}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="Enter age"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoComplete="new-password"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
            </Text>

            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 520,
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#4B5563",
    backgroundColor: "#111111",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 32,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  nameField: {
    flex: 1,
    minWidth: 0,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#6B7280",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#FFFFFF",
    backgroundColor: "#000000",
    fontSize: 14,
  },
  button: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9333EA",
    paddingVertical: 13,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  loginContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  loginLink: {
    color: "#C084FC",
    fontSize: 14,
    fontWeight: "700",
  },
});
