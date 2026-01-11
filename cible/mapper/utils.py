"""
Utilitaires partagés pour les mappers.
"""
from datetime import date, datetime
from typing import Optional, Union


def parse_date_string(value: Optional[Union[str, date]]) -> Optional[date]:
    """
    Parse une date depuis une chaîne ISO ou retourne l'objet date tel quel.
    Gère les formats 'YYYY-MM-DD' et 'YYYY-MM-DDTHH:MM:SS'.
    """
    if value is None:
        return None
    
    # Si c'est déjà un objet date (mais pas datetime car datetime hérite de date)
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
        
    # Si c'est un datetime, on extrait la date
    if isinstance(value, datetime):
        return value.date()
        
    # Si c'est une string, on tente le parsing
    if isinstance(value, str):
        try:
            # fromisoformat gère le format YYYY-MM-DD et T...
            # On remplace Z par +00:00 pour la compatibilité
            return datetime.fromisoformat(value.replace("Z", "+00:00")).date()
        except ValueError:
            return None
            
    return None
