-   pridat fotky k uzivatelom (default obrazok, ktory sa zobrazi, ak uzivatel nema nastavenu fotku) (uzivatel "perro" nema)
-   precistit data (videa), s ktorymi som implementoval feature-y, a zacat pracovat s realnymi datami
-   pridat ikonky ku tlacidlam
-   zmenit ikonku pri editacii videa na stranke profilu
-   zlepsit dizajn (farby, rozlozenie - responzivita, uzsie formulare)
-   responzivny dizajn
-   pridat udaj k formularovym polozkam ohladom minimalnej dlzky, required, ...
-   zobrazenie ulozenych videi po streamovani
    -   pri kliknuti na "Go live" sa vytvori zaznam v databaze
    -   ked OBS Studio skonci streaming, tak sa zaznam ulozi do spolocneho volume
    -   ak OBS Studio nezacne streaming, potom je vytvoreny zaznam bez realneho videa
        -   odstranit zaznam v databaze
        -   pri kliknuti na tlacidlo v profile "End live" skontrolovat, ci existuje nejaky subor - ak nie, odstranit zaznam
        -   skontrolovat na strane FE, ci dane video nehodi chybu (podla console v prehliadaci)

# Kubernetes

-   pridat Frontend
-   pridat Backend

# TODOs

## Formulare (FE)

-   zahrna vsetky `<form>`
-   pri chybe / uspechu

    1. `errorMessage` ako pri `LoginPage`
    2. `alert()`
    3. `Snackbar`

-   \*pridat SnackBar pri prihlaseni / editacii / odstraneni
-   \*pridat `<dialogy>` pri editacii / odstraneni

## Backend

-   \*pridat testy
-   \*pridat demo data
-   \*pridat Swagger (na konci podla endpointov)
-   pridat try-catch bloky do Prismy (pri `create`, `update`, `delete`)

## Frontend

-   pridat default picture, ak chyba niekomu obrazok
-   upravit dizajn `<iframe>` vo VideoPlayer (pouzit `<video-react>`)
-   opravit zvysovanie count (App.tsx) - pozriet moznosti API:
    -   upravit /inc, /dec cez streamKey
    -   sekcia Profiles/Link nema zvysovat count uzivatelovi (momentalne zvysuje)
    -   \*opravit pricitavanie count-ov (momentalne sa pricita +2, nie +1)
-   upravit zmenu profilovej fotky v UserProfilePage (momentalne je `<input>` disabled)

## Autentizacia (BE, FE)

-   \*Session key

# Refactor (na konci)

-   odstranit nepouzite funkcie
-   presunut konstanty do samostnych suborov
-   skontrolovat syntax pomocou LINT-u
-   usporiadat importy
-   zlucenie DB modelov cez TS typy (aj FE, aj BE)
-   zjednotit nazov "Login" a "SignIn"
-   zjednotit "interface" a "type"
-   zjednotnit nazov "recording", "video", "stream"
-   ulozit globalny nazov ukladaneho videa (momentalne `video.mp4`)

## Backend

-   pridat vsade status kody
    -   zistit, ake status kody existuju (uspech 2xx / chyba 4xx)

## Frontend

-   zjednotit design tlacidiel `<button>`
-   pridat url cesty do suboru s konstantami
-   odstranit nepouzite komponenty
-   odstranit nepouzite veci z `/public`
-   odstranit nepouzite veci z `/assets`
