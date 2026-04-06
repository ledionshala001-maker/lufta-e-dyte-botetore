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
  Logjika e hartës, filtrat, lista e ngjarjeve, popups, kronologjia dhe etiketat e shteteve.

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
- panel udhëzues poshtë hartës
- responsive layout për desktop dhe mobile

## Mirëmbajtja e README

Ky `README.md` duhet të përditësohet sa herë që projekti ndryshon ndjeshëm, sidomos kur shtohen:

- veçori të reja
- ndryshime në mënyrën e publikimit
- ndryshime në strukturën e skedarëve
- ndryshime në burimet e hartës ose të të dhënave
