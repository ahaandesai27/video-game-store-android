import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { decodeToken, isExpired } from "react-jwt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onTokenChange, emitTokenChange } from "../utils/eventEmitter";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

interface JwtPayload {
  userId: string;
  name?: string;
  exp?: number;
  iat?: number;
}

export interface UserContextValue {
  token: string | null;
  userId: string | null;
  userName: string | null;
  isLoggedIn: boolean;
  userGames: Set<string> | null;
  userPreferences: string[] | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface UserProviderProps {
  children: ReactNode;
}

const GET_USER_INFO = gql`
  query GetUserGames($id: ID!) {
    user(_id: $id) {
      ownedGames {
        _id
      }
      preferences {
        _id
      }
    }
  }
`;

const UserContext = createContext<UserContextValue>({
  token: null,
  userId: null,
  userName: null,
  isLoggedIn: false,
  userGames: null,
  userPreferences: null,
  login: async () => {},
  logout: async () => {},
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const applyToken = useCallback((rawToken: string | null) => {
    if (!rawToken || isExpired(rawToken)) {
      setToken(null);
      setUserId(null);
      setUserName(null);
      return;
    }

    try {
      const decoded = decodeToken<JwtPayload>(rawToken);
      if (decoded?.userId) {
        setToken(rawToken);
        setUserId(decoded.userId);
        setUserName(decoded.name || null);
        return;
      }
    } catch {
      // invalid token format
    }

    setToken(null);
    setUserId(null);
    setUserName(null);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("token")
      .then((storedToken) => {
        applyToken(storedToken);
      })
      .catch((err) => {
        console.error("Failed to read token from AsyncStorage", err);
      });

    const unsubscribe = onTokenChange((newToken) => {
      applyToken(newToken);
    });

    return () => unsubscribe();
  }, [applyToken]);

  const { data } = useQuery<{
    user: {
      ownedGames: { _id: string }[];
      preferences: { _id: string }[];
    };
  }>(GET_USER_INFO, {
    variables: { id: userId },
    skip: !userId,
    fetchPolicy: "network-only",
  });

  const [userGames, setUserGames] = useState<Set<string> | null>(null);
  const [userPreferences, setUserPreferences] = useState<string[] | null>(null);

  useEffect(() => {
    if (userId && data?.user) {
      setUserGames(new Set((data.user.ownedGames || []).map((game: any) => game._id)));
      setUserPreferences((data.user.preferences || []).map((preference: any) => preference._id));
    } else if (!userId) {
      setUserGames(null);
      setUserPreferences(null);
    }
  }, [data, userId]);

  const login = async (newToken: string) => {
    await AsyncStorage.setItem("token", newToken);
    applyToken(newToken);
    emitTokenChange(newToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    applyToken(null);
    emitTokenChange(null);
  };

  return (
    <UserContext.Provider
      value={{
        token,
        userId,
        userName,
        isLoggedIn: !!userId,
        userGames,
        userPreferences,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
