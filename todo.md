1. zobrazit vsetky streamy, ktore patria uzivatelovi s danym `username`

-   podla `username` ziskat vsetky data o uzivatelovi (aj jeho streamy)
-   zobrazit v gride jeho streamy

2. zobrazit konkretny stream s danym `stream key` z archivu

-   dany `stream key` je nazov priecinka, v ktorom sa nachadza hladane .mp4 video

# TODOs

## Autentizacia

-   \*Session key

### Frontend

-   posielat na BE iba hash hesla (najskor si nechat vygenerovat tie hesla)

## Registracia

-   pridat stranku s moznostou registracie (CRUD pre User)

## Backend

-   \*pridat testy
-   \*pridat demo data
-   \*pridat Swagger (na konci podla endpointov)

## Frontend

-   upravit dizajn <iframe> vo VideoPlayer (pouzit <video-react>)
-   opravit zvysovanie count (App.tsx) - pozriet moznosti API:
    -   upravit /inc, /dec cez streamKey
    -   sekcia Profiles/Link nema zvysovat count uzivatelovi (momentalne zvysuje)
    -   \*opravit pricitavanie count-ov (momentalne sa pricita +2, nie +1)
-   \*pridat SnackBar pri prihlaseni

# Refactor (na konci)

-   odstranit nepouzite funkcie
-   presunut konstanty do samostnych suborov
-   skontrolovat syntax pomocou LINT-u
-   usporiadat importy
-   zlucenie DB modelov cez TS typy (aj FE, aj BE)
-   zjednotit nazov "Login" a "SignIn"

## Backend

-   pridat vsade status kody

## Frontend

-   zjednotit design tlacidiel <button>
-   pridat url cesty do suboru s konstantami
-   odstranit priecinok `store`
-   odstranit nepouzite komponenty
-   odstranit nepouzite veci z `/public`
-   odstranit nepouzite veci z `/assets`
