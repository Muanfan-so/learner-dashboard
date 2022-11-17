/* eslint-disable import/prefer-default-export */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';

import store from 'data/store';
import {
  APP_READY,
  APP_INIT_ERROR,
  initialize,
  subscribe,
  mergeConfig,
} from '@edx/frontend-platform';

import { messages as footerMessages } from '@edx/frontend-component-footer';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import { configuration } from './config';

import messages from './i18n';

import App from './App';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <IntlProvider locale="en">
      <AppProvider store={store}>
        <App />
      </AppProvider>
    </IntlProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(
    <ErrorPage message={error.message} />,
    document.getElementById('root'),
  );
});

export const appName = 'LearnerHomeAppConfig';

// TODO: remove dev debug
console.log({ SEGEMENT_KEY: process.env.SEGMENT_KEY });

initialize({
  handlers: {
    config: () => {
      mergeConfig(configuration, appName);
    },
  },
  messages: [
    messages,
    footerMessages,
  ],
  requireAuthenticatedUser: true,
});
