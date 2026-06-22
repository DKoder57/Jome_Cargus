import { Routes, Route } from 'react-router-dom'
import AvatarScene from './components/avatar/AvatarScene'
import CatalogPanel from './components/catalog/CatalogPanel'
import { useState } from 'react'

export default function App() {
  const [catalogOpen, setCatalogOpen] = useState(false)

  return (
    <div className="w-full h-full bg-black relative">
      <Routes>
        <Route path="/" element={
          <>
            <AvatarScene />
            <button
              onClick={() => setCatalogOpen(true)}
              className="absolute bottom-6 right-6 bg-yellow-500 text-black font-bold px-4 py-2 rounded-full shadow-lg z-10"
            >
              Catálogo
            </button>
            <CatalogPanel
              open={catalogOpen}
              onClose={() => setCatalogOpen(false)}
            />
          </>
        } />
      </Routes>
    </div>
  )
}