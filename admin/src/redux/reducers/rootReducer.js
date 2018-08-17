import { combineReducers } from 'redux';
import loanListReducer from './loanListReducer';
import amceReducer from './amceReducer';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

/* const loanListConfig = {
  key: 'loanList',
  storage: storage,
  blacklist: ['loans']
} */

const amceConfig = {
  key: 'amce',
  storage: storage
}

const appReducer = combineReducers({
  amce: persistReducer(amceConfig, amceReducer),
  loanList: loanListReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    Object.keys(state).forEach(key => {
      storage.removeItem(`persist:${key}`);
    });
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer;