from fastapi import APIRouter, Query
from typing import Optional
from models.product import Product

router = APIRouter(prefix="/catalog", tags=["catalog"])

# Dados de teste — substituir por Supabase na Fase S3
MOCK_PRODUCTS = [
  Product(id="001", nome="Camiseta Social Reserva",
          categoria="camiseta", marca="Reserva",
          foto_url="https://placehold.co/400x500/1a1a1a/c9a84c?text=Camiseta",
          preco=189.90, tamanhos=["P","M","G","GG"], cores=["preto"]),
  Product(id="002", nome="Calca Slim Convicto",
          categoria="calca", marca="Convicto",
          foto_url="https://placehold.co/400x500/2d2d2d/c9a84c?text=Calca",
          preco=249.90, tamanhos=["38","40","42","44"], cores=["preto","cinza"]),
]

@router.get("/products", response_model=list[Product])
async def get_products(
    categoria: Optional[str] = Query(None),
    q:         Optional[str] = Query(None),
):
    result = [p for p in MOCK_PRODUCTS if p.ativo]
    if categoria:
        result = [p for p in result if p.categoria == categoria]
    if q:
        result = [p for p in result if q.lower() in p.nome.lower()]
    return result

@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    for p in MOCK_PRODUCTS:
        if p.id == product_id:
            return p
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Produto nao encontrado")

@router.get("/categories")
async def get_categories():
    cats = list(set(p.categoria for p in MOCK_PRODUCTS if p.ativo))
    return {"categories": sorted(cats)}
