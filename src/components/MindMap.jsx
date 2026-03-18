import { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'

// Цвета из брендбука MATKASYM
const COLORS = {
  root:    { fill: '#3d4a52', stroke: '#2a343b', text: '#ffffff' },
  kanal:   { fill: '#e10523', stroke: '#c00018', text: '#ffffff' },
  set:     { fill: '#7d96a0', stroke: '#5a7a87', text: '#ffffff' },
  product: { fill: '#ffffff', stroke: '#7d96a0', text: '#3d4a52' },
  item:    { fill: '#f5f5f3', stroke: '#d4d4d0', text: '#3d4a52' },
}

function treeToD3(tree) {
  const root = { name: 'MATKASYM', type: 'root', children: [] }
  Object.entries(tree).forEach(([kanal, kData]) => {
    const kNode = { name: kanal, type: 'kanal', children: [] }
    Object.entries(kData.sets).forEach(([set, sData]) => {
      const sNode = { name: set || '—', type: 'set', photo: sData.photo, children: [] }
      Object.entries(sData.products).forEach(([prod, items]) => {
        const pNode = { name: prod || '—', type: 'product', children: [] }
        items.forEach(item => {
          pNode.children.push({ name: item.name, type: 'item', photo: item.photo, passport: item.passport })
        })
        sNode.children.push(pNode)
      })
      kNode.children.push(sNode)
    })
    root.children.push(kNode)
  })
  return root
}

function countLeaves(node) {
  if (!node.children || !node.children.length) return 1
  return node.children.reduce((s, c) => s + countLeaves(c), 0)
}

export default function MindMap({ tree, onNodeClick }) {
  const svgRef = useRef(null)

  const draw = useCallback(() => {
    if (!tree || !svgRef.current) return
    const data = treeToD3(tree)
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth || window.innerWidth
    const height = svgRef.current.clientHeight || window.innerHeight

    const g = svg.append('g')

    const zoom = d3.zoom().scaleExtent([0.05, 3]).on('zoom', e => g.attr('transform', e.transform))
    svg.call(zoom)

    const root = d3.hierarchy(data)
    root.descendants().forEach(d => {
      if (d.depth >= 2 && d.children) { d._children = d.children; d.children = null }
    })

    const treeLayout = d3.tree().nodeSize([52, 260])

    function update() {
      treeLayout(root)
      const nodes = root.descendants()
      const links = root.links()

      // Линии
      g.selectAll('.link').data(links, d => d.target.id || (d.target.id = Math.random()))
        .join('path').attr('class', 'link').attr('fill', 'none')
        .attr('stroke', '#d4d4d0').attr('stroke-width', 1)
        .attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x))

      // Узлы
      const node = g.selectAll('.node')
        .data(nodes, d => d.id || (d.id = Math.random()))
        .join('g').attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .style('cursor', 'pointer')
        .on('click', (event, d) => {
          event.stopPropagation()
          if ((d.data.photo || d.data.passport) && d.data.type !== 'root') {
            onNodeClick({ name: d.data.name, photo: d.data.photo, passport: d.data.passport, type: d.data.type })
            return
          }
          if (d.children) { d._children = d.children; d.children = null }
          else if (d._children) { d.children = d._children; d._children = null }
          update()
        })

      const col = d => COLORS[d.data.type] || COLORS.item
      const W = 170, H = 38

      node.selectAll('rect').data(d => [d]).join('rect')
        .attr('x', -W/2).attr('y', -H/2)
        .attr('width', W).attr('height', H).attr('rx', d => d.data.type === 'root' ? 4 : 6)
        .attr('fill', d => col(d).fill).attr('stroke', d => col(d).stroke).attr('stroke-width', 1)

      // Иконка фото
      node.selectAll('.photo-icon').data(d => d.data.photo ? [d] : [])
        .join('text').attr('class', 'photo-icon')
        .attr('x', W/2 - 16).attr('y', 5)
        .attr('font-size', 11).attr('text-anchor', 'middle').text('🖼')

      // Текст
      node.selectAll('text.label').data(d => [d])
        .join('text').attr('class', 'label')
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
        .attr('font-size', d => ['root','kanal'].includes(d.data.type) ? 13 : 11)
        .attr('font-weight', d => ['root','kanal','set'].includes(d.data.type) ? 700 : 400)
        .attr('fill', d => col(d).text)
        .attr('x', d => d.data.photo ? -6 : 0)
        .text(d => d.data.name.length > 20 ? d.data.name.slice(0, 20) + '…' : d.data.name)

      // Счётчик
      node.selectAll('text.count').data(d => (d.children || d._children) ? [d] : [])
        .join('text').attr('class', 'count')
        .attr('x', W/2 + 14).attr('y', 5)
        .attr('font-size', 10).attr('fill', '#7d96a0').attr('text-anchor', 'middle')
        .text(d => {
          const arr = d._children || d.children || []
          return arr.reduce((s,c) => s + countLeaves(c), 0) || ''
        })

      // Центрирование при первом рендере
      if (!svgRef.current._centered) {
        svgRef.current._centered = true
        setTimeout(() => {
          const b = g.node().getBBox()
          if (!b.width) return
          const scale = Math.min(0.75, width / (b.width + 120), height / (b.height + 80))
          svg.call(zoom.transform, d3.zoomIdentity
            .translate(width/2 - (b.x + b.width/2)*scale, height/2 - (b.y + b.height/2)*scale)
            .scale(scale))
        }, 100)
      }
    }

    update()
  }, [tree, onNodeClick])

  useEffect(() => { draw() }, [draw])
  useEffect(() => {
    const h = () => draw()
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [draw])

  return <svg ref={svgRef} style={{ width: '100%', height: '100%', display: 'block', background: '#f5f5f3' }} />
}
