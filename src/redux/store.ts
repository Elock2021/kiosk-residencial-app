import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  session,
  boxes,
  modules,
  loader,
  order,
  pickup,
  delivery,
  timer,
  codes,
} from "./reducers";

const composeEnhancers = composeWithDevTools({ trace: true });

let intialState: any = {};
try {
  const storage: any = localStorage.getItem("global_state");
  intialState = storage ? JSON.parse(storage) : {};
} catch (error) {
  console.log("Get Storage Error", error);
}

const reducers = combineReducers({
  session,
  boxes,
  modules,
  loader,
  order,
  pickup,
  delivery,
  timer,
  codes,
});

const saver = (store: any) => (next: any) => (action: any) => {
  let stateToSave = store.getState();
  localStorage.setItem("global_state", JSON.stringify({ ...stateToSave }));
  next(action);
};

let store: any;

if (process.env.NODE_ENV === "production") {
  store = createStore(reducers, intialState, applyMiddleware(thunk, saver));
} else {
  store = createStore(
    reducers,
    intialState,
    composeEnhancers(applyMiddleware(thunk, saver))
  );
}

export default store;
