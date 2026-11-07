type TokenListener = (token: string | null) => void;

const listeners = new Set<TokenListener>();

export const emitTokenChange = (token: string | null) => {
  listeners.forEach((listener) => {
    try {
      listener(token);
    } catch (error) {
      console.error("Error in token listener:", error);
    }
  });
};

export const onTokenChange = (callback: TokenListener) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};
