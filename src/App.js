/**
 * CoCoCアプリのメインコンポーネント
 */
import React from 'react';
import RouteConfig from './routes/RouteConfig';

// スタイルのインポート
import './styles/global/variables.css';
import './styles/global/components.css';
import './styles/global/layout.css';

function App() {
  return (
    <div className="app-container">
      <RouteConfig />
    </div>
  );
}

export default App;