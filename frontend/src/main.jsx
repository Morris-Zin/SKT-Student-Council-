import { Suspense } from 'react';

import { Provider } from 'react-redux';

import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';

import { HelmetProvider } from 'react-helmet-async';

import App from './app';

import store from './store';

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading ... </div>}>
          <App />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </Provider>
);
