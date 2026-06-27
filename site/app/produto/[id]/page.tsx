const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Product {
  id: string
  nome: string
  categoria: string
  subcategoria?: string
  marca?: string
  foto_url?: string
  preco?: number
  tamanhos: string[]
  cores: string[]
  cor_hex?: string
  ativo: boolean
}

interface Props {
  params: Promise<{ id: string }>
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/catalog/products/${id}`, {
      cache: 'no-store'
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function ProdutoPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Produto não encontrado.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Foto */}
        <img
          src={product.foto_url || 'https://placehold.co/400x500/1a1a1a/c9a84c?text=Sem+Foto'}
          alt={product.nome}
          className="w-full aspect-[4/5] object-cover rounded-lg"
        />

        {/* Info */}
        <div className="mt-6 space-y-3">
          {product.marca && (
            <p className="text-zinc-400 text-sm uppercase tracking-widest">{product.marca}</p>
          )}
          <h1 className="text-2xl font-bold">{product.nome}</h1>
          {product.preco && (
            <p className="text-yellow-500 text-xl font-bold">
              R$ {product.preco.toFixed(2)}
            </p>
          )}
        </div>

        {/* Tamanhos */}
        {product.tamanhos.length > 0 && (
          <div className="mt-6">
            <p className="text-zinc-400 text-sm mb-2">Tamanhos disponíveis</p>
            <div className="flex gap-2 flex-wrap">
              {product.tamanhos.map(t => (
                <span
                  key={t}
                  className="border border-zinc-600 text-white text-sm px-3 py-1 rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cores */}
        {product.cores.length > 0 && (
          <div className="mt-6">
            <p className="text-zinc-400 text-sm mb-2">Cores disponíveis</p>
            <div className="flex gap-2 flex-wrap">
              {product.cores.map(c => (
                <span
                  key={c}
                  className="bg-zinc-800 text-white text-sm px-3 py-1 rounded"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botão JomeFit */}
        
          <a href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173'}
          className="mt-8 block w-full bg-yellow-500 text-black font-bold text-center py-3 rounded-lg hover:bg-yellow-400 transition"
        >
          Experimentar no JomeFit
        </a>

      </div>
    </main>
  )
}