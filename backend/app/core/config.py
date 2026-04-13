import os
from dotenv import load_dotenv

load_dotenv()

TCG_API_KEY = os.getenv("TCG_API_KEY")
TCG_API_BASE = "https://api.pokemontcg.io/v2"
