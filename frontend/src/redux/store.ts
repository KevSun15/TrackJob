import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import authReducer from './authSlice';
import jobReducer from './jobSlice';
import companyReducer from './companySlice';
import applicationReducer from './applicationSlice';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
}

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    jobs: jobReducer,
    companies: companyReducer,
    applications: applicationReducer
})


const persistedReducer = persistReducer(persistConfig, rootReducer)



export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]},
              }).concat(apiSlice.middleware),
  
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;