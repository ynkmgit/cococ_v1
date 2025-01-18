/**
 * CoCoCアプリのメインコンポーネント
 */
import React from 'react';
import RouteConfig from './routes/RouteConfig';

// スタイルのインポート
import './styles/variables.css';
import './styles/components.css';
import './pages/Cococ/styles/layout.css';  // パスを更新

function App() {
  return (
    <div className="app-container">
      <RouteConfig />
    </div>
  );
}

export default App;