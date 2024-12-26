import { Provider } from 'react-redux';
import { store, persistor, wrapper } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useSelector } from 'react-redux';
import '../styles/globals.css';
import { SocketProvider } from '../context/useSocket';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const userInfo = useSelector((state) => state.user.userInfo);
  const isLoggedIn = userInfo;
  useEffect(() => {
    console.log('User info:', userInfo);
  }, [userInfo]);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Conditionally wrap with SocketProvider if logged in */}
        {isLoggedIn ? (
          <SocketProvider userInfo={userInfo}>
            <Component {...pageProps} />
          </SocketProvider>
        ) : (
          <Component {...pageProps} />
        )}
      </PersistGate>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
