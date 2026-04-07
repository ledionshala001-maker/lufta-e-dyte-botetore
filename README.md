# Lufta e Dyte Boterore

Hartë interaktive front-end për një projekt shkolle rreth Luftës së Dytë Botërore. Projekti është ndërtuar vetëm me `HTML`, `CSS` dhe `JavaScript`, përdor `Leaflet.js` për hartën dhe `OpenStreetMap` për tiles.

## Cfare ben projekti

- Shfaq një hartë interaktive me ngjarje të rëndësishme të Luftës së Dytë Botërore.
- Përfshin shumë ngjarje nga `1939` deri në `1945`, të renditura kronologjikisht.
- Ka popups me titull, datë, vend dhe përshkrim të shkurtër për secilën ngjarje.
- Ofron filtra sipas fazës së luftës, vitit dhe llojit të ngjarjes.
- Ka kërkim sipas emrit ose vendit.
- Ka listë interaktive të ngjarjeve që lidhet me hartën.
- Ka butonin `Luaj Kronologjinë` për prezantim hap pas hapi.

## Teknologjite

- `HTML5`
- `CSS3`
- `JavaScript`
- `Leaflet.js`
- `OpenStreetMap`

## Struktura e projektit

- `index.html`  
  Struktura kryesore e faqes dhe panelit interaktiv.

- `style.css`  
  Stilet vizuale, layout-i responsive dhe dizajni i hartës.

- `script.js`  
  Logjika e hartës, filtrat, lista e ngjarjeve, popups dhe kronologjia.

## Si ta hapesh lokalisht

Mënyra më e sigurt është përmes një serveri të thjeshtë lokal:

```bash
python3 -m http.server 8000
```

Pastaj hape:

```text
http://localhost:8000
```

## Publikimi ne GitHub Pages

Ky projekt mund të publikohet në `GitHub Pages`.

Hapat:

1. Shtyje projektin në një repository në GitHub.
2. Hape `Settings`.
3. Shko te `Pages`.
4. Zgjidh `Deploy from a branch`.
5. Zgjidh branch `main`.
6. Zgjidh folder `/(root)`.

URL-ja e publikuar për këtë projekt është:

`https://hamitshala.github.io/lufta-e-dyte-boterore/`

## Shënime

- Projekti është `front-end only`, pa backend.
- Harta bazë vjen nga tiles të OpenStreetMap.
- Etiketat e vetë tiles mund të shfaqen në gjuhë të ndryshme lokale, sepse ato janë pjesë e imazhit bazë të hartës.

## Gjendja aktuale e projektit

Aktualisht projekti përfshin:

- UI në gjuhën shqipe
- dizajn më të pastër dhe më të përshtatshëm për prezantim
- hartë më të qëndrueshme gjatë scroll-it
- ngjarje të shumta historike në vende të ndryshme të botës
- rrjedhë më e pastër e seksionit të hartës me panel udhëzues të ndarë poshtë saj
- responsive layout për desktop dhe mobile
- footer modern me kreditet e nxënësve dhe profesorit
- zoom me rrotën e mausit në hartë

## Gjendja e ruajtur për vazhdim

Projekti është kthyer në versionin origjinal me:

- `Leaflet.js`
- `OpenStreetMap` raster tiles
- popup-et dhe sjelljen origjinale të marker-ave

Gjithashtu janë ruajtur kopje rezervë të këtij versioni:

- `index.leaflet-backup.html`
- `script.leaflet-backup.js`
- `style.leaflet-backup.css`

Kjo do të thotë që herën tjetër mund të vazhdojmë nga kjo pikë pa humbur gjendjen aktuale.

## Ide të hapura për seancën tjetër

Opsionet e lëna për më vonë janë:

1. Të mbajmë hartën origjinale dhe të shtojmë etiketa dygjuhëshe vetëm për vendet e ngjarjeve.
2. Të kalojmë në një hartë vector të personalizueshme ku etiketat mund të bëhen `English / local language`.
3. Të mbajmë hartën origjinale dhe të tregojmë formatin `English / local language` në panel, popup ose tooltip.

## Kreditet

Ky projekt u realizua nga:

- Ledion Shala
- Olti Jusufi
- Vesa Ujkani
- Ruvejda Hetemi

Me mbështetjen e profesorit:

- Lulzim Hajzeri

## Mirëmbajtja e README

Ky `README.md` duhet të përditësohet sa herë që projekti ndryshon ndjeshëm, sidomos kur shtohen:

- veçori të reja
- ndryshime në mënyrën e publikimit
- ndryshime në strukturën e skedarëve
- ndryshime në burimet e hartës ose të të dhënave
