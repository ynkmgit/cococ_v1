import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome to COCOC2</h1>
      
      <nav style={{ marginBottom: '2rem' }}>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '1rem' }}>
          <li>
            <Link 
              to="/demo" 
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196F3',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              デモページへ
            </Link>
          </li>
        </ul>
      </nav>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>About</h2>
        <p>
          COCOC2は、FastAPIとReactを使用したシンプルなWebアプリケーションです。
          現在は開発中で、基本的なCRUD操作のデモが利用可能です。
        </p>
      </section>
    </div>
  );
}

export default Home;