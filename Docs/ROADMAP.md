# Roadmap — Jome Cargus Vestiário

> Planejamento macro por fases. O detalhamento de cada item vira Issue no GitHub.  
> Issues marcadas com ⚠️ dependem da reativação do Supabase.

---

## ✅ Fase Base — Infraestrutura e Catálogo

| Issue | Entrega                                      | Status |
|-------|----------------------------------------------|--------|
| #1    | Monorepo + CI/CD (GitHub Actions)            | ✅     |
| #2    | Next.js 14 setup (site)                      | ✅     |
| #3    | React 18 + Three.js setup (app)              | ✅     |
| #4    | FastAPI + uvicorn (backend)                  | ✅     |
| #6    | Deploy Vercel (site + app) + Railway (backend) | ✅   |
| #8    | Mock CSV de produtos (10 itens)              | ✅     |
| #9    | API paginada com filtros completos           | ✅     |
| #10   | Painel lateral de catálogo mobile (CatalogPanel) | ✅ |
| #11   | Página individual `/produto/[id]`            | ✅     |
| #12   | Home com hero + grid de destaques            | ✅     |
| #19   | Endpoint `/catalog/stock/available`          | ✅     |
| #20   | JomeFit consumir API de estoque              | ✅     |
| #21   | Exibir disponibilidade de tamanhos no catálogo | ✅   |

---

## ✅ Fase Avatar — 3D e Responsividade

| Issue | Entrega                                      | Status |
|-------|----------------------------------------------|--------|
| #22   | GLB low poly do avatar (Blender, 3KB, T-pose) | ✅    |
| #23   | Morph targets no GLB (alto, baixo, largo)    | ✅     |
| #24   | Cena Three.js responsiva mobile-first        | ✅     |

---

## 🔄 Fase Sugestões — Combinações de Moda

| Issue | Entrega                                                       | Status          |
|-------|---------------------------------------------------------------|-----------------|
| #35   | Tela de sugestões de combinações                              | 🔄 Em andamento |
|       | ↳ Schema expandido (material, estilo, ocasiao) — CSV + modelo | ✅ Feito        |
|       | ↳ Aba expansível de sugestões no App JomeFit                  | 📋 Pendente     |
|       | ↳ Filtro dinâmico por cor/material/estilo/ocasião             | 📋 Pendente     |
|       | ↳ Seleção de ocasião no menu expandido                        | 📋 Pendente     |
|       | ↳ Compatibilidade entre categorias (camiseta × jaqueta)       | 📋 Pendente     |
| #36   | (definir)                                                     | 🔄 Em andamento |

---

## ⏸️ Fase Admin — Painel Administrativo *(bloqueada — aguarda Supabase)*

| Issue | Entrega                                         | Status          |
|-------|-------------------------------------------------|-----------------|
| #5    | Integração real com Supabase                    | ⚠️ Bloqueada   |
| #13   | Cache de imagens no Supabase Storage            | ⚠️ Bloqueada   |
| #14   | Rota `/admin` protegida por Supabase Auth       | ⚠️ Bloqueada   |
| #15   | Formulário admin: adicionar produto com foto    | ⚠️ Bloqueada   |
| #16   | Formulário admin: editar produto                | ⚠️ Bloqueada   |
| #17   | Formulário admin: ativar/desativar produto      | ⚠️ Bloqueada   |
| #18   | Upload de foto via Supabase Storage             | ⚠️ Bloqueada   |

---

## 📋 Fase J2 — Roupas no Avatar

| Entrega                                                    | Status    |
|------------------------------------------------------------|-----------|
| Swap de mesh de roupas sobre o avatar GLB                  | 📋 Futura |
| Seleção de roupa no catálogo aplica mesh no avatar         | 📋 Futura |
| Combinação de peças (camiseta + jaqueta simultâneas)       | 📋 Futura |

---

## 📋 Fase J3 — Rosto do Usuário

| Entrega                                                    | Status    |
|------------------------------------------------------------|-----------|
| Captura de foto via câmera do dispositivo                  | 📋 Futura |
| Processamento do rosto via MediaPipe                       | 📋 Futura |
| Aplicação do rosto como textura na cabeça do avatar        | 📋 Futura |

---

## 📋 Fase V2 — Experiência de Compra Completa

| Entrega                                                    | Status    |
|------------------------------------------------------------|-----------|
| Login de cliente                                           | 📋 Futura |
| Carrinho de compras                                        | 📋 Futura |
| Integração com Mercado Pago                                | 📋 Futura |

---

## Débitos técnicos conhecidos

| Item                                              | Prioridade | Impacto  |
|---------------------------------------------------|------------|----------|
| Bug visual: botão Catálogo sobrepõe painel aberto | Média      | Visual   |
| Pylance não reconhece imports do `.venv`          | Baixa      | Cosmético|
| Avatar sem cor/textura                            | Baixa      | Visual   |
| `tamanhos_disponiveis` simulado (não dado real)   | Média      | Dados    |
| Layout/aparência geral do frontend                | Baixa      | Visual   |

---

## Como priorizar

```
Critério de prioridade:
1. Funcionalidade core do JomeFit (provador virtual)
2. Issues independentes do Supabase
3. Issues dependentes do Supabase (após reativação)
4. Refinamento visual e UX
5. Fase V2 (monetização)
```
