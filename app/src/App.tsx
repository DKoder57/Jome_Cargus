import { Routes, Route } from 'react-router-dom'
import AvatarScene from './components/avatar/AvatarScene'
import CatalogPanel from './components/catalog/CatalogPanel'
import { useState } from 'react'

interface Product {
  id: string
  nome: string
  categoria: string
  foto_url?: string
  preco?: number
  cores: string[]
  tamanhos: string[]
  ativo: boolean
}

export default function App() {
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <div className="w-full h-full bg-black relative">
      <Routes>
        <Route path="/" element={
          <>
            <AvatarScene />

            {/* Produto selecionado */}
            {selectedProduct && (
              <div className="absolute bottom-6 left-6 bg-zinc-900 border border-yellow-500 rounded-lg p-3 z-10 max-w-[200px]">
                <p className="text-zinc-400 text-xs uppercase tracking-widest">Vestindo</p>
                <p className="text-white text-sm font-medium mt-1">{selectedProduct.nome}</p>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-zinc-500 text-xs mt-2 hover:text-white"
                >
                  Remover
                </button>
              </div>
            )}

            <button
              onClick={() => setCatalogOpen(true)}
              className="absolute bottom-6 right-6 bg-yellow-500 text-black font-bold px-4 py-2 rounded-full shadow-lg z-10"
            >
              Catálogo
            </button>

            <CatalogPanel
              open={catalogOpen}
              onClose={() => setCatalogOpen(false)}
              onSelectProduct={setSelectedProduct}
              selectedProductId={selectedProduct?.id}
            />
          </>
        } />
      </Routes>
    </div>
  )
}