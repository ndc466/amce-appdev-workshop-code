import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from '../reducers/rootReducer';

/* const persistConfig = {
  key: 'root',
  storage,
} */

//const persistedReducer = persistReducer(persistConfig, rootReducer)

export default function configureStore() {
  let store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
  );
  let persistor = persistStore(store);
  //persistor.purge();
  return { store, persistor };
}