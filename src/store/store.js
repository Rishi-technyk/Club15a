// src/store/configureStore.js

import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers/index';
import rootSaga from './sagas/rootSaga'; // Import the root saga
import AsyncStorage from '@react-native-async-storage/async-storage';

// import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage, // AsyncStorage for React Native
//   whitelist: ['auth'] // Reducer states to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  persistedReducer,
  // rootReducer,
  applyMiddleware(sagaMiddleware)
);

const persistor = persistStore(store);


sagaMiddleware.run(rootSaga); // Run the root saga

export { store, persistor };
