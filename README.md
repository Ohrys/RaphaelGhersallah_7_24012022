# Groupomania
Groupomania est le 7ème projet pratique du parcours Développeur Web d'OpenClassroom. 
Son objectif est de concevoir une maquette fonctionnelle visant à reproduire le fonctionnement d'un réseau social interne d'entreprise. 
Vous retrouverez plus bas les diverses manipulations pour exécuter le projet et le tester ainsi que le cahier des charges auquel le projet répond. 

## Comment lancer le projet : 
1. Cloner le repo
2. S'assurer que la version de node est au moins supérieure à la v14 avec `node -v`
3. Lancez la commande `npm run init` à la racine du projet. 
4. Lancez la commande `npm run start` à la racine du projet. 
5. sur [MySQL](https://dev.mysql.com/downloads/workbench/) importez via l'option 'Import from Self-Contained File' le fichier **[groupomania.sql](https://ufile.io/7wl32ejy)**
6. Inscrivez-vous ou connectez-vous avec les deux comptes suivants : 

| Adresse mail           | Mot de Passe | 
|------------------------|--------------|
| support@groupomania.fr | Admin1-      | 
| test@groupomania.fr    | Test1-       | 

7. Testez les différentes fonctionnalités mises en places. 

## Cahier des charges du projet : 
- Présentation simple des fonctionnalités
    * répondu par un design simpliste afin de visualiser les fonctionnalités
- Création d’un compte simple et possible depuis un téléphone mobile 
    * peu de paramètres nécessaire, formulaire s'adaptant aux résolutions mobiles
- Profil avec peu d’information pour faciliter sa complétion 
    * peu de paramètres 
- Suppression du compte possible
    * Présence d'un bouton pour supprimer un compte
- Accès à un forum avec textes et contenus multimédias
    * Possibilité d'attacher une image à une Publication
- Possibilité de repérer rapidement les dernières participations 
    * Publication ordonnée du plus récent au plus ancien sur le site
- Modération des posts possible
    * Possibilité pour le modérateur ou l'auteur du post de supprimer sa Publication ou sa réponse
