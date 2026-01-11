# Cible

## Configuration de l'environnement 

### Téléchargement des dépendances du projet
```
pip install -r requirements.txt
pip install setuptools
```

## Lancement du serveur
```
python manage.py runserver
```

## Lancement des tests
```
tox
```

cette commande lancera les outils 
* isort
* black
* flake8
* pytest


## BDD
la bdd est une sqllite

### Init table
```
python manage.py makemigrations cible
python manage.py migrate
python manage.py createsuperuser
python manage.py initdb
```

la première commande créée un fichier dans le dossier migration avec les propriété a ajouter / changer en bdd
la seconde commande intègre les changements en bdd.
la 3eme commande nécessite de répondre aux "inputs" Username & email pour créer un super user
la 4eme commande initiale la bdd avec les données de référence

## Jeux de démo
Il est possible d'insérer un jeu de démo via
```
python manage.py demo
```
Le jeu sera à compléter au fur et à mesure du dev :)


