import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface Product {
  id: string
  nome: string
  categoria: string
  subcategoria?: string
  marca?: string
  foto_url?: string
  preco?: number
  cores: string[]
  tamanhos: string[]
  tamanhos_disponiveis: string[]
  ativo: boolean
}

interface Props {
  open: boolean
  onClose: () => void
  onSelectProduct: (product: Product) => void
  selectedProductId?: string
}

const CATEGORIES = ['todos', 'camiseta', 'jaqueta']

export default function CatalogPanel({ open, onClose, onSelectProduct, selectedProductId }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [available, setAvailable] = useState<Set<string>>(new Set())
  const [categoria, setCategoria] = useState('todos')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)

    const params = new URLSearchParams()
    if (categoria !== 'todos') params.set('categoria', categoria)
    params.set('limit', '20')

    const fetchCatalog = fetch(`${API_URL}/catalog/search?${params}`)
      .then(r => r.json())
      .then(data => setProducts(data.items))

    const stockParams = new URLSearchParams()
    if (categoria !== 'todos') stockParams.set('categoria', categoria)

    const fetchStock = fetch(`${API_URL}/catalog/stock/available?${stockParams}`)
      .then(r => r.json())
      .then((data: Product[]) => setAvailable(new Set(data.map(p => p.id))))

    Promise.all([fetchCatalog, fetchStock]).finally(() => setLoading(false))
  }, [open, categoria])

  return (
    <>
      {open && (
        <div className="absolute inset-0 bg-black/50 z-10" onClick={onClose} />
      )}

      <div className={`
        absolute top-0 right-0 h-full w-80 bg-zinc-900 z-20
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <h2 className="text-white font-bold text-lg">Catálogo</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xl w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Filtro categorias */}
        <div className="flex gap-2 p-4 border-b border-zinc-700 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`
                px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
                ${categoria === cat
                  ? 'bg-yellow-500 text-black'
                  : 'bg-zinc-700 text-zinc-300'}
              `}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid de produtos */}
        <div className="overflow-y-auto h-[calc(100%-120px)] p-4">
          {loading ? (
            <p className="text-zinc-400 text-center mt-8">Carregando...</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map(p => {
                const isAvailable = available.has(p.id)
                const isSelected = selectedProductId === p.id

                return (
                  <div
                    key={p.id}
                    onClick={() => isAvailable && onSelectProduct(p)}
                    className={`
                      bg-zinc-800 rounded-lg overflow-hidden cursor-pointer transition
                      ${isSelected ? 'ring-2 ring-yellow-500' : ''}
                      ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:ring-1 hover:ring-yellow-500'}
                    `}
                  >
                    <div className="relative">
                      <img
                        src={p.foto_url || 'https://placehold.co/200x250/1a1a1a/c9a84c?text=Sem+Foto'}
                        alt={p.nome}
                        className="w-full aspect-[4/5] object-cover"
                      />
                      {/* Badge disponibilidade */}
                      <span className={`
                        absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full
                        ${isAvailable ? 'bg-green-500 text-white' : 'bg-zinc-600 text-zinc-300'}
                      `}>
                        {isAvailable ? 'Disponível' : 'Indisponível'}
                      </span>
                    </div>
                    <div className="p-2">
                      <p className="text-white text-xs font-medium leading-tight line-clamp-2">{p.nome}</p>
                      {p.preco && (
                        <p className="text-yellow-500 text-sm font-bold mt-1">
                          R$ {p.preco.toFixed(2)}
                        </p>
                      )}
                      {/* Tamanhos */}
                      {p.tamanhos.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-2">
                          {p.tamanhos.map(t => {
                            const disponivel = p.tamanhos_disponiveis.includes(t)

                            return (
                              <span
                                key={t}
                                className={`text-xs px-1.5 py-0.5 rounded font-medium relative overflow-hidden ${disponivel
                                    ? 'bg-white text-black'
                                    : 'bg-zinc-700 text-zinc-400 opacity-50'}`}>
                                {t}
                                {!disponivel && (
                                  <span className="absolute inset-0 pointer-events-none">
                                    <span className="absolute top-1/2 left-0 w-full h-px bg-zinc-400 -rotate-12" />
                                  </span>
                                )}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}