import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto',
      textAlign: 'center' 
    }}>
      <h1>404 - Page Not Found</h1>
      <p>申し訳ありません。お探しのページは見つかりませんでした。</p>
      <Link 
        to="/" 
        style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '8px 16px',
          backgroundColor: '#2196F3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}
      >
        ホームに戻る
      </Link>
    </div>
  );
}

export default NotFound;