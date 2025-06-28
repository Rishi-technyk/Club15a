// src/sagas/rootSaga.js

import { all } from 'redux-saga/effects';
import { authSaga } from './authSaga'; // Import your individual sagas

function* rootSaga() {
  yield all([
    authSaga(),
    // Add other sagas here as needed
  ]);
}

export default rootSaga;
