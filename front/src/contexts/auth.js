import { LOGIN_TIMESTAMP_KEY } from 'app-constants';
import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from 'react';
import { signIn as sendSignInRequest } from 'api/auth';
import { userVar } from 'gql-client';
import { useApolloClient } from '@apollo/client';


const AuthProvider = (props) => {
  const [ user, setUser ] = useState();
  const [ loading, setLoading ] = useState(true);
  const gqlClient = useApolloClient();

  useEffect(() => {
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email, password) => {
    const result = await sendSignInRequest(email, password);
    if (result.isOk) {
      setUser(result.data);
      userVar(result.data);
      localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now());
    }
    return result;
  }, []);

  const signOut = useCallback(async () => {
    gqlClient.stop();
    await gqlClient.resetStore();
    setUser(undefined);
  }, []);


  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, loading }}
      {...props}
    />
  );
};

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
