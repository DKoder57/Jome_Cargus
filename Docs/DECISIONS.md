# Decisões Técnicas — Jome Cargus Vestiário

> Log de decisões arquiteturais relevantes. Cada entrada responde: o quê, por quê, e qual a alternativa descartada.

---

## [D01] Monorepo com três serviços no mesmo repositório

**Data:** Jun/2026  
**Status:** ✅ Ativo

**Decisão:** Site (Next.js), App JomeFit (React/Vite) e Backend (FastAPI) no mesmo repositório GitHub.

**Motivo:** Facilita sincronismo de mudanças que afetam os três serviços (ex: novo campo no modelo de produto atualiza CSV, backend e frontend ao mesmo tempo). CI/CD unificado via GitHub Actions.

**Alternativa descartada:** Três repositórios separados — overhead de coordenação desnecessário para um projeto solo.

---

## [D02] Mock CSV como camada de dados temporária

**Data:** Jun/2026  
**Status:** ✅ Ativo (até Supabase reativar)

**Decisão:** `backend/mock/produtos.csv` serve todos os endpoints enquanto o Supabase está pausado.

**Motivo:** O plano gratuito do Supabase pausa projetos inativos. O mock permite desenvolvimento contínuo sem custo. A interface do modelo (`Product`) e os endpoints permanecem idênticos — só a fonte de dados muda quando o banco voltar.

**Alternativa descartada:** SQLite local — mais complexo de manter e dificulta a migração posterior para o Supabase.

---

## [D03] `lru_cache(maxsize=1)` em `load_products()`

**Data:** Jul/2026  
**Status:** ✅ Ativo

**Decisão:** Cache em memória da lista de produtos carregada do CSV.

**Motivo:** Evita I/O de disco a cada request. Com 10 produtos e requests frequentes do frontend, a diferença é perceptível.

**Trade-off:** Edições no CSV exigem reiniciar o uvicorn. Aceito durante desenvolvimento; irrelevante em produção (onde o CSV será substituído por query ao Supabase).

**Alternativa descartada:** Cache sem `lru_cache` (variável global) — equivalente mas menos idiomático.

---

## [D04] Coluna `tamanhos_indisponiveis` no CSV (não no modelo Pydantic)

**Data:** Jul/2026  
**Status:** ✅ Ativo

**Decisão:** A coluna `tamanhos_indisponiveis` existe só no CSV. `load_products()` usa ela internamente para calcular `tamanhos_disponiveis = tamanhos - tamanhos_indisponiveis`. O modelo `Product` só expõe `tamanhos_disponiveis`.

**Motivo:** Reflete o modelo real: o banco de dados vai ter estoque por tamanho, não uma lista de "indisponíveis". A lógica de subtração fica encapsulada na leitura do mock e desaparece quando vier o dado real.

**Alternativa descartada:** Corte posicional `[:-1]` — cortava sempre o último tamanho da lista, independente do produto. Bug quando produtos não tinham GG (o G era incorretamente marcado como indisponível).

---

## [D05] Avatar GLB low poly sem texturas

**Data:** Jul/2026  
**Status:** ✅ Ativo

**Decisão:** Avatar exportado do Blender sem nenhuma textura embutida. Cor cinza padrão do material.

**Motivo:** PWA mobile-first — performance é prioridade. O modelo original vinha com 4 mapas de textura (Diffuse, Metallic Roughness, Normal Map, Specular) totalizando ~39MB. Após remoção das texturas e export correto: ~3KB.

**Trade-off:** Avatar visualmente simples (cinza). Aceito — cor/textura será adicionada quando o resto do JomeFit estiver funcional.

**Alternativa descartada:** Manter texturas + compressão Draco — reduziu apenas 1MB. Insuficiente para PWA.

---

## [D06] Morph targets (shape keys) em vez de múltiplos GLBs

**Data:** Jul/2026  
**Status:** ✅ Ativo

**Decisão:** Um único GLB com shape keys (`alto`, `baixo`, `largo`) controlados por sliders via `morphTargetInfluences`.

**Motivo:** Deformação suave e contínua em tempo real. Um arquivo só (3KB vs. N × 3KB). Sem I/O adicional ao trocar "tipo de corpo".

**Alternativa descartada:** 3 GLBs separados (padrão, largo, magro) com troca por seleção — mais simples de implementar mas sem interpolação suave e mais lento para carregar.

---

## [D07] Canvas Three.js sem `position: absolute`

**Data:** Jul/2026  
**Status:** ✅ Ativo

**Decisão:** Canvas dentro de `div` pai com `w-full h-full relative`. Canvas usa `style={{ width: "100%", height: "100%" }}` sem `position: absolute`.

**Motivo:** Com `position: absolute` no Canvas, os elementos de UI (botão Catálogo, card "Vestindo", sliders) ficavam cobertos pelo Canvas e inacessíveis. Removendo o absolute, a `div` pai gerencia o layout e os elementos de UI ficam em camadas `z-10` acima do Canvas normalmente.

**Alternativa descartada:** Canvas com `position: absolute` e z-index nos elementos — frágil e dependente de z-index correto em cada novo elemento adicionado.

---

## [D08] `CameraResponsiva` como componente interno do Canvas

**Data:** Jul/2026  
**Status:** ✅ Ativo

**Decisão:** Componente `CameraResponsiva` que usa `useThree` para acessar `camera` e `size` e ajusta o FOV dinamicamente (65 mobile / 50 desktop).

**Motivo:** `useThree` só funciona dentro do contexto do `Canvas`. A câmera não pode ser acessada diretamente fora dele. Encapsular em um componente filho mantém o código limpo.

**Alternativa descartada:** FOV fixo — avatar aparecia cortado ou muito pequeno em telas móveis.

---

## [D09] Campos `material`, `estilo`, `ocasiao` no modelo de produto

**Data:** Jul/2026  
**Status:** ✅ Ativo (em uso pela issue #35)

**Decisão:** Adicionar campos semânticos ao modelo para suportar o sistema de sugestões de combinações.

**Valores de referência:** materiais do catálogo da Reserva; estilos e ocasiões alinhados à moda masculina brasileira.

**Motivo:** O filtro dinâmico de combinações (#35) precisa de dados estruturados por produto. Sem esses campos, qualquer sugestão seria superficial (só por categoria).

**Alternativa descartada:** Tags genéricas em array — menos legível e mais difícil de filtrar no backend.

---

## [D10] Sem cadastro no App JomeFit

**Data:** Jun/2026  
**Status:** ✅ Ativo (decisão de produto)

**Decisão:** O app não coleta dados pessoais nem exige cadastro.

**Motivo:** Reduz atrito de adoção. O cliente usa o provador virtual sem barreiras. Login de cliente entra apenas na fase V2, junto com carrinho e pagamento.

**Alternativa descartada:** Cadastro desde o início — barreira desnecessária para a proposta de valor central do JomeFit.
