import { Claims, Token } from "@a-novel/connector-authentication/api";

import {
  createContext,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { z } from "zod";

export const SessionSync = z.object({
  claims: Claims.optional(),
  accessToken: Token.optional(),
  refreshToken: Token.optional(),
});

type SessionState = z.infer<typeof SessionSync> | undefined;

export interface SessionContextType {
  /**
   * The active session for the current user.
   */
  session?: z.infer<typeof SessionSync>;
  /**
   * Manually set the session for the current user. The session is automatically synced with local storage.
   */
  setSession: Dispatch<SetStateAction<SessionState>>;
  /**
   * True when session has synced with local storage. Takes at least one update cycle with SSR.
   */
  synced: boolean;
  /**
   * True if the session is invalid or an error occurred while parsing it.
   */
  error?: boolean;
  setError: (error: boolean) => void;
}

export const SessionContext = createContext<SessionContextType>({
  setSession: (() => console.warn(`no session provider found`)) as Dispatch<SetStateAction<SessionState>>,
  synced: false as boolean,
  setError: () => console.warn(`no session provider found`),
});

export interface SessionProviderProps {
  children?: ReactNode;
}

/**
 * Key used to store session information in local storage.
 */
export const SESSION_STORAGE_KEY = "a-novel-session";

/**
 * Validates a session object, and return it if valid. Returns undefined if the session is invalid.
 */
const parseSession = (
  input: unknown,
  /**
   * Callback to be called if the session is valid.
   */
  callback?: (input: z.infer<typeof SessionSync>) => void,
  /**
   * Callback to be called if the session is invalid.
   */
  errorCallback?: (error: unknown) => void
): z.infer<typeof SessionSync> | undefined => {
  try {
    // This line will throw an error if the provided input is not a valid session.
    const session = SessionSync.parse(input);
    // All good from here.
    callback?.(session);
    return session;
  } catch (error) {
    console.error(`invalid session: ${JSON.stringify(input, null, 2)}`);
    errorCallback?.(error);
  }
};

/**
 * Manages session information for the current user.
 *
 * This provider is only responsible from syncing and retrieving session from the environment. It does not perform API
 * calls nor does it manage the session lifecycle.
 */
export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  const [session, setSessionDirect] = useState<z.infer<typeof SessionSync> | undefined>();
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState(false);

  // Wait past the initial server render to access DOM APIs.
  useEffect(() => {
    setSessionDirect(() => {
      // Load initial session from local storage.
      const localSession = localStorage.getItem(SESSION_STORAGE_KEY);

      if (localSession)
        return parseSession(JSON.parse(localSession), undefined, () => {
          // Delete invalid session from local storage.
          localStorage.removeItem(SESSION_STORAGE_KEY);
        });
    });

    setSynced(true);
  }, []);

  const setSession = useCallback<Dispatch<SetStateAction<SessionState>>>((input) => {
    setSessionDirect((prevState) => {
      const newSession = typeof input === "function" ? input(prevState) : input;

      // Update with an undefined session means we want the current session to be removed.
      if (!newSession) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return;
      }

      // Validate and set the new session.
      return parseSession(newSession, (parsed) => {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(parsed));
      });
    });
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession, synced, error, setError }}>
      {children}
    </SessionContext.Provider>
  );
};

/**
 * Return the current active session. This can be null if no session is active.
 */
export const useSession = (): SessionContextType => useContext(SessionContext);

/**
 * Return the current access token. This can be an empty string if no session is active.
 */
export const useAccessToken = (): string => {
  const { session } = useSession();
  return session?.accessToken ?? "";
};
