# Kata badminton

## Règles

- une liste de joueurs et joueuses
- nombre de terrains limité : 6
- organiser les tours par niveau de joueur
- 2h max  20min => 6 tours
- possibilité de faire les rencontres sur 6 tours réévaluer par résultats 
sur 1 semaine
- état se calcule tour a tour
- veiller à assembler les doubles par niveau et sexe
- Maximum de doubles ou à la demande (simples)
- possibilité en cas de joueur impair d'avoir un joueur au repos
- enregistrement des victoires et defaites mettre le ranking des joeurs
- mise à jour du niveau


Cardinalité équipes :
- soit JJ&JJ
- soit J&J

Fonction heuristique de calcul de rang
{
[ELO](https://en.wikipedia.org/wiki/Elo_rating_system)
MMR :
}

[ranking pour ingo](http://www.ffbad.org/module/00003/24/data/Files/2015-2016/Notice_Calcul_Classement.pdf)
https://badmania.fr/classement-moyenne.html

ranking purement points
- 1 victoire : +1 pts
- 1 défaite avec score > 14 : 0 pts
- 1 défaite : -1 pts
- Pas present à l'entrainement : - 3 pts



Nombre de point initiaux : 100

## Contraintes

- Functionnal programming
- Eslint
- Stryker Mutator : https://github.com/trycontrolmymind/ts-jest-stryker-sample

## Améliorations

- points attribués en fonction du différentiel de niveau avec l'adversaire
