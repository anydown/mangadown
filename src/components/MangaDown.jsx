import React, { useState, useEffect, useRef } from 'react'
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import useImage from 'use-image'
import { example } from './example'
import { compile } from './compile'
import { drawKomas } from './draw'

const w = 420 + 20 * 2
const h = (280 + 20) * 4 + 20

const loadedFonts = {}

// Component for rendering stamps on Konva
const StampImage = ({ src, x, y, onSelect, isSelected, onDragEnd, id }) => {
  const [image] = useImage(src)
  const imageRef = useRef()

  return (
    <KonvaImage
      image={image}
      x={x}
      y={y}
      ref={imageRef}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onDragEnd(id, e.target.x(), e.target.y())
      }}
      shadowBlur={isSelected ? 10 : 0}
      shadowColor={isSelected ? 'blue' : ''}
    />
  )
}

function MangaDown() {
  const [rawinput, setRawinput] = useState(example)
  const [font, setFont] = useState('yasashisa')
  const [images, setImages] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [mangaImage, setMangaImage] = useState(null)
  
  const canvasRef = useRef(null)
  const stageRef = useRef(null)
  const outputCanvasRef = useRef(null)
  const exportCanvasRef = useRef(null)

  const input = compile(rawinput)

  const redraw = () => {
    const canvas = outputCanvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, w, h)
    drawKomas(ctx, input, font)
    
    // Convert canvas to image for Konva background
    const dataUrl = canvas.toDataURL()
    const img = new window.Image()
    img.src = dataUrl
    img.onload = () => {
      setMangaImage(img)
    }
  }

  useEffect(() => {
    redraw()
  }, [input, font])

  useEffect(() => {
    const fontName = font
    if (!loadedFonts[font]) {
      const fonts = {
        yasashisa: 'url(/assets/07YasashisaAntique.otf)',
        'noto-tc': 'url(/assets/NotoSerifTC-Regular.otf)',
      }

      const fontFace = new FontFace(font, fonts[font], {})
      fontFace.load().then((loadedFace) => {
        document.fonts.add(loadedFace)
        loadedFonts[font] = true
        setTimeout(() => {
          redraw()
        }, 100)
      })
    } else {
      setTimeout(() => {
        redraw()
      }, 100)
    }
  }, [font])

  const addImage = (imgName) => {
    const newImage = {
      id: Date.now().toString(),
      src: `/assets/${imgName}.png`,
      x: 100,
      y: 100,
    }
    setImages([...images, newImage])
  }

  const handleDragEnd = (id, newX, newY) => {
    setImages(images.map((img) => {
      if (img.id === id) {
        return { ...img, x: newX, y: newY }
      }
      return img
    }))
  }

  const removeObj = () => {
    if (selectedId) {
      setImages(images.filter((img) => img.id !== selectedId))
      setSelectedId(null)
    }
  }

  const exportImage = () => {
    if (!stageRef.current || !outputCanvasRef.current) return
    
    // Clear selection before export
    setSelectedId(null)
    
    setTimeout(() => {
      const exportCanvas = exportCanvasRef.current
      const destCtx = exportCanvas.getContext('2d')
      
      destCtx.fillStyle = 'white'
      destCtx.fillRect(0, 0, w, h)
      
      // Draw the manga panels
      destCtx.drawImage(outputCanvasRef.current, 0, 0)
      
      // Draw the Konva stage
      const konvaCanvas = stageRef.current.toCanvas()
      destCtx.drawImage(konvaCanvas, 0, 0, w, h)
      
      const a = document.createElement('a')
      a.href = exportCanvas.toDataURL('image/png')
      a.setAttribute('download', 'comic.png')
      a.dispatchEvent(new MouseEvent('click'))
    }, 100)
  }

  const handleFileUpload = (e) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const newImage = {
        id: Date.now().toString(),
        src: event.target.result,
        x: 100,
        y: 100,
      }
      setImages([...images, newImage])
    }
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }
  }

  useEffect(() => {
    const handleKeyUp = (ev) => {
      if (ev.keyCode === 46) {
        removeObj()
      }
    }
    window.addEventListener('keyup', handleKeyUp)
    return () => window.removeEventListener('keyup', handleKeyUp)
  }, [selectedId, images])

  return (
    <div className="row">
      <div className="column">
        <div className="wrapper canvas-wrapper">
          <canvas
            ref={outputCanvasRef}
            id="output"
            width={w}
            height={h}
            style={{ width: `${w}px`, height: `${h}px` }}
          />
          <div style={{ position: 'absolute', top: 0, left: 0 }}>
            <Stage
              width={w}
              height={h}
              ref={stageRef}
              onClick={(e) => {
                // Deselect when clicking on empty area
                if (e.target === e.target.getStage()) {
                  setSelectedId(null)
                }
              }}
            >
              <Layer>
                {images.map((img) => (
                  <StampImage
                    key={img.id}
                    id={img.id}
                    src={img.src}
                    x={img.x}
                    y={img.y}
                    isSelected={img.id === selectedId}
                    onSelect={() => setSelectedId(img.id)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>

      <div className="controls column">
        <textarea
          id="input"
          value={rawinput}
          onChange={(e) => setRawinput(e.target.value)}
        />

        <div>
          <button onClick={exportImage} className="button" style={{ width: '100%' }}>
            PNG形式で保存
          </button>

          <div className="row">
            <div className="column column-50">
              <button
                onClick={removeObj}
                className="button button-outline"
                style={{ width: '100%', height: '5rem', lineHeight: '5rem' }}
              >
                <svg
                  className="svgicon"
                  id="i-trash"
                  viewBox="0 0 32 32"
                  width="28"
                  height="28"
                  fill="none"
                  stroke="currentcolor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M28 6 L6 6 8 30 24 30 26 6 4 6 M16 12 L16 24 M21 12 L20 24 M11 12 L12 24 M12 6 L13 2 19 2 20 6" />
                </svg>
                選択中の図形を削除
              </button>
            </div>
          </div>

          <div>
            <h3>font</h3>
            <select value={font} onChange={(e) => setFont(e.target.value)}>
              <option value="yasashisa">やさしさアンティーク</option>
              <option value="noto-tc">Noto Traditional Chinese</option>
            </select>
          </div>

          <div className="stamp-box">
            <h3 className="stamp-title">スタンプ</h3>
            <div>
              <img className="stamp" onClick={() => addImage('hage01')} src="/assets/hage01.png" />
              <img className="stamp" onClick={() => addImage('hage02')} src="/assets/hage02.png" />
              <img className="stamp" onClick={() => addImage('hage03')} src="/assets/hage03.png" />
              <img className="stamp" onClick={() => addImage('hage04')} src="/assets/hage04.png" />
              <img className="stamp" onClick={() => addImage('hage05')} src="/assets/hage05.png" />
              <img className="stamp" onClick={() => addImage('hage06')} src="/assets/hage06.png" />
              <img className="stamp" onClick={() => addImage('hage07')} src="/assets/hage07.png" />
              <img className="stamp" onClick={() => addImage('hage08')} src="/assets/hage08.png" />
              <img className="stamp" onClick={() => addImage('hage09')} src="/assets/hage09.png" />
              <img className="stamp" onClick={() => addImage('hage10')} src="/assets/hage10.png" />
              <img className="stamp" onClick={() => addImage('hage11')} src="/assets/hage11.png" />
              <img className="stamp" onClick={() => addImage('hage12')} src="/assets/hage12.png" />
              <img className="stamp" onClick={() => addImage('hage13')} src="/assets/hage13.png" />
              <img className="stamp" onClick={() => addImage('fx01')} src="/assets/fx01.png" />
              <img className="stamp" onClick={() => addImage('fx02')} src="/assets/fx02.png" />
              <img className="stamp" onClick={() => addImage('moji01')} src="/assets/moji01.png" />
              <img className="stamp" onClick={() => addImage('moji02')} src="/assets/moji02.png" />
              <img className="stamp" onClick={() => addImage('moji03')} src="/assets/moji03.png" />
              <img className="stamp" onClick={() => addImage('moji04')} src="/assets/moji04.png" />
              <img className="stamp" onClick={() => addImage('moji05')} src="/assets/moji05.png" />
              <img className="stamp" onClick={() => addImage('zura01')} src="/assets/zura01.png" />
              <img className="stamp" onClick={() => addImage('zura02')} src="/assets/zura02.png" />
              <img className="stamp" onClick={() => addImage('zura03')} src="/assets/zura03.png" />
              <img className="stamp" onClick={() => addImage('zura04')} src="/assets/zura04.png" />
            </div>
            <h3 className="stamp-title">自作スタンプの読み込み</h3>
            <form id="uploadImg">
              <input type="file" id="imgLoader" onChange={handleFileUpload} />
            </form>
          </div>
        </div>
      </div>
      <canvas
        ref={exportCanvasRef}
        id="export"
        width={w}
        height={h}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default MangaDown
