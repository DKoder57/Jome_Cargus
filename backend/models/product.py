from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    id:                   str
    nome:                 str
    categoria:            str
    subcategoria:         Optional[str] = None
    marca:                Optional[str] = None
    foto_url:             Optional[str] = None
    preco:                Optional[float] = None
    tamanhos:             list[str] = []
    tamanhos_disponiveis: list[str] = []
    cores:                list[str] = []
    cor_hex:              Optional[str] = None
    material:             Optional[str] = None
    estilo:               Optional[str] = None
    ocasiao:              list[str] = []
    ativo:                bool = True
