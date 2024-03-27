-   nastudovat si `ffmpeg` (redirecting)
    -   is publishing **spravne** rozpozna vcodec a acodec
    -   is reading **nerozpozna** acodec (mozno treba uviest explicitne)
-   prerobit BE endpointy, aby pouzivali parametre
    -   user.streams.ended (do Prismy sa prida `where { ended: true }`, na FE nemusim riesit filtrovanie)
    -   `/inc`, `/dec`
-   pridat ikonky ku tlacidlam
-   zmenit ikonku pri editacii videa na stranke profilu
-   zlepsit dizajn (farby, rozlozenie - responzivita, uzsie formulare)
-   responzivny dizajn
-   autentizacia pre celu session

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
