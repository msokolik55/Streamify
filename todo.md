# Autentizacia

-   pridat stranku na prihlasenie sa
-   presunut vsetku momentalnu funkcionalitu z ProfilePage do tejto stranky
-   \*Session key

## Frontend

-   v bocnom menu pridat ikonku na prihlasenie sa
-   pridat formular
-   upravit `ProfilePage`, aby nezobrazilo, co nema (presunut do novej stranky - vlastny profil)
-   posielat na BE iba hash hesla

## Backend

-   API pre overenie uzivatela podla username a jeho hesla

# Registracia

-   pridat stranku s moznostou registracie (CRUD pre User)

# TODOs

## Backend

-   \*pridat testy
-   \*pridat demo data
-   \*pridat Swagger (na konci podla endpointov)
-   pridat vsetky migracie

## Frontend

-   presunut sukromne casti z ProfilePage do osobneho profilu (po dokonceni autentizacie)
-   upravit dizajn <iframe> vo VideoPlayer (pouzit <video-react>)
-   opravit zvysovanie count (App.tsx):
    -   upravit /inc, /dec cez streamKey
    -   sekcia Profiles/Link nema zvysovat count uzivatelovi (momentalne zvysuje)
    -   \*opravit pricitavanie count-ov (momentalne sa pricita +2, nie +1)

# Refactor (na konci)

-   odstranit nepouzite funkcie
-   presunut konstanty do samostnych suborov
-   skontrolovat syntax pomocou LINT-u
-   usporiadat importy
-   zlucenie DB modelov cez TS typy (aj FE, aj BE)

## Backend

-   pridat vsade status kody

## Frontend

-   pridat url cesty do suboru s konstantami
-   odstranit priecinok `store`
-   odstranit nepouzite komponenty
-   odstranit nepouzite veci z `/public`
-   odstranit nepouzite veci z `/assets`
