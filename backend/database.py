from supabase import create_client, Client
from config import get_settings

settings = get_settings()

def get_supabase() -> Client:
   return create_client(
            settings.supabase_url,
            settings.supabase_key
   )

def get_supabase_admin() -> Client:
   """Usa service key - bypass RLS. SOmente no backend."""
   return create_client (
            settings.supabase_url,
            settings.supabase_service_key
   )
