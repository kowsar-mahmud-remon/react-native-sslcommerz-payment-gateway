import * as Google from 'expo-auth-session/providers/google';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      const auth = getAuth();
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          setUser(userCredential.user);
        })
        .catch((error) => {
          console.error('Authentication error:', error);
        });
    }
  }, [response]);

  return [user, promptAsync];
};
