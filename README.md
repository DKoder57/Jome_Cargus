# Jome Cargus Vestiário

**Ecossistema digital que leva o catálogo real da loja para um provador virtual 3D direto no celular do cliente — sem cadastro, sem atrito.**

[![Build](https://img.shields.io/github/actions/workflow/status/DKoder57/Jome_Cargus/typescript-check.yml?label=build)](https://github.com/DKoder57/Jome_Cargus/actions)
[![License](https://img.shields.io/github/license/DKoder57/Jome_Cargus)](https://github.com/DKoder57/Jome_Cargus/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/DKoder57/Jome_Cargus)](https://github.com/DKoder57/Jome_Cargus/commits/main)

## 📑 Sumário

- [Sobre](#-sobre)
- [Features](#-features)
- [Tecnologias](#️-tecnologias)
- [Como rodar](#️-como-rodar)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Roadmap](#️-roadmap)
- [Licença](#-licença)

---

## 📖 Sobre

A **Jome Cargus** é uma loja de moda masculina em Itabira, MG. Este repositório é o ecossistema digital completo da loja, composto por dois produtos integrados:

- **Site Jome Cargus** — loja online com vitrine, catálogo e página individual de produto
- **App JomeFit** — PWA mobile-first com provador virtual: avatar low poly 3D onde o cliente experimenta as roupas do catálogo real antes de comprar

Documentação técnica completa vive em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/DECISIONS.md`](docs/DECISIONS.md) e [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## ✨ Features

### Site
- [x] Home com hero e grid de destaques
- [x] Catálogo navegável com filtros por categoria
- [x] Página individual de produto com tamanhos e preço
- [ ] Painel admin com CRUD de produtos (aguarda Supabase — ver [Roadmap](#️-roadmap))

### App JomeFit
- [x] Avatar masculino low poly 3D (GLB, 3KB)
- [x] Sliders de Altura e Massa Corporal via morph targets
- [x] Painel lateral de catálogo com filtro por categoria
- [x] Disponibilidade de tamanhos por produto (visual com risco)
- [x] Consumo de API real de estoque (`/catalog/stock/available`)
- [ ] Sugestões de combinações de moda por cor/material/estilo/ocasião (em andamento — #35)
- [ ] Swap de mesh de roupas sobre o avatar (fase J2)
- [ ] Rosto do usuário via MediaPipe como textura (fase J3)

### Backend
- [x] API REST com FastAPI (catálogo, busca paginada, estoque, categorias)
- [x] Mock CSV com 10 produtos e disponibilidade de tamanhos por produto
- [x] Modelo com campos: material, estilo, ocasião
- [ ] Integração real com Supabase (banco pausado — issues #13–18 bloqueadas)

---

## 🛠️ Tecnologias

| Camada         | Tecnologia                                              |
|----------------|---------------------------------------------------------|
| Site           | Next.js 14, TypeScript, Tailwind CSS, App Router        |
| App (PWA)      | React 18, Vite, TypeScript, Three.js, @react-three/fiber, @react-three/drei |
| Backend        | Python, FastAPI, uvicorn, Pydantic, python-dotenv, httpx |
| Banco de dados | PostgreSQL via Supabase (RLS ativo)                     |
| 3D             | Blender (GLB, morph targets/shape keys)                 |
| Infra / Deploy | Vercel (site + app), Railway (backend)                  |
| CI/CD          | GitHub Actions ([workflows](.github/workflows))         |

---

## ▶️ Como rodar

```bash
# Clonar
git clone git@github.com:DKoder57/Jome_Cargus.git
cd Jome_Cargus
git pull origin main

# Site — Terminal 1
cd site && npm install && npm run dev          # localhost:3000

# App JomeFit — Terminal 2
cd app && npm install && npm run dev           # localhost:5173

# Backend — Terminal 3
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload                      # localhost:8000
```

> **Atenção:** `lru_cache` ativo no backend — edições no CSV exigem reiniciar o uvicorn (Ctrl+C).

### Variáveis de ambiente

Criar manualmente (não estão no GitHub):

**`site/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:5173
```

**`app/.env.local`**
```env
VITE_API_URL=http://localhost:8000
```

**`backend/.env`**
```env
SUPABASE_URL=https://xyzxyz.supabase.co
SUPABASE_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
ENVIRONMENT=production
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## 📂 Estrutura do projeto

```
jomecargus-vestiario/
├── .github/                    # CI/CD (GitHub Actions)
├── docs/                       # Arquitetura, roadmap e decisões técnicas
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   └── ROADMAP.md
├── site/                       # Produto 1 — Site Next.js
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx            # Home: hero + grid de destaques
│       ├── globals.css
│       └── produto/[id]/
│           └── page.tsx        # Página individual de produto
├── app/                        # Produto 2 — App JomeFit (PWA)
│   └── src/
│       ├── App.tsx             # Rotas + estado global do produto selecionado
│       ├── main.tsx            # BrowserRouter
│       └── components/
│           ├── avatar/
│           │   └── AvatarScene.tsx     # Canvas Three.js + avatar GLB + sliders
│           └── catalog/
│               └── CatalogPanel.tsx   # Painel lateral do catálogo
├── backend/                    # API compartilhada (FastAPI)
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── Procfile
│   ├── requirements.txt
│   ├── mock/
│   │   └── produtos.csv        # 10 produtos mock com todos os campos
│   ├── routers/
│   │   ├── catalog.py          # Endpoints principais
│   │   ├── avatar.py
│   │   └── outfit.py
│   ├── services/
│   └── models/
│       └── product.py          # Modelo Pydantic completo
└── README.md
```

---

## 🗺️ Roadmap

Planejamento macro por fases em [`docs/ROADMAP.md`](docs/ROADMAP.md). O detalhamento de cada item é gerenciado como Issues no GitHub.

| Fase      | Foco                                        | Status         |
|-----------|---------------------------------------------|----------------|
| Base      | Infraestrutura, API, catálogo, deploy       | ✅ Concluída   |
| Avatar    | GLB, morph targets, responsividade          | ✅ Concluída   |
| Sugestões | Combinações por cor/material/estilo/ocasião | 🔄 Em andamento |
| Admin     | Painel CRUD com Supabase Auth + Storage     | ⏸️ Bloqueada   |
| J2        | Swap de mesh de roupas no avatar            | 📋 Planejada   |
| J3        | Rosto do usuário via MediaPipe              | 📋 Planejada   |
| V2        | Login + carrinho + Mercado Pago             | 📋 Planejada   |

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](LICENSE) para mais detalhes.
