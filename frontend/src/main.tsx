import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from './App.tsx';
import { store } from './redux/store.ts';
import { Provider } from 'react-redux';
import './index.css';
import { RouterProvider } from 'react-router-dom'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from "@/components/ui/sonner"


const persist = persistStore(store);


createRoot(document.getElementById('root')!).render(


    <Provider store={store}>
      <StrictMode>
        <Toaster />
        <PersistGate loading={null} persistor={persist}>
          <RouterProvider router ={router} />
        </PersistGate>
      </StrictMode>
    </Provider>
  
)
