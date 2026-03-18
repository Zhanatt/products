import { useState, useEffect } from 'react'

const SHEET_ID = '1gmd1TgEDIWEC7MBRaornVg3Yc1_DEkzJpeHuYhSauOk'
const SHEET_NAME = 'общий'
const API_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`

function isJunk(v) {
  if (!v) return true
  return v.startsWith('http') || v.includes('.png') || v.includes('.jpg') || v.startsWith('Канал ')
}

function toDirectUrl(url) {
  if (!url) return null
  // Конвертируем ссылку Google Drive в прямую ссылку на изображение
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`
  return url
}

export function useSheets() {
  const [tree, setTree] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL)
      const text = await res.text()
      // Google возвращает не чистый JSON, убираем обёртку
      const json = JSON.parse(text.replace(/^[^{]*/, '').replace(/[^}]*$/, ''))
      const rows = json.table.rows

      const result = {}
      let curKanal = '', curSet = '', curProd = ''
      let curKanalPhoto = null, curSetPhoto = null

      rows.forEach(row => {
        if (!row.c) return
        const get = i => row.c[i]?.v ? String(row.c[i].v).trim() : ''

        const a = get(0)  // Канал
        const b = get(1)  // Set
        const c = get(2)  // Продукт
        const d = get(3)  // Название продукта
        const h = get(8)  // Ссылка на образы (столбец I)
        const j = get(9)  // Ссылка на паспорт (столбец J)

        if (a && !isJunk(a) && a !== curKanal) {
          curKanal = a; curSet = ''; curProd = ''
          curKanalPhoto = null
        }
        if (b && !isJunk(b) && b !== curSet) {
          curSet = b; curProd = ''
          curSetPhoto = h ? toDirectUrl(h) : null
        }
        if (c && !isJunk(c) && c !== curProd) {
          curProd = c
        }

        if (!d || !curKanal) return

        if (!result[curKanal]) result[curKanal] = { sets: {} }
        if (!result[curKanal].sets[curSet]) {
          result[curKanal].sets[curSet] = {
            photo: curSetPhoto,
            products: {}
          }
        }
        if (!result[curKanal].sets[curSet].products[curProd]) {
          result[curKanal].sets[curSet].products[curProd] = []
        }

        result[curKanal].sets[curSet].products[curProd].push({
          name: d,
          photo: h ? toDirectUrl(h) : null,
          passport: j || null
        })
      })

      setTree(result)
      setLastUpdated(new Date())
      setError(null)
    } catch (e) {
      setError('Не удалось загрузить данные: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return { tree, loading, error, lastUpdated, reload: load }
}
