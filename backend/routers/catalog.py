from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from models.product import Product
import csv
import os
from pydantic import BaseModel as PydanticBaseModel
from functools import lru_cache

class PaginatedProducts(PydanticBaseModel):
    items: list[Product]
    total: int
    page: int
    limit: int
    pages: int

router = APIRouter(prefix="/catalog", tags=["catalog"])


@lru_cache(maxsize=1)
def load_products() -> list[Product]:
    path = os.path.join(os.path.dirname(__file__), "..", "mock", "produtos.csv")
    products = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            indisponiveis = [
                i.strip() for i in row.get("tamanhos_indisponiveis", "").split(",") if i.strip()
            ]
            products.append(Product(
                id=row["id"],
                nome=row["nome"],
                categoria=row["categoria"],
                subcategoria=row.get("subcategoria") or None,
                marca=row.get("marca") or None,
                foto_url=row.get("foto_url") or None,
                preco=float(row["preco"]) if row.get("preco") else None,
                tamanhos=[t.strip() for t in row["tamanhos"].split(",") if t.strip()],
                tamanhos_disponiveis=[
                    t.strip() for t in row["tamanhos"].split(",") if t.strip()
                    if t.strip() not in indisponiveis
                ],
                cores=[c.strip() for c in row["cores"].split(",") if c.strip()],
                cor_hex=row.get("cor_hex") or None,
                ativo=row.get("ativo", "true").lower() == "true",
                ocasiao=[o.strip() for o in row.get("ocasiao", "").split(",") if o.strip()],
                material=row.get("material") or None,
                estilo=row.get("estilo") or None,
            ))
    return products

@router.get("/products", response_model=list[Product])
async def get_products(
    categoria: Optional[str] = Query(None),
    q:         Optional[str] = Query(None),
):
    result = [p for p in () if p.ativo]
    if categoria:
        result = [p for p in result if p.categoria == categoria]
    if q:
        result = [p for p in result if q.lower() in p.nome.lower()]
    return result


@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    for p in load_products():
        if p.id == product_id:
            return p
    raise HTTPException(status_code=404, detail="Produto nao encontrado")

@router.get("/search", response_model=PaginatedProducts)
async def search_products(
    categoria:    Optional[str]   = Query(None),
    subcategoria: Optional[str]   = Query(None),
    marca:        Optional[str]   = Query(None),
    tamanho:      Optional[str]   = Query(None),
    preco_min:    Optional[float] = Query(None),
    preco_max:    Optional[float] = Query(None),
    q:            Optional[str]   = Query(None),
    page:         int             = Query(1, ge=1),
    limit:        int             = Query(12, ge=1, le=100),
):
    result = [p for p in load_products() if p.ativo]

    if categoria:
        result = [p for p in result if p.categoria == categoria]
    if subcategoria:
        result = [p for p in result if p.subcategoria == subcategoria]
    if marca:
        result = [p for p in result if p.marca == marca]
    if tamanho:
        result = [p for p in result if tamanho in p.tamanhos]
    if preco_min is not None:
        result = [p for p in result if p.preco is not None and p.preco >= preco_min]
    if preco_max is not None:
        result = [p for p in result if p.preco and p.preco <= preco_max]
    if q:
        result = [p for p in result if q.lower() in p.nome.lower()]

    total = len(result)
    pages = (total + limit - 1) // limit
    start = (page - 1) * limit
    end   = start + limit

    return PaginatedProducts(
        items=result[start:end],
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )

@router.get("/categories")
async def get_categories():
    cats = list(set(p.categoria for p in load_products() if p.ativo))
    return {"categories": sorted(cats)}

    
@router.get("/stock/available", response_model=list[Product])
async def get_available_stock(
    categoria: Optional[str] = Query(None),
):
    result = [
        p for p in load_products()
        if p.ativo and p.foto_url
    ]
    if categoria:
        result = [p for p in result if p.categoria == categoria]
    return result
