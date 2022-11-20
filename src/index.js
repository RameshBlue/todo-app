import React from 'react'
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'
import App from './App';
import TodoReducer from './features/TodoReducer';

export const store = configureStore({
  reducer:{
    todos: TodoReducer
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <App />
    </Provider>
);
