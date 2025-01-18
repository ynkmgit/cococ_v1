import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// APIのベースURL
const API_BASE_URL = 'http://localhost:8000/api/v1';

function Demo() {
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editMessage, setEditMessage] = useState(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages?active_only=${showActiveOnly}`);
      setMessages(response.data);
    } catch (error) {
      console.error('メッセージ一覧の取得に失敗:', error);
    }
  }, [showActiveOnly]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMessage) {
        await axios.put(`${API_BASE_URL}/messages/${editMessage.id}`, {
          title,
          content
        });
        setEditMessage(null);
      } else {
        await axios.post(`${API_BASE_URL}/messages`, {
          title,
          content
        });
      }
      setTitle('');
      setContent('');
      fetchMessages();
    } catch (error) {
      console.error('メッセージの送信に失敗:', error);
    }
  };

  const handleEdit = (message) => {
    setEditMessage(message);
    setTitle(message.title);
    setContent(message.content);
  };

  const handleDelete = async (id) => {
    if (window.confirm('このメッセージを削除しますか？')) {
      try {
        await axios.delete(`${API_BASE_URL}/messages/${id}`);
        fetchMessages();
      } catch (error) {
        console.error('メッセージの削除に失敗:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>メッセージ管理デモ</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>{editMessage ? 'メッセージの編集' : 'メッセージの作成'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
            required
            style={{ 
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="内容を入力"
            required
            style={{ 
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              minHeight: '100px'
            }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {editMessage ? '更新' : '作成'}
            </button>
            {editMessage && (
              <button 
                type="button"
                onClick={() => {
                  setEditMessage(null);
                  setTitle('');
                  setContent('');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                キャンセル
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
          />
          アクティブなメッセージのみ表示
        </label>
      </div>

      <div>
        <h2>メッセージ一覧</h2>
        {messages.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {messages.map((message) => (
              <div 
                key={message.id}
                style={{
                  padding: '15px',
                  backgroundColor: message.is_active ? '#f5f5f5' : '#e0e0e0',
                  borderRadius: '4px',
                  opacity: message.is_active ? 1 : 0.7
                }}
              >
                <h3 style={{ margin: '0 0 10px 0' }}>{message.title}</h3>
                <p style={{ margin: '0 0 10px 0' }}>{message.content}</p>
                <div style={{ fontSize: '0.8em', color: '#666' }}>
                  <div>作成: {new Date(message.created_at).toLocaleString('ja-JP')}</div>
                  <div>更新: {new Date(message.updated_at).toLocaleString('ja-JP')}</div>
                </div>
                {message.is_active && (
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEdit(message)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(message.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      削除
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>メッセージはまだありません</p>
        )}
      </div>
    </div>
  );
}

export default Demo;