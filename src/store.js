import { applyMiddleware, createStore, compose } from 'redux'
import reducers from './reducers';

import thunk from 'redux-thunk'
const middleware = [thunk]
const enhancers = [
   applyMiddleware(...middleware)
 ]
const store = createStore(
   reducers,
   compose(...enhancers)
)

export default store;