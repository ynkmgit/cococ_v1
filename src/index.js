/**
 * アプリケーションのエントリーポイント
 * 
 * Reactアプリケーションの初期化とDOMへのマウントを行います
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// DOMのルート要素を取得し、Reactアプリケーションを初期化
const root = ReactDOM.createRoot(document.getElementById('root'));

// アプリケーションをレンダリング
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);