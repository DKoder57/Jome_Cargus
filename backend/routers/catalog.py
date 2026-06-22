from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from models.product import Product
import csv
import os

router = APIRouter(prefix="/catalog", tags=["catalog"])

def load_products() -> list[Product]:
    path = os.path.join(os.path.dirname(__file__), "..", "mock", "produtos.csv")
    products = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            products.append(Product(
                id=row["id"],
                nome=row["nome"],
                categoria=row["categoria"],
                subcategoria=row.get("subcategoria") or None,
                marca=row.get("marca") or None,
                foto_url=row.get("foto_url") or None,
                preco=float(row["preco"]) if row.get("preco") else None,
                tamanhos=[t.strip() for t in row["tamanhos"].split(",") if t.strip()],
                cores=[c.strip() for c in row["cores"].split(",") if c.strip()],
                cor_hex=row.get("cor_hex") or None,
                ativo=row.get("ativo", "true").lower() == "true",
            ))
    return products

@router.get("/products", response_model=list[Product])
async def get_products(
    categoria: Optional[str] = Query(None),
    q:         Optional[str] = Query(None),
):
    result = [p for p in load_products() if p.ativo]
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

@router.get("/categories")
async def get_categories():
    cats = list(set(p.categoria for p in load_products() if p.ativo))
    return {"categories": sorted(cats)}