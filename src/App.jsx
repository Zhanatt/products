import { useState } from 'react'
import { useSheets } from './hooks/useSheets'
import MindMap from './components/MindMap'
import PhotoModal from './components/PhotoModal'

const ADMIN_PASSWORD = 'matkasym2024'

const LOGO = `<svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 2L6 10V8L16 0L26 8V10L16 2Z" fill="#e10523"/>
  <rect x="6" y="10" width="4" height="16" fill="#e10523"/>
  <rect x="22" y="10" width="4" height="16" fill="#e10523"/>
  <path d="M10 14H22V18H10Z" fill="#e10523"/>
</svg>`

export default function App() {
  const { tree, loading, error, lastUpdated, reload } = useSheets()
  const [selectedNode, setSelectedNode] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true); setShowLogin(false); setLoginError('')
    } else {
      setLoginError('Неверный пароль')
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '"Inter", system-ui, sans-serif', background: '#f5f5f3' }}>

      {/* Шапка в стиле MATKASYM */}
      <div style={{
        padding: '0 20px', background: '#fff',
        borderBottom: '1px solid #e8e8e6',
        display: 'flex', alignItems: 'center', gap: 14,
        height: 56, flexShrink: 0, zIndex: 10
      }}>
        {/* Логотип SVG */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
            <path d="M14 0L0 10H4L14 3L24 10H28L14 0Z" fill="#e10523"/>
            <rect x="0" y="10" width="5" height="14" rx="1" fill="#e10523"/>
            <rect x="23" y="10" width="5" height="14" rx="1" fill="#e10523"/>
            <rect x="5" y="13" width="18" height="4" rx="1" fill="#e10523"/>
          </svg>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.08em', color: '#3d4a52' }}>MATKASYM</span>
        </div>

        <div style={{ width: 1, height: 24, background: '#e8e8e6' }} />

        <span style={{ fontSize: 13, color: '#7d96a0', flex: 1 }}>
          Каталог продуктов
          {lastUpdated && <span style={{ marginLeft: 8, fontSize: 11 }}>· {lastUpdated.toLocaleTimeString('ru')}</span>}
        </span>

        <button onClick={reload} style={{
          padding: '6px 14px', borderRadius: 6,
          border: '1px solid #e8e8e6', background: '#fff',
          fontSize: 12, cursor: 'pointer', color: '#7d96a0',
          display: 'flex', alignItems: 'center', gap: 4
        }}>↺ Обновить</button>

        {isAdmin ? (
          <div style={{ padding: '4px 12px', borderRadius: 20, background: '#e10523', color: '#fff', fontSize: 12, fontWeight: 600 }}>
            Админ
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} style={{
            padding: '6px 14px', borderRadius: 6,
            border: '1px solid #e10523', background: '#fff',
            color: '#e10523', fontSize: 12, cursor: 'pointer', fontWeight: 600
          }}>Войти</button>
        )}
      </div>

      {/* Подсказка */}
      <div style={{
        padding: '6px 20px', background: '#3d4a52',
        fontSize: 11, color: 'rgba(255,255,255,0.7)', flexShrink: 0,
        display: 'flex', gap: 16
      }}>
        <span>◉ Нажми на узел — раскрыть/скрыть</span>
        <span>🖼 Значок — есть фото</span>
        <span>⟲ Зажми и тяни — переместить</span>
      </div>

      {/* Mind Map */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {loading && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: '#f5f5f3', flexDirection: 'column', gap: 16
          }}>
            <svg width="40" height="36" viewBox="0 0 28 24" fill="none" style={{ opacity: 0.3, animation: 'pulse 1s ease-in-out infinite' }}>
              <path d="M14 0L0 10H4L14 3L24 10H28L14 0Z" fill="#e10523"/>
              <rect x="0" y="10" width="5" height="14" rx="1" fill="#e10523"/>
              <rect x="23" y="10" width="5" height="14" rx="1" fill="#e10523"/>
              <rect x="5" y="13" width="18" height="4" rx="1" fill="#e10523"/>
            </svg>
            <p style={{ color: '#7d96a0', fontSize: 14 }}>Загружаем каталог...</p>
          </div>
        )}
        {error && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #f0c0c0', maxWidth: 400, textAlign: 'center' }}>
              <p style={{ color: '#e10523', fontSize: 14, marginBottom: 16 }}>{error}</p>
              <button onClick={reload} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#e10523', color: '#fff', cursor: 'pointer' }}>
                Попробовать снова
              </button>
            </div>
          </div>
        )}
        {tree && !loading && <MindMap tree={tree} onNodeClick={setSelectedNode} />}
      </div>

      {selectedNode && <PhotoModal item={selectedNode} onClose={() => setSelectedNode(null)} />}

      {showLogin && (
        <div onClick={() => setShowLogin(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 320
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <svg width="24" height="20" viewBox="0 0 28 24" fill="none">
                <path d="M14 0L0 10H4L14 3L24 10H28L14 0Z" fill="#e10523"/>
                <rect x="0" y="10" width="5" height="14" rx="1" fill="#e10523"/>
                <rect x="23" y="10" width="5" height="14" rx="1" fill="#e10523"/>
                <rect x="5" y="13" width="18" height="4" rx="1" fill="#e10523"/>
              </svg>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#3d4a52', letterSpacing: '0.05em' }}>MATKASYM</h2>
            </div>
            <p style={{ fontSize: 13, color: '#7d96a0', margin: '0 0 16px' }}>Вход для администратора</p>
            <input type="password" placeholder="Пароль" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e8e8e6', fontSize: 14, marginBottom: 8, boxSizing: 'border-box' }}
              autoFocus
            />
            {loginError && <p style={{ color: '#e10523', fontSize: 13, margin: '0 0 8px' }}>{loginError}</p>}
            <button onClick={handleLogin} style={{
              width: '100%', padding: 10, borderRadius: 8, border: 'none',
              background: '#e10523', color: '#fff', fontSize: 14, cursor: 'pointer', fontWeight: 600
            }}>Войти</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}
