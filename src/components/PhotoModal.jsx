import { useEffect } from 'react'

export default function PhotoModal({ item, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  if (!item) return null

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(61,74,82,0.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        maxWidth: 480, width: '100%'
      }}>
        {/* Шапка модала в стиле брендбука — домик */}
        <div style={{
          background: '#3d4a52', padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <svg width="20" height="17" viewBox="0 0 28 24" fill="none">
            <path d="M14 0L0 10H4L14 3L24 10H28L14 0Z" fill="#e10523"/>
            <rect x="0" y="10" width="5" height="14" rx="1" fill="#e10523"/>
            <rect x="23" y="10" width="5" height="14" rx="1" fill="#e10523"/>
            <rect x="5" y="13" width="18" height="4" rx="1" fill="#e10523"/>
          </svg>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', flex: 1 }}>
            {item.type === 'set' ? 'СЕТ' : 'ПРОДУКТ'}
          </span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
            fontSize: 18, cursor: 'pointer', padding: '0 4px', lineHeight: 1
          }}>✕</button>
        </div>

        {/* Фото */}
        {item.photo ? (
          <img src={item.photo} alt={item.name} style={{
            width: '100%', display: 'block', maxHeight: 380,
            objectFit: 'contain', background: '#f5f5f3'
          }} onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div style={{
            height: 200, background: '#f5f5f3',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            <svg width="40" height="34" viewBox="0 0 28 24" fill="none" style={{ opacity: 0.15 }}>
              <path d="M14 0L0 10H4L14 3L24 10H28L14 0Z" fill="#e10523"/>
              <rect x="0" y="10" width="5" height="14" rx="1" fill="#3d4a52"/>
              <rect x="23" y="10" width="5" height="14" rx="1" fill="#3d4a52"/>
              <rect x="5" y="13" width="18" height="4" rx="1" fill="#3d4a52"/>
            </svg>
            <p style={{ color: '#7d96a0', fontSize: 13 }}>Фото не добавлено</p>
          </div>
        )}

        {/* Инфо */}
        <div style={{ padding: '16px 20px 20px' }}>
          <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#3d4a52', letterSpacing: '0.02em' }}>
            {item.name}
          </p>
          {item.type && (
            <p style={{ fontSize: 12, color: '#7d96a0', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {item.type === 'set' ? 'Сет / Комплект' : item.type === 'item' ? 'Товар' : item.type}
            </p>
          )}
          {item.passport && (
            <a href={item.passport} target="_blank" rel="noreferrer" style={{
              display: 'inline-block', marginTop: 14, fontSize: 13,
              color: '#e10523', textDecoration: 'none',
              borderBottom: '1px solid #e10523', paddingBottom: 2
            }}>
              Открыть паспорт продукта →
            </a>
          )}
        </div>

        {/* Красная полоска снизу как в брендбуке */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #e10523, #ff6b35, #ffa500)' }} />
      </div>
    </div>
  )
}
