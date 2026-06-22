from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    id:             str
    nome:           str
    categoria:      str
    subcategoria:   Optional[str] = None
    marca:          Optional[str] = None
    foto_url:       Optional[str] = None
    preco:          Optional[float] = None
    tamanhos:       list[str] = []
    cores:          list[str] = []
    cor_hex:        Optional[str] = None
    ativo:          bool = True
