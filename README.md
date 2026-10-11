# Flashcards – Whistleblowers : Friends or Foes ?

Site statique (aucune compilation) : HTML + JS + polices en local, fonctionne hors ligne (PWA).

## Publier sur GitHub Pages
1. Mets tout le contenu de ce dossier à la racine du dépôt (ou dans `/docs`).
2. Settings → Pages → Source : « Deploy from a branch », branche `main`, dossier `/ (root)` (ou `/docs`).
3. Ouvre `https://<user>.github.io/<depot>/` une fois en ligne : l'appli se met en cache et marche ensuite sans connexion.

## Avec GitHub Actions (optionnel)
`.github/workflows/pages.yml` déploie à chaque push sur `main`. Settings → Pages → Source : **GitHub Actions**. La version du cache (`VERSION` dans `sw.js`) est remplacée automatiquement par le commit, donc rien à changer à la main.

## Mettre à jour (sans Actions)
Après une modification, change `VERSION` dans `sw.js` (`v1` → `v2`) pour que les appareils rechargent le cache.

## Installer sur mobile
Android/Chrome : menu ⋮ → « Installer l'application ». iPhone/Safari : Partager → « Sur l'écran d'accueil ».
