import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Product {
  id: string
  nome: string
  categoria: string
  marca?: string
  foto_url?: string
  preco?: number
  tamanhos: string[]
  cores: string[]
  ativo: boolean
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/catalog/search?limit=4`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.items
  } catch {
    return []
  }
}

export default async function Home() {
  const products = await getFeaturedProducts()

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section
        className="relative w-full h-[80vh] flex items-center justify-center"
        style={{
          backgroundImage: "url('https://placehold.co/1920x1080/1a1a1a/c9a84c?text=JOME+CARGUS')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Conteúdo */}
        <div className="relative z-10 text-center px-4">
          <p className="text-yellow-500 text-sm uppercase tracking-widest mb-3">
            Moda Masculina — Itabira MG
          </p>
          <h1 className="text-5xl font-bold tracking-widest mb-6">
            JOME CARGUS
          </h1>
          <p className="text-zinc-300 text-lg mb-8 max-w-md mx-auto">
            Estilo e qualidade para o homem moderno
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/catalogo"
              className="bg-yellow-500 text-black font-bold px-6 py-3 rounded hover:bg-yellow-400 transition"
            >
              Ver Catálogo
            </Link>
            
              <a href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173'}
              className="border border-yellow-500 text-yellow-500 font-bold px-6 py-3 rounded hover:bg-yellow-500 hover:text-black transition"
            >
              Experimentar Roupas
            </a>
          </div>
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8 tracking-widest uppercase">
          Destaques
        </h2>

        {products.length === 0 ? (
          <p className="text-zinc-400">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(p => (
              <Link key={p.id} href={`/produto/${p.id}`}>
                <div className="bg-zinc-900 rounded-lg overflow-hidden hover:ring-1 hover:ring-yellow-500 transition">
                  <img
                    src={p.foto_url || 'https://placehold.co/400x500/1a1a1a/c9a84c?text=Sem+Foto'}
                    alt={p.nome}
                    className="w-full aspect-[4/5] object-cover"
                  />
                  <div className="p-3">
                    {p.marca && (
                      <p className="text-zinc-400 text-xs uppercase tracking-widest">{p.marca}</p>
                    )}
                    <p className="text-white text-sm font-medium mt-1 line-clamp-2">{p.nome}</p>
                    {p.preco && (
                      <p className="text-yellow-500 text-sm font-bold mt-1">
                        R$ {p.preco.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </main>
  )
}