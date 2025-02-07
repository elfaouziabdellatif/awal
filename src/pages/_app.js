import { Provider, useDispatch } from 'react-redux';
import { store, persistor, wrapper } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useSelector } from 'react-redux';
import '../styles/globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { SocketProvider } from '../context/useSocket';
import Navbar from '../components/layout/navbar';
import { useEffect } from 'react';
import apiClient, { configureInterceptors} from '../utils/apiclient';

function MyApp({ Component, pageProps }) {
  const user = useSelector((state) => state.user);
  const userInfo = user.userInfo;
  const isLoggedIn = user.token ? true : false;

  const dispatch = useDispatch(); // Access dispatch function

  // Configure Axios interceptors once on app load
  useEffect(() => {
    configureInterceptors(dispatch);
  }, [dispatch]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Conditionally wrap with SocketProvider if logged in */}
        {isLoggedIn ? (
          <SocketProvider token={userInfo.token}>
            <Navbar userInfo={userInfo}></Navbar>
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
