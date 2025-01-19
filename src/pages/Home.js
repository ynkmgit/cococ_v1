import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome to CoCoC</h1>

      <nav style={{ marginBottom: '2rem' }}>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '1rem' }}>
          <li>
            <Link
              to="/cococ"
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
          CoCoC(Combat of Call of Cthulhu)は、CoC7版の戦闘を管理するためのツールを目指しています。
        </p>
      </section>
    </div>
  );
}

export default Home;