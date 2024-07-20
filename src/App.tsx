import React, { Suspense, useEffect, useState } from 'react';
import RoutesPro from './Routes';
import { Provider } from 'react-redux';
import { persistor, store } from './store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import lightTheme from './components/theme/lightTheme';
import darkTheme from './components/theme/darkTheme';
import MUIWrapper from './components/muiWrapper';
import { CssBaseline } from '@mui/material';

export default function App() {
  const [theme, setTheme] = useState(lightTheme);

  const getTheme = localStorage.getItem('theme');
  useEffect(() => {
    getTheme == 'light' ? setTheme(lightTheme) : setTheme(darkTheme);
  }, [theme]);

  return (
    <Provider store={store}>
      <MUIWrapper>
        <CssBaseline />
        <PersistGate loading={null} persistor={persistor}>
          <Suspense fallback={<div>Loading.......</div>}>
            <RoutesPro />
          </Suspense>
        </PersistGate>
      </MUIWrapper>
    </Provider>
  );
}
