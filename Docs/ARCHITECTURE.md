# Arquitetura — Jome Cargus Vestiário

> Documento vivo. Atualizar sempre que uma decisão estrutural mudar.

---

## 📑 Índice

- [Visão geral](#visão-geral)
- [Mapa do sistema](#mapa-do-sistema)
- [Produto 1 — Site Jome Cargus](#produto-1--site-jome-cargus)
- [Produto 2 — App JomeFit](#produto-2--app-jomefit)
- [Backend compartilhado](#backend-compartilhado)
- [Banco de dados](#banco-de-dados)
- [Pipeline 3D](#pipeline-3d)
- [Modelo de dados](#modelo-de-dados)
- [Endpoints da API](#endpoints-da-api)
- [Infraestrutura e deploy](#infraestrutura-e-deploy)
- [Fluxo de dados principal](#fluxo-de-dados-principal)
- [Decisões relevantes](#decisões-relevantes)

---

## Visão geral

Monorepo com três serviços independentes que compartilham o mesmo backend:

```
┌─────────────────────┐    ┌─────────────────────┐
│   Site Jome Cargus  │    │    App JomeFit       │
│   (Next.js 14)      │    │  (React 18 + Vite)   │
│   Vercel            │    │  Vercel PWA           │
└────────┬────────────┘    └──────────┬────────────┘
         │                            │
         └────────────┬───────────────┘
                      │ HTTP REST
         ┌────────────▼────────────┐
         │   Backend FastAPI        │
         │   Railway               │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   PostgreSQL (Supabase) │
         │   ⚠️ Atualmente pausado  │
         │   Mock CSV em uso       │
         └─────────────────────────┘
```

---

## Mapa do sistema

| Serviço          | Tecnologia            | Deploy   | URL                        | Status         |
|------------------|-----------------------|----------|----------------------------|----------------|
| Site             | Next.js 14            | Vercel   | URL pública ativa           | ✅ Online      |
| App JomeFit      | React 18 + Vite       | Vercel   | URL pública ativa           | ✅ Online      |
| Backend API      | FastAPI + uvicorn     | Railway  | URL pública ativa           | ✅ Online      |
| Banco de dados   | PostgreSQL (Supabase) | Supabase | —                           | ⚠️ Pausado    |
| Repositório      | GitHub (monorepo)     | —        | DKoder57/Jome_Cargus        | ✅ Ativo       |

---

## Produto 1 — Site Jome Cargus

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · App Router

### Rotas

```
/                        → page.tsx      Home: hero + grid de destaques
/produto/[id]            → page.tsx      Página individual de produto
```

### Responsabilidades
- Vitrine pública da loja — SEO-friendly via SSR do Next.js
- Consumo direto da API (`NEXT_PUBLIC_API_URL`) para exibir produtos
- Base para o painel admin futuro (`/admin` — issues #14–#18, bloqueadas)

### Variáveis de ambiente
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:5173
```

---

## Produto 2 — App JomeFit

**Stack:** React 18 · Vite · TypeScript · Three.js · @react-three/fiber · @react-three/drei · react-router-dom

### Rotas
```
/    → AvatarScene + CatalogPanel
```

### Componentes principais

#### `App.tsx`
- Gerencia estado global: `selectedProduct` e `catalogOpen`
- Renderiza `AvatarScene`, botão Catálogo, card do produto vestindo e `CatalogPanel`

#### `AvatarScene.tsx`
- Canvas Three.js com `dpr={Math.min(window.devicePixelRatio, 2)}`
- **`CameraResponsiva`**: usa `useThree` para ajustar FOV dinamicamente (65 mobile / 50 desktop) com base em `size.width`
- **`AvatarModel`**: carrega `avatar_base.glb` via `useGLTF`. Aplica morph targets via `useEffect + scene.traverse`:
  - `morphTargetInfluences[0]` → shape key `alto`
  - `morphTargetInfluences[1]` → shape key `largo`
- Sliders de Altura e Massa fora do Canvas, na div pai (`absolute bottom-24 left-4 z-10`)
- `OrbitControls` com `enablePan=false`, min/maxDistance 1.5–6

```
Canvas (w-full h-full, sem position:absolute)
├── ambientLight + directionalLight
├── CameraResponsiva (ajuste FOV responsivo)
├── Suspense > AvatarModel (GLB + morph targets)
└── OrbitControls
```

#### `CatalogPanel.tsx`
- Painel lateral direito: `w-80`, `z-20`, slide com `translate-x`
- Consome dois endpoints em paralelo via `Promise.all`:
  - `/catalog/search` → lista de produtos com paginação
  - `/catalog/stock/available` → Set de IDs disponíveis para avatar
- Grid 2 colunas de cards com:
  - Badge Disponível/Indisponível (canto superior esquerdo da foto)
  - Tamanhos: disponível = branco; indisponível = `bg-zinc-700 opacity-50` + linha diagonal (`rotate-12`)
  - Produto indisponível para avatar: `opacity-50 cursor-not-allowed`
- Filtro de categorias: Todos / Camiseta / Jaqueta

### Avatar 3D

| Propriedade     | Valor                                      |
|-----------------|--------------------------------------------|
| Arquivo         | `app/public/models/avatar_base.glb`        |
| Tamanho         | ~3KB                                       |
| Polígonos       | 2.508 tris / 1.766 verts                   |
| Texturas        | Nenhuma (removidas no Blender)             |
| Morph targets   | `alto`, `baixo`, `largo` (shape keys)      |
| Pose            | T-pose, orientação corrigida no Blender    |
| Origem          | Modelo humano free, otimizado via Blender  |

### Variáveis de ambiente
```env
VITE_API_URL=http://localhost:8000
```

---

## Backend compartilhado

**Stack:** Python · FastAPI · uvicorn · Pydantic v2 · python-dotenv · httpx · supabase-py

### Estrutura

```
backend/
├── main.py           # App FastAPI, CORS, inclusão dos routers
├── config.py         # Configurações via pydantic-settings
├── database.py       # Cliente Supabase (inativo enquanto pausado)
├── Procfile          # Comando de start para Railway
├── requirements.txt
├── mock/
│   └── produtos.csv  # Fonte de dados atual (Supabase pausado)
├── routers/
│   ├── catalog.py    # Endpoints principais ← foco atual
│   ├── avatar.py     # Endpoints do avatar (futuro)
│   └── outfit.py     # Endpoints de combinações (futuro)
├── services/         # Lógica de negócio (futuro)
└── models/
    └── product.py    # Modelo Pydantic do produto
```

### `load_products()` — função central

```python
@lru_cache(maxsize=1)
def load_products() -> list[Product]:
    # Lê produtos.csv
    # Calcula tamanhos_disponiveis = tamanhos - tamanhos_indisponiveis
    # lru_cache evita I/O repetido — reiniciar uvicorn para recarregar CSV
```

> **ATENÇÃO:** `lru_cache` ativo. Qualquer edição no CSV exige reiniciar o servidor.

### Ordem dos endpoints em `catalog.py` (obrigatória)

```python
@router.get("/products")
@router.get("/products/{product_id}")   # ← ANTES do /search (evita conflito de rota)
@router.get("/search")
@router.get("/stock/available")
@router.get("/categories")
```

### Variáveis de ambiente
```env
SUPABASE_URL=https://xyzxyz.supabase.co
SUPABASE_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
ENVIRONMENT=production
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## Banco de dados

**PostgreSQL via Supabase** — atualmente **pausado**.

| Item               | Estado                                      |
|--------------------|---------------------------------------------|
| Tabela `produtos`  | Criada com RLS ativo e 4 políticas          |
| Storage bucket     | `produtos` com acesso público               |
| Dados de teste     | 3 produtos inseridos antes da pausa         |
| Fonte atual        | `backend/mock/produtos.csv`                 |

### Issues bloqueadas pelo Supabase
`#5` · `#13` · `#14` · `#15` · `#16` · `#17` · `#18`

### Estratégia de migração
Quando o Supabase voltar: substituir `load_products()` por query real. A interface do modelo (`Product`) e todos os endpoints permanecem iguais — só troca a fonte de dados.

---

## Pipeline 3D

```
Mixamo / Free source
       │
       ▼ FBX download
    Blender
       │ Import FBX
       │ Shader Editor → remover todas as texturas (Diffuse, Metallic, Normal, Specular)
       │ R → X → -90 + Ctrl+A Apply All Transforms (corrigir T-pose)
       │ Object Data Properties → Shape Keys:
       │   Basis (pose neutra)
       │   alto   (S → Z → 1.x em Edit Mode)
       │   baixo  (S → Z → 0.x em Edit Mode)
       │   largo  (S → X → 1.x em Edit Mode)
       │ Export → glTF 2.0 (.glb)
       │   ✅ Shape Keys
       │   ❌ Images
       │   ❌ Animations
       ▼
  avatar_base.glb (~3KB)
       │
       ▼
  app/public/models/avatar_base.glb
       │
       ▼ useGLTF + morphTargetInfluences
  AvatarScene.tsx
```

---

## Modelo de dados

### `models/product.py`

```python
class Product(BaseModel):
    id:                   str
    nome:                 str
    categoria:            str
    subcategoria:         Optional[str] = None
    marca:                Optional[str] = None
    foto_url:             Optional[str] = None
    preco:                Optional[float] = None    # sem acento (foi corrigido de 'preço')
    tamanhos:             list[str] = []
    tamanhos_disponiveis: list[str] = []            # calculado: tamanhos - tamanhos_indisponiveis
    cores:                list[str] = []
    cor_hex:              Optional[str] = None
    material:             Optional[str] = None      # ex: algodão, jeans, nylon, sarja
    estilo:               Optional[str] = None      # ex: casual, social, streetwear, smart casual
    ocasiao:              list[str] = []            # ex: trabalho, casual, festa, esporte, viagem
    ativo:                bool = True
```

### `mock/produtos.csv` — colunas

```
id, nome, categoria, subcategoria, marca, foto_url, preco,
tamanhos, tamanhos_indisponiveis, cores, cor_hex,
material, estilo, ocasiao, ativo
```

> `tamanhos_indisponiveis` existe **só no CSV** — não está no modelo Pydantic.
> É usado apenas internamente por `load_products()` para calcular `tamanhos_disponiveis`.

### Valores de referência

| Campo     | Valores possíveis                                               |
|-----------|-----------------------------------------------------------------|
| categoria | `camiseta`, `jaqueta`                                          |
| material  | `algodão`, `algodão peruano`, `linho`, `poliéster`, `moletom`, `jeans`, `sarja`, `nylon`, `elastano` |
| estilo    | `casual`, `social`, `esportivo`, `streetwear`, `smart casual`  |
| ocasiao   | `trabalho`, `casual`, `festa`, `esporte`, `viagem`             |

---

## Endpoints da API

Base URL (local): `http://localhost:8000`

| Endpoint                    | Método | Descrição                                          |
|-----------------------------|--------|----------------------------------------------------|
| `/catalog/products`         | GET    | Lista produtos ativos. Params: `categoria`, `q`    |
| `/catalog/products/{id}`    | GET    | Produto por ID                                     |
| `/catalog/search`           | GET    | Busca paginada. Params: `categoria`, `subcategoria`, `marca`, `tamanho`, `preco_min`, `preco_max`, `q`, `page`, `limit` |
| `/catalog/categories`       | GET    | Lista de categorias ativas                         |
| `/catalog/stock/available`  | GET    | Produtos com `foto_url` e `ativo=true`. Param: `categoria` |

### Resposta paginada (`/catalog/search`)

```json
{
  "items": [...],
  "total": 10,
  "page": 1,
  "limit": 12,
  "pages": 1
}
```

---

## Infraestrutura e deploy

```
GitHub (monorepo)
    │
    ├── Push main
    │       │
    │       ├── Vercel → build site/   → site online
    │       ├── Vercel → build app/    → app online
    │       └── Railway → deploy backend/ → API online
    │
    └── GitHub Actions
            ├── typescript-check.yml   (TSC no site e app)
            └── eslint.yml             (lint no site e app)
```

### Ambientes

| Variável              | Local               | Produção              |
|-----------------------|---------------------|-----------------------|
| `VITE_API_URL`        | `localhost:8000`    | URL Railway           |
| `NEXT_PUBLIC_API_URL` | `localhost:8000`    | URL Railway           |
| `ENVIRONMENT`         | `development`       | `production`          |

---

## Fluxo de dados principal

### Usuário abre o App JomeFit

```
1. React carrega AvatarScene + CatalogPanel
2. AvatarScene: useGLTF carrega avatar_base.glb (3KB, ~instantâneo)
3. Usuário abre painel → CatalogPanel dispara Promise.all:
   a. GET /catalog/search?limit=20        → lista de produtos
   b. GET /catalog/stock/available        → IDs disponíveis para avatar
4. UI renderiza grid com badge Disponível/Indisponível
5. Usuário clica produto → onSelectProduct(product) → App.tsx
6. Card "Vestindo" aparece no canto inferior esquerdo
7. Usuário move slider Altura → useEffect → morphTargetInfluences[0] = valor
```

### Usuário acessa o Site

```
1. Next.js SSR/SSG busca dados da API
2. Home: GET /catalog/products → grid de destaques
3. Produto: GET /catalog/products/{id} → página individual
```

---

## Decisões relevantes

Ver [`docs/DECISIONS.md`](DECISIONS.md) para log completo. Resumo das mais impactantes:

| Decisão                              | Escolha                        | Motivo                                              |
|--------------------------------------|--------------------------------|-----------------------------------------------------|
| Arquitetura                          | Monorepo                       | Compartilhamento de contexto entre os 3 serviços    |
| Dados durante pausa do Supabase      | Mock CSV + `lru_cache`         | Desenvolvimento contínuo sem custo de infraestrutura |
| Disponibilidade de tamanhos          | Coluna `tamanhos_indisponiveis` no CSV | Flexível por produto, fácil migrar para dado real |
| Avatar 3D                            | GLB low poly sem texturas      | PWA mobile — performance > fidelidade visual        |
| Morph targets vs. múltiplos GLBs     | Morph targets (shape keys)     | 1 arquivo só, deformação suave em tempo real        |
| Responsividade da câmera             | `useThree` + FOV dinâmico      | Mobile-first sem lógica CSS paralela                |
| Canvas layout                        | `div` pai + Canvas sem `position:absolute` | Botões e sliders ficam acessíveis acima do canvas |
