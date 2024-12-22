import { Provider } from 'react-redux';
import { store, persistor, wrapper } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
