# Medusa – Plan für die digitale Ausstellung

Stand: Nov 19, 2026

## Überblick

Die Abgabe ist eine Premium-Website über Medusa: ein Scroll-Film auf der Startseite und neun Szenen (Α–Ω), abgegeben als HTML-Paket und als PDF aus derselben Seite. Dieser Plan ist das Arbeitsdokument; der Build-Brief fasst daraus die Bau-Vorgaben für Claude Code zusammen.

**Leitfrage der Ausstellung:** Wie wurde aus einem Schutzzeichen und Monster eine Opferfigur und feministische Ikone – und was sagt das über die jeweilige Zeit?

| Punkt | Festlegung |
| --- | --- |
| Thema | Medusa: Herkunft, Mythos, Deutungen, Kunst, Literatur, Nachwirkung |
| Abgabe | HTML-Paket als ZIP-Ordner + PDF, beides aus einer gemeinsamen Quelle |
| Umfang | Startseite (Scroll-Film), 9 Szenen Α–Ω, Glossar, Quellen und Bildnachweis |
| Textmenge | ca. 5.000 Wörter gesamt, im PDF etwa 15–18 Seiten |
| Bilder | ca. 15–20 Abbildungen, alle mit Bildnachweis |
| Zielgruppe | Lehrkraft und Klasse; verständlich ohne Vorwissen |
| Sprache | Deutsch, Zitate aus antiken Texten in deutscher Übersetzung |

**Noch zu klären (vor dem Bauen):**

- [x] Umfang: keine Obergrenze, also die ausführliche Fassung
- [x] Zitierweise: Kurzbeleg im Text (Autor, Werk oder Jahr, Stelle), vollständige Angaben im Quellenverzeichnis
- [x] Dateigröße: keine Grenze für die ZIP-Datei
- [x] Szenen-Bilder und -Videos: alle KI-generiert (im Bildnachweis gekennzeichnet); echte Kunstwerke lädt Claude Code von Wikimedia Commons
- [x] Zitate: jede Szene bekommt ein starkes Motto-Zitat, siehe „Saal-Mottos“ im Dossier

## Startseite: Die Verwandlung

Die Startseite zeigt beim Scrollen die ganze Ausstellung im Zeitraffer: Eine Marmorfrau wird zur Gorgone und schließlich zum Zeichen auf Athenas Schild. Gebaut wird sie nach dem Prinzip „Assets zuerst“: erst Bilder und Clips erzeugen, dann programmieren, weil der Stil der Bilder Farben und Layout vorgibt.

**Stand 20.11.:** Das finale Video ist fertig (9 s, 216 Bilder, 1920 × 1080). Für die Umsetzung gelten das gemessene Frame-Timing und alle Bau-Vorgaben im [Build-Brief](https://claude.ai/artifact/CwWgyxFho4XW8XUfe7E7cA); bei Abweichungen geht der Build-Brief vor.

### Ablauf beim Scrollen

| Phase | Bilder im Video | Scroll-Anteil | Was passiert | Teaser-Text | Verweist auf |
| --- | --- | --- | --- | --- | --- |
| 1 Die Frau | 0–40 | 0–10 % | Marmorfrau, gesenkter Kopf | Riesiges „MEDUSA“ links im Lichtbündel; „Monster, Opfer, Schutzzeichen, Ikone“ | – |
| 2 Der Fluch | 40–96 | 10–35 % | Kopf hebt sich, Haare werden zu Schlangen | „Sie war eine Frau.“ → „Dann kam der Fluch.“ | Β Mythos |
| 3 Der Blick | 96–108 | 35–42 % | starrer Blick, Risse | „Wer sie ansah, wurde zu Stein.“ | Α Herkunft, Γ Perseus |
| 4 Die Explosion | 108–160 | 42–68 % | Zersplittern auf die Kamera zu | „Perseus nahm ihr den Kopf.“ | Γ Perseus |
| 5 Das Zeichen | 160–200 | 68–82 % | Teile setzen sich zum Bronzeschild zusammen | „Ihr Kopf wurde zur Waffe – und zum Schutz.“ | Δ Schutzzeichen, Ε Deutungen |
| 6 Bis heute | 200–215 | 82–88 % | fertiger Schild | „Bis heute.“ | Ζ–Ω |
| 7 Übergang | – | 88–100 % | Schild bleibt groß stehen und wird zum Schild-Rad: neun Kapitel am Rand, das Menü der Website | – | – |

### Alle Prompts der Startseite

Alle Bilder und Clips sind erzeugt, das finale Video (`medusa-homepage-video-final.mp4`, 9 s, 216 Bilder, 1920 × 1080) ist fertig. Die Prompts unten sind die Fassungen, mit denen die verwendeten Bilder und Clips entstanden sind – als Dokumentation für den Anhang und falls etwas neu erzeugt werden muss.

**Stil-Baustein Bild** (steckt schon in A und B, für X und C ausgeschrieben):

```
cinematic low-angle shot, the marble bust fills about 75% of the frame height, small black margin above the head, no pedestal, the bottom of the bust fades softly into darkness, dramatic chiaroscuro lighting: strong rim light from upper left, the right half of the face falls into deep shadow, warm golden accent light, faint volumetric haze and floating dust particles catching the light, shallow depth of field, pure black background, ultra detailed white Carrara marble, fine film grain, 16:9, 4K, no text, no watermark
```

**1 · Bild A „Die Frau“** ✓ erzeugt

```
Classical Greek marble bust of a young woman, head slightly lowered and tilted, eyes gently closed, serene and melancholic expression, long wavy hair resting on her shoulders, in the style of 5th century BC Greek sculpture, museum quality, [Stil-Baustein Bild]
```

**2 · Bild B „Die Gorgone“** ✓ erzeugt (Bearbeitung von A)

```
Same marble bust, same framing, same distance and lighting as the reference image. Her head is now raised and she stares directly into the camera with a cold petrifying gaze, faint gold glow in the irises, her hair has turned into dozens of writhing marble snakes that stay close to her head and remain inside the frame, fine cracks spreading across the marble skin, [Stil-Baustein Bild]
```

**3 · Bild X „Die Explosion“** (Bearbeitung von B)

```
Ultra slow-motion high-speed photograph of a snake-haired marble Medusa bust exploding. Same face, same cold golden-eyed stare and same low-angle framing as the reference image. Her face is still intact at the center while everything around it bursts apart: hundreds of ivory marble shards, fragments of the draped chiton and broken stone snakes fly outward and toward the camera, some shards sharp in the foreground, others motion-blurred. Glowing golden cracks run through the remaining marble. A burst of gold dust and sparks fills the warm amber volumetric light beam from the upper left, the right side falls into deep black. Photorealistic, ultra detailed Carrara marble, shallow depth of field, filmic grain, 16:9, 4K. No text, no watermark, no fire, no blood, no extra faces.
```

**4 · Bild C „Das Zeichen“**

```
Hero shot of a round ancient Greek bronze shield floating in darkness, seen straight on from a slightly low angle. At its center a high-relief Gorgoneion: Medusa's face with the same features and cold stare as the reference image, framed by coiled bronze snakes. Aged dark bronze with verdigris in the recesses, polished gold highlights on the edges and snake scales, a rim decorated with a Greek meander pattern. A few last marble shards and gold dust still drift around the shield. Warm amber volumetric light beam from the upper left, right side in deep black. The complete shield including its rim is visible with black space around it and fills about 70% of the frame height. Photorealistic, ultra detailed, filmic grain, 16:9, 4K. No text, no watermark, no hands, no warrior.
```

**5 · Clip 1 „Der Fluch“** (Startbild A, Endbild B, 5 Sekunden)

```
One continuous cinematic shot in slow motion, photorealistic marble, seamless transformation from the first frame to the last frame. Camera: slow, smooth pull-back and slight rise, moving from the close-up of the first frame to the wider, centered framing of the last frame. 0–1.5 s: the marble woman with closed eyes and lowered head stays still, dust drifts through the warm amber light beam from the upper left. 1.5–3.5 s: she slowly raises her head until she faces the camera straight on; at the same time every wavy lock of her hair comes alive and turns into a thin stone snake of exactly the same size, following the existing curls, the snakes curling around her head, no snake larger than a lock of hair. Thin dark hairline cracks appear on her forehead and cheeks. 3.5–5 s: her eyes slowly open, revealing muted amber irises, and settle into a cold, still stare into the lens; her shoulders and drapery sink softly into darkness. Deep black background on the right, filmic grain, shallow depth of field. No cuts.
```

**6 · Clip 2 „Der Blick“** (Startbild B, Endbild X, 5 Sekunden)

```
One continuous shot in ultra slow motion, high-speed camera look. Locked-off camera with a subtle shake at the moment of impact. 0–1 s: Medusa stares into the lens, the stone snakes coil. 1–2 s: dark cracks spread across her face and body. 2–5 s: the bust bursts outward, hundreds of marble shards and broken stone snakes fly toward and past the camera, gold dust erupts through the amber light beam, her face stays intact at the center. Photorealistic stone physics, deep black background, filmic grain. No glow, no fire, no blood, no morphing, no cuts.
```

**7 · Clip 3 „Das Zeichen“** (Startbild X, Endbild C, 5 Sekunden)

```
One continuous shot in slow motion. The camera pulls back slowly and steadily during the whole shot, from the close framing of the first frame to the wider framing of the last frame. 0–1.5 s: the marble shards and stone snakes hang weightless in the air, then reverse direction. 1.5–3 s: they fly back inward and lock together piece by piece, rebuilding Medusa's head; the snakes stay thin and close to her head. 3–4 s: the outer fragments do not join the head; they fly into a perfect circle around it and fuse into the round rim of a shield with a Greek meander border, while smaller fragments fill the space between head and rim and flatten into a solid disc. 4–5 s: as the shield locks together, the material darkens from ivory marble to aged bronze in a wave from the rim toward the face, gold highlights catch the light, the last dust drifts down. Warm amber volumetric light from the upper left, deep black background, photorealistic, filmic grain. No cuts.
```

**Was sich bewährt hat:** Haare zu Schlangen nur „in exakt derselben Größe“ verlangen, sonst entstehen Riesenschlangen; Kamerabewegung im Prompt an den Größenunterschied zwischen Start- und Endbild anpassen; Explosion und Zusammensetzen funktionieren, weil sie echte Physik sind. Die Clips kamen stark nachgeschärft aus dem Generator und wurden per ffmpeg weichgezeichnet und farblich angeglichen.

### Verarbeitung beim Bauen (Claude)

- Das finale Video in Einzelbilder zerlegen: 216 Bilder für Desktop (1920 px breit) und 216 für Handy (1280 px breit), als WebP.
- Beim Scrollen werden die Einzelbilder auf ein Canvas gezeichnet (Cover-Zuschnitt, Fokuspunkt 52 % / 48 %); das läuft flüssiger als ein Video, das vor- und zurückgespult wird.
- Effekte im Code: dezenter Lichtblitz beim Blick, leichtes Wackeln bei der Explosion, Staubpartikel im Vordergrund, „MEDUSA“ links im Lichtbündel.
- Am Ende wird der Schild freigestellt und zum Schild-Rad mit neun Kapitel-Segmenten; klein ist er auf allen Unterseiten das Logo, das dasselbe Rad als Menü öffnet.
- „Bewegung reduzieren“: nur Bild C als Standbild, die Teaser-Texte untereinander.
- PDF: A, B, X und C als Bildreihe mit den Teaser-Texten.

### Kennzeichnung

Im Bildnachweis jedes KI-Bild als „KI-generiert mit \[Werkzeug\]“ kennzeichnen und die Prompts im Anhang dokumentieren. Vorher klären, ob die Lehrkraft KI-Bilder erlaubt.

## Bauplan

Eine einzige HTML-Seite ist die Quelle für beides: im Browser die Ausstellung, über eine eigene Druckansicht das PDF. So muss jeder Text nur einmal gepflegt werden.

### Dateien und Ordner

```
medusa-website/
├── index.html            Startseite: Scroll-Film + Szenen-Übersicht
├── szenen/               herkunft, mythos, perseus, schutzzeichen, deutungen,
│                         literatur, kunst, heute, fazit (.html)
├── css/                  style.css, print.css
├── js/
│   ├── main.js           Lenis + GSAP-Takt, Navigation, Menü, Seitenübergänge
│   ├── hero.js           Scroll-Film der Startseite (Canvas)
│   ├── szenen/           ein Skript pro Szene
│   └── vendor/           gsap, ScrollTrigger, SplitText, DrawSVGPlugin, lenis
├── media/                hero/, bilder/, videos/, ui/
├── fonts/                Big Shoulders Display, Instrument Serif, Manrope, GFS Didot
└── LIESMICH.txt
```

Das PDF wird aus `index.html` erzeugt (Browser: Drucken → Als PDF speichern, oder automatisch per Headless-Browser). Ordner und PDF werden zusammen als ZIP abgegeben.

### Seitenstruktur

Mehrseitige Website, kein Onepager und keine Museums-Optik: eine Startseite, deren Scroll-Film selbst die Navigation ist, dazu eine eigene Unterseite pro Szene mit Seitenübergängen. In der Bildliste stehen die Szenen noch als römische Ziffern (I = Α, II = Β … IX = Ω).

1. Startseite (`index.html`): Scroll-Film; der Film ist die Navigation – klickbare Kapitel in jeder Phase, Kapitelleiste, am Ende das Schild-Rad als Menü
2. Α Herkunft (`szenen/herkunft.html`)
3. Β Mythos (`szenen/mythos.html`)
4. Γ Perseus (`szenen/perseus.html`)
5. Δ Schutzzeichen (`szenen/schutzzeichen.html`)
6. Ε Deutungen (`szenen/deutungen.html`)
7. Ζ Literatur (`szenen/literatur.html`)
8. Η Kunst (`szenen/kunst.html`)
9. Θ Heute (`szenen/heute.html`)
10. Ω Fazit (`szenen/fazit.html`) mit Abspann: Quellen, Bildnachweis, Glossar

### Komponenten

| Komponente | Zweck | Einsatz | Im PDF |
| --- | --- | --- | --- |
| Logo (Bronzeschild) | Klick = zurück zum Anfang | immer oben links | klein im Kopf |
| Kopfleiste | aktueller Abschnitt mittig, „Menü“ rechts; versteckt sich beim Runterscrollen, erscheint beim Hochscrollen | überall | entfällt |
| Vollbild-Menü | alle Abschnitte groß untereinander, Hover zeigt das passende Bild im Hintergrund | über „Menü“ | wird Inhaltsverzeichnis |
| Fortschritts-Schlange | dünne Linie am Rand, wächst beim Scrollen | überall | entfällt |
| Szenen-Titel | Nummer, Titel, Motto-Zitat | jeder Abschnitt | neue Seite pro Abschnitt |
| Weiterlesen-Panel | längere Texte klappen seitlich auf, damit die Szene nicht zugetextet wird | alle Abschnitte | ausgeklappt |
| Fixiertes Bild mit wanderndem Text | Bild bleibt stehen, Text zieht vorbei, Bild wechselt mit | Mythos | untereinander |
| Horizontaler Fries | Scrollen nach unten bewegt Bilder seitwärts | Perseus | Bildreihe |
| Spiegelschild | Szene nur durch einen runden Spiegel sichtbar, der Maus bzw. Finger folgt | Perseus | Standbild |
| Verwandlungs-Scrub | Bild verwandelt sich beim Scrollen | Schutzzeichen | drei Bilder nebeneinander |
| Kartenstapel | Vollbild-Karten legen sich übereinander | Deutungen | untereinander |
| Wort-für-Wort-Zitat | Zitat baut sich beim Scrollen auf | Literatur | normaler Text |
| Cursor-Vorschau-Liste | Werktitel als Liste, Bild erscheint an der Maus, Klick öffnet Vollbild | Kunst | Bild und Text pro Werk |
| Vergleichsregler | Cellini ↔ Garbati durch Ziehen vergleichen | Kunst | beide Bilder |
| Video-Kacheln | stumme Videos, starten beim Hovern bzw. beim Sichtbarwerden am Handy | Heute | Standbilder |
| Abspann | Quellen und Bildnachweis laufen wie ein Filmabspann | Fazit | Quellenverzeichnis |
| Fußnote, Glossar-Begriff | Beleg bzw. Erklärung zum Fachwort | überall | bleiben |

### Design-System „Versteinert“

Dunkel, filmisch und monumental wie in deinen Referenzen: Steinfiguren in Schwarz-Weiß, riesige Schrift hinter den Figuren, Gold als einzige Farbe. Die Idee dahinter: Die Seite selbst ist versteinert – Farbe gibt es nur dort, wo Medusa lebendig wird.

| Referenz | Was wir übernehmen | Umsetzung bei Medusa |
| --- | --- | --- |
| Mythos 2.0, Engel-Statue | Figur vor riesigem Schriftzug | Scroll-Film mit „MEDUSA“ groß im Lichtbündel |
| Ägypten-Spieleseite | Wechsel dunkel ↔ hell, verstreute Kleintexte | Mythos-Szenen dunkel, Analyse-Szenen hell wie Marmor |
| Aerion | Feine Serifenschrift, Zähler, Scroll-Hinweis | Szenen-Anzeige „Γ · Perseus“, Scroll-Hinweis auf der Startseite |
| alle | Wenig Text pro Bildschirm, viel Bild | höchstens 2–3 kurze Absätze pro Bildschirm, Rest im Weiterlesen-Panel |

**Farben**

| Token | Wert | Verwendung |
| --- | --- | --- |
| Nacht | #0D0F0E | Hintergrund dunkler Szenen |
| Stein | #1C201E | Flächen, Karten, Menü |
| Marmor | #E8E4DC | Text auf Dunkel, Hintergrund heller Szenen |
| Asche | #8E938F | Kleintexte, Linien |
| Gold | #C9A46A | einzige Akzentfarbe: Nummern, Links, Linien, Fortschritts-Schlange |
| Bernstein | #B8783A | Lichtbündel, Glanz (nur in Verläufen, nie als Textfarbe) |

**Schriften**

- Riesenwörter und Ziffern: Big Shoulders Display (schmal, monumental)
- Überschriften und Zitate: Instrument Serif (elegant, wie bei Aerion)
- Fließtext und Navigation: Manrope
- Griechische Zierzeilen wie ΜΕΔΟΥΣΑ oder ΓΟΡΓΩ: GFS Didot
- Größen: Riesenwort 18–28 % der Bildschirmbreite, Saaltitel 48–72 px, Text 18 px mit Zeilenhöhe 1,65

**Texturen:** feines Filmkorn über der ganzen Seite, Vignette an den Rändern, Marmoräderung in hellen Szenen; Übergänge zwischen Szenen mit Rauch- oder Marmor-Video.

### Animationen und Interaktionen

Pro Saal genau ein großer Moment, dazwischen ruhige Einblendungen. Mit der Systemeinstellung „Bewegung reduzieren“ ist alles statisch und trotzdem vollständig lesbar.

| Abschnitt | Darstellung | Was der Besucher tut | Technik |
| --- | --- | --- | --- |
| Startseite | Verwandlung als Film: Frau → Gorgone → Explosion → Schild; der Schild fliegt nach oben links und wird zum Logo | Scrollen spult den Film vor und zurück | Canvas-Bildsequenz, ScrollTrigger-Pin |
| Herkunft | Schwarz; der Stammbaum zeichnet sich als goldene Linien, Namen erscheinen groß | Scrollen lässt die Linien wachsen | DrawSVG, SplitText |
| Mythos | Bild links fixiert, Hesiod, Ovid und Apollodor ziehen rechts vorbei, das Bild wechselt mit; bei Ovid versteinert es | Scrollen | Pin, Überblendung, Filter |
| Perseus | Horizontaler Fries mit den neun Burne-Jones-Bildern; danach wird es dunkel, und Medusa ist nur im Spiegelschild sichtbar | Scrollen bewegt den Fries seitwärts; Maus oder Finger führt den Spiegel | Pin mit Seitwärtsbewegung, Maske |
| Schutzzeichen | Ein Gesicht verwandelt sich von der archaischen Fratze zur schönen Medusa (echte Objekte) | Scrollen | Überblendung mit Scroll-Steuerung |
| Deutungen | Sechs Vollbild-Karten stapeln sich übereinander | Scrollen legt die nächste Karte darauf | Sticky-Stapel |
| Literatur | Nur Schrift auf Schwarz, Zitate bauen sich Wort für Wort auf | Scrollen | SplitText |
| Kunst | Liste der Werktitel, das Bild erscheint an der Maus; Vergleichsregler Cellini ↔ Garbati | Hovern, Klick öffnet Vollbild, Regler ziehen | Cursor-Vorschau, Flip |
| Heute | Raster aus stummen Video-Kacheln | Hovern startet das Video | Videos laden erst bei Sichtbarkeit |
| Fazit | Die Augen öffnen sich, die Seite wird von Stein zu Farbe, danach läuft der Abspann | Scrollen | Filter, Abspann-Animation |
| zwischen allen | Übergang mit Rauch- oder Marmor-Video statt harter Kante | – | Video-Maske |

### Videos

- Quelle: KI-generiert (erlaubt), Prompts in der Prompt-Bibliothek.
- Geplante Clips: Rauch im Lichtbündel und Marmor-Makro (Übergänge), Fackelschein (Γ Perseus), Qualle und Cisterna Basilica (Θ Heute).
- Format: MP4 (H.264) und WebM, 720p, 6–10 Sekunden als Schleife, ohne Ton, dazu ein Standbild für PDF und langsame Geräte.
- Keine Größengrenze, trotzdem schlank halten, damit die Seite schnell lädt.

### Technik

- GSAP mit ScrollTrigger, SplitText und DrawSVG; seit 2025 komplett kostenlos, auch die früheren Bezahl-Plugins ([GSAP-Lizenz](https://gsap.com/community/standard-license/)).
- Lenis für weiches Scrollen.
- Alle Bibliotheken lokal in `js/vendor/`, damit die Ausstellung offline läuft.
- Freisteller (Medusenkopf ohne Hintergrund) per automatischer Hintergrund-Entfernung beim Bauen, gespeichert als WebP mit Transparenz.
- Leistung: Bilder als WebP unter 300 KB, Videos erst laden, wenn sie ins Bild kommen.
- Barrierefreiheit: „Bewegung reduzieren“ schaltet Animationen ab und pausiert Videos; Regler und Karten auch per Tastatur bedienbar.

Wichtig für den Premium-Look: Die Wirkung hängt vor allem an guten Freistellern und ruhigen, dunklen Videos. Die Bildauswahl ist deshalb genauso wichtig wie der Code.

### Druckansicht (print.css)

- A4 hochformat, Ränder 20 mm, immer die helle Variante (Marmorgrund, dunkle Schrift)
- Jeder Saal beginnt auf neuer Seite; Bilder und Kästen werden nicht zerteilt
- Alle Animationen im Endzustand; Videos durch ihr Standbild ersetzt; Fries und Kartenstapel untereinander; die Startseiten-Verwandlung als Reihe der drei Schlüsselbilder
- Cursor, Ladebildschirm und Navigationsleiste ausgeblendet
- Seitenzahlen unten, Links mit Zieladresse in Klammern

## Detaillierte Gliederung

Startseite plus neun Szenen mit zusammen ca. 5.400 Wörtern; jede Szene hat ihren eigenen großen Moment, Bilder und einen Merkkasten. Die Fakten stehen im Recherche-Dossier, die Bilder in der Bildliste, Darstellung und Interaktion in der Szenen-Tabelle im Bauplan.

| Bereich | Ziel-Länge | Bilder | Großer Moment |
| --- | --- | --- | --- |
| Startseite | 150 Wörter Teaser | Scroll-Film | Verwandlung, Schild wird Logo |
| Α Herkunft | 450 Wörter | 2 | Stammbaum zeichnet sich |
| Β Mythos | 600 Wörter | 2 | fixiertes Bild, Versteinerung |
| Γ Perseus | 650 Wörter | 9 + 3 | Fries und Spiegelschild |
| Δ Schutzzeichen | 500 Wörter | 4 | Verwandlungs-Scrub |
| Ε Deutungen | 900 Wörter | 6 | Kartenstapel |
| Ζ Literatur | 450 Wörter | 1–2 | Zitate Wort für Wort |
| Η Kunst | 650 Wörter | 8 | Cursor-Vorschau, Vergleichsregler |
| Θ Heute | 500 Wörter | 4–6 | Video-Raster |
| Ω Fazit | 350 Wörter + Abspann | 1 | Augen öffnen sich, Abspann |
| Glossar | 250 Wörter | – | Teil des Abspanns |

### Startseite

- Scroll-Film mit Teaser-Texten (siehe „Startseite: Die Verwandlung“)
- Motto: Macbeth-Zitat
- Scroll-Hinweis und leeres Namensfeld zum Selbst-Ausfüllen
- Der Film ist die Navigation: klickbare Kapitel in jeder Phase, am Ende das Schild-Rad als Menü

### Α – Herkunft und Familie

- Medusa als eine der drei Gorgonen; Eltern Phorkys und Keto
- Schwestern Stheno und Euryale unsterblich, nur Medusa sterblich
- Die Graien als weitere Schwestern (ein Auge, ein Zahn)
- Aussehen laut antiken Texten: Schuppen, Hauer, Bronzehände, goldene Flügel
- Wohnort am Rand der Welt (Okeanos, äußerster Westen)
- Merkkasten: Was die Namen bedeuten
- Bilder: antike Gorgonen-Darstellung auf einer Vase; Stammbaum als Grafik

### Β – Mythos: drei Versionen

- Warum es nicht „die eine“ Geschichte gibt: Mythen wurden immer neu erzählt
- Hesiod (um 700 v. Chr.): Gorgone von Geburt an, keine Schuld, keine Strafe
- Ovid (um 8 n. Chr.): schöne Frau, Vergewaltigung im Tempel, Strafe durch Athena
- Apollodor (1./2. Jh. n. Chr.): Variante, in der Medusa sich mit Athena an Schönheit messen wollte
- Vergleichstabelle: Quelle, Zeit, Medusas Rolle, Schuldfrage, Wirkung
- Quellenzitat: zwei kurze Stellen aus Ovid in deutscher Übersetzung
- Merkkasten: Ovid nennt die Götter mit römischen Namen (Minerva, Neptun)
- Bilder: Ovid-Handschrift oder -Druck; antike Darstellung von Athena mit Aigis

### Γ – Perseus und Medusas Tod

- Ablauf in 8 Stationen: Vorgeschichte (Danaë), List des Polydektes, Graien, Nymphen und Ausrüstung, Enthauptung mit dem Spiegelschild, Geburt von Pegasus und Chrysaor, Flucht und Andromeda, Rückkehr und Übergabe an Athena
- Merkkasten: Medusas Blut heilt und tötet
- Merkkasten: Woher Pegasus seinen Namen hat
- Nachspiel: Erfüllung des Orakels (Perseus tötet seinen Großvater Akrisios versehentlich)
- Bilder: antike Vase mit Perseus; Darstellung der Graien; Pegasus

### Δ – Schutzzeichen: das Gorgoneion

- Begriff Gorgoneion und „apotropäisch“ erklären
- Wo es auftaucht: Schilde, Rüstungen, Dachziegel, Münzen, Mosaike, Tempel
- Korfu: ältester erhaltener großer Steingiebel Griechenlands
- Bildreihe „Wandel des Gesichts“: archaische Fratze → Übergangstyp → „schöne Medusa“ (Rondanini)
- Merkkasten: Kaiser Wilhelm II. und die Gorgo von Korfu
- Bilder: Korfu-Giebel; archaisches Gorgoneion; Übergangstyp; Medusa Rondanini

### Ε – Deutungen

- Einleitung: Mythen haben keine einzige richtige Bedeutung
- Reiter 1, Schutzzeichen: das Schreckliche wehrt das Schreckliche ab
- Reiter 2, Opfer: Täter-Opfer-Umkehr bei Ovid
- Reiter 3, Ordnung gegen Chaos: der Held besiegt das Wilde
- Reiter 4, Der Blick: Spiegel, Kunst, wer wen ansehen darf
- Reiter 5, Psychoanalyse: Freud (1922/1940) und die Kritik daran
- Reiter 6, Feminismus: Cixous (1975), Medusa als Symbol weiblicher Wut
- Kasten „Umstritten“: die moderne Lesart „Athena wollte Medusa schützen“
- Jeder Reiter: Kernaussage, Belegstelle, Gegenargument (je ca. 140 Wörter)

### Ζ – Literatur

- Antike: Homer (Gorgonenhaupt auf Schilden), Pindar, Ovid, Lucan
- Mittelalter: Dante, Inferno IX – Vergil hält Dante die Augen zu
- Klassik und Romantik: Goethe und die Medusa Rondanini; Shelleys Medusa-Gedicht
- Gegenwart: feministische Neuerzählungen (Haynes, Burton), Jugendbuch (Percy Jackson)
- Werkkarte pro Werk: Autor, Jahr, Rolle der Medusa, ein Satz Deutung

### Η – Kunst

- Werkkarten in zeitlicher Reihenfolge: Korfu-Giebel (Verweis auf Δ), Cellini, Caravaggio, Rubens/Snyders, Canova, Burne-Jones, Böcklin, Garbati
- Pro Werk: was man sieht, was es aussagt, wo es heute ist
- Vergleich Cellini ↔ Garbati als Doppelbild (Rollentausch)
- Merkkasten: Das „Floß der Medusa“ hat nichts mit der Gorgone zu tun (Schiffsname)

### Θ – Heute

- Raster mit 6 Feldern: Flagge Siziliens, Mode (Versace), #MeToo und Medusa-Tattoos, Literatur und Film, Biologie (Medusen/Quallen), Orte (z. B. Medusenköpfe in der Cisterna Basilica, Istanbul)
- Je Feld: 60–80 Wörter, ein Bild

### Ω – Fazit und Zeitstrahl

- Zeitstrahl mit ca. 12 Stationen von Hesiod bis Garbati
- Fazit: Antwort auf die Leitfrage in 3 Absätzen
- Eigene Stellungnahme (von dir geschrieben)

### Glossar

- Aigis, apotropäisch, Gorgoneion, Graien, Harpe, Kibisis, Metamorphose, Okeanos, Täter-Opfer-Umkehr, Écriture féminine

## Recherche-Dossier

Alle Fakten unten sind aus geöffneten Quellen belegt; Punkte mit „prüfen“ stammen aus Allgemeinwissen und müssen vor dem Einbau noch nachgeschlagen werden. Widersprüche zwischen Quellen stehen gesammelt am Ende des Dossiers.

### Α – Herkunft und Familie

- Die drei Gorgonen Stheno, Euryale und Medusa sind Töchter von Phorkys und Keto und Schwestern der Graien (Hesiod, Apollodor). [Wikipedia: Gorgon](https://www.Wikipedia.org/wiki/Gorgon)
- Nur Medusa ist sterblich; genau deshalb wird Perseus nach ihrem Kopf geschickt (Apollodor 2.4.2). [Apollodor, Perseids](https://cts.perseids.org/read/greekLit/tlg0548/tlg001/perseus-eng2/2.4.2-2.4.8)
- Aussehen bei Apollodor: Köpfe mit Drachenschuppen, Hauer wie Wildschweine, Hände aus Bronze, goldene Flügel zum Fliegen. [Apollodor 2.4.1–12](https://fgh.perseids.org/read/greekLit/tlg0548/tlg001/perseus-eng2/2.4.1-2.4.12)
- Wohnort bei Hesiod: im westlichen Okeanos, nahe der Nacht und den Hesperiden. Andere Autoren verlegen die Gorgonen in den fernen Osten oder nach Libyen. [theoi.com](https://ftp.theoi.com/Pontios/Gorgones.html), [Wikipedia: Gorgons](https://www.Wikipedia.com/wiki/Gorgons)
- Namensbedeutung: Stheno „die Mächtige“, Euryale „die weit Springende“, Medusa „die Herrscherin“. [Britannica Kids](https://kids.britannica.com/students/article/Gorgon/324903)
- Die Graien sind von Geburt an alt und teilen sich ein Auge und einen Zahn. [Apollodor 2.4.1–12](https://fgh.perseids.org/read/greekLit/tlg0548/tlg001/perseus-eng2/2.4.1-2.4.12)

### Β – Mythos: drei Versionen

| Quelle | Zeit | Medusa ist … | Schuldfrage | Beleg |
| --- | --- | --- | --- | --- |
| Hesiod, Theogonie 270 ff. | 8./7. Jh. v. Chr. | von Geburt an Gorgone | keine; Poseidon liegt mit ihr auf einer Frühlingswiese | [greek-gods.org](https://www.greek-gods.org/sources/medusa.php) |
| Ovid, Metamorphosen 4,794–803 | um 8 n. Chr. | schöne Frau, berühmt für ihr Haar | Neptun vergewaltigt sie im Minerva-Tempel; bestraft wird Medusa | [Roman Empire Times](https://romanempiretimes.com/did-ovid-change-the-greek-medusa-myth-forever/) |
| Apollodor, Bibliotheke 2.4 | 1./2. Jh. n. Chr. | Variante: wollte sich mit Athena an Schönheit messen | Medusas Hochmut | [Apollodor, WSU](https://public.archive.wsu.edu/hughesc/public_html/apollodorus_perseus.html) |

- Ovid ist die früheste erhaltene Quelle für Vergewaltigung im Tempel und Verwandlung als Strafe. [Tales of Times Forgotten](https://talesoftimesforgotten.com/2022/09/07/no-athena-didnt-turn-medusa-into-a-monster-to-protect-her)
- Bei Ovid erzählt Perseus selbst die Geschichte, beim Hochzeitsmahl am Hof des Kepheus. [Eclectic Light](https://eclecticlight.co/2017/05/24/changing-stories-ovids-metamorphoses-on-canvas-21-perseus-and-medusa/)
- Minerva wendet sich ab, bedeckt ihre Augen mit der Aigis und verwandelt dann das Haar in Schlangen; später trägt sie die Schlangen selbst auf dem Brustpanzer. [Roman Empire Times](https://romanempiretimes.com/did-ovid-change-the-greek-medusa-myth-forever/)
- Bei Hesiod entspringen Chrysaor und Pegasus ihrem Blut; Pegasus heißt nach den Quellen (griech. pēgai) des Okeanos. [greek-gods.org](https://www.greek-gods.org/sources/medusa.php)

### Γ – Perseus

1. Vorgeschichte: Ein Orakel sagt Akrisios, der Sohn seiner Tochter Danaë werde ihn töten; er setzt Mutter und Kind in einer Kiste aufs Meer aus. [Apollodor 2.4.1–12](https://cts.perseids.org/read/greekLit/tlg0548/tlg001/perseus-eng2/2.4.1-2.4.12)
2. List: Polydektes sammelt angeblich Hochzeitsgeschenke für Hippodameia; Perseus prahlt, er würde sogar das Gorgonenhaupt bringen. [Apollodor, WSU](https://public.archive.wsu.edu/hughesc/public_html/apollodorus_perseus.html)
3. Graien: Perseus nimmt ihnen Auge und Zahn und gibt sie erst zurück, als sie den Weg zu den Nymphen zeigen. [Apollodor 2.4.2–8](https://cts.perseids.org/read/greekLit/tlg0548/tlg001/perseus-eng2/2.4.2-2.4.8)
4. Ausrüstung: Flügelsandalen, Tasche (Kibisis), Tarnkappe des Hades; von Hermes eine Sichel aus Adamant (Harpe). [Biblical Archaeology](https://library.biblicalarchaeology.org/sidebar/perseus-and-medusa/)
5. Enthauptung: Die Gorgonen schlafen; Athena führt seine Hand, er blickt nur in den Bronzeschild. [Biblical Archaeology](https://library.biblicalarchaeology.org/sidebar/perseus-and-medusa/)
6. Flucht: Die Schwestern verfolgen ihn, sehen ihn aber wegen der Tarnkappe nicht. [Apollodor 2.4.2–8](https://cts.perseids.org/read/greekLit/tlg0548/tlg001/perseus-eng2/2.4.2-2.4.8)
7. Andromeda: Perseus rettet sie und versteinert später Phineus und dessen Mitverschwörer. [Apollodor 2.4.1–12](https://cts.perseids.org/read/greekLit/tlg0548/tlg001/perseus-eng2/2.4.1-2.4.12)
8. Rückkehr: Polydektes wird versteinert, Diktys wird König, die Ausrüstung geht an Hermes zurück, der Kopf an Athena. [Apollodor 2.4.1–12](https://cts.perseids.org/read/greekLit/tlg0548/tlg001/perseus-eng2/2.4.1-2.4.12)
9. Nachspiel: Bei Wettkämpfen in Larissa trifft Perseus Akrisios mit dem Diskus am Fuß und tötet ihn – das Orakel erfüllt sich. [Apollodor, WSU](https://public.archive.wsu.edu/hughesc/public_html/apollodorus_perseus.html)

- Blut: Athena gibt Asklepios Gorgonenblut; aus einer Seite heilt es, aus der anderen ist es Gift. [Wikipedia: Gorgons](https://www.Wikipedia.com/wiki/Gorgons)
- Bei Ovid fallen Blutstropfen über der libyschen Wüste und werden zu Schlangen. [Projekt Gutenberg](https://projekt-gutenberg.org/authors/ovid/books/metamorphosen/chapter/24)
- Medusas Schrei soll Athena zur Erfindung der Flötenmusik angeregt haben (Pindar). [Quellensammlung Gorgons](https://wiki.riteme.site/wiki/User:Paul_August/Gorgons)

### Δ – Schutzzeichen

- Geflügeltes Gorgoneion aus Bronze, 1. Hälfte 6. Jh. v. Chr., als Schutzzeichen auf einem Schild. [Wikipedia: Winged Gorgoneion](https://www.Wikipedia.com/wiki/Winged_Gorgoneion)
- Wandel: in der Archaik eine hässliche Fratze, bis zur Klassik ein Gesicht mit angenehmen menschlichen Zügen. [Museum August Kestner](https://nds.museum-digital.de/pdf/object/85903.pdf?lang=de)
- Übergangstyp: tarentinischer Stirnziegel zwischen wilder und ruhiger Medusa. [Met Museum](https://82nd-and-fifth.metmuseum.org/toah/works-of-art/20.215)
- Weitere Träger: Silbermünze aus Athen um 520 v. Chr.; Mosaik aus Rom, 115–150 n. Chr. (Getty Villa). [Simple Wikipedia](https://simple.wikipedia.com/wiki/Gorgoneion), [Stephens College](https://blog.stephens.edu/arh101glossary/?p=2272)
- Korfu: Westgiebel des Artemis-Tempels, um 590/580 v. Chr., ältester erhaltener großer Steingiebel Griechenlands. [Deutsche Digitale Bibliothek](https://www.deutsche-digitale-bibliothek.de/item/GVCO5E3I7EYUBJ5HCJ6DEXVFB5TTASAW), [GTP](https://www.gtp.gr/TDirectoryDetails.asp?id=4318)
- Der Giebel zeigt Medusa mit Pegasus und Chrysaor, flankiert von zwei Raubkatzen. [ancient-greece.org](https://ancient-greece.org/?p=11758)
- Kaiser Wilhelm II. verfolgte die Grabungen auf Korfu und veröffentlichte 1936 Studien zur Gorgo. [Schollmeyer, Leseprobe](https://www.na-verlag.de/wp-content/uploads/book-content/9783961762477_leseprobe_01.pdf)
- Medusa Rondanini: Glyptothek München (Inv. 252), erworben von Ludwig I.; Goethe bewunderte sie in Rom; Vorbild für Canovas Perseus (1798–1801). [Wikipedia: Medusa Rondanini](https://Www.Wikipedia.org/wiki/Medusa_Rondanini)

### Ε – Deutungen

| Deutung | Kernaussage | Beleg |
| --- | --- | --- |
| Schutzzeichen | Das Gorgonenhaupt auf Athenas Aigis schützt vor Waffen und erschreckt Feinde | [Wikipedia: Gorgons](https://EN.wikipedia.com/wiki/Gorgons) |
| Weisheit (Renaissance) | Für die Medici ein Sinnbild für Weisheit und Umsicht | [Visit Tuscany](https://www.visittuscany.com/de/attraktionen/die-medusa-von-caravaggio/) |
| Opfer | Bei Ovid trifft die Strafe Medusa statt des Täters; Ovid lenkt Mitgefühl auf sie | [Tales of Times Forgotten](https://talesoftimesforgotten.com/2022/09/07/no-athena-didnt-turn-medusa-into-a-monster-to-protect-her) |
| Psychoanalyse | Freud: Enthauptung steht für Kastrationsangst, Versteinern für Erstarren vor Schreck | [Art and Popular Culture](https://artandpopularculture.com/Medusa%27s_Head) |
| Feminismus | Cixous (1975): Aufruf zu weiblichem Schreiben, Medusa als Gegenbild zum männlichen Blick | [Wikipedia: The Laugh of the Medusa](https://en.wikipedia.org/wiki/The_Laugh_of_the_Medusa) |

- Freuds Text: Notizen vom 14. Mai 1922, erst 1940 nach seinem Tod gedruckt, eher eine Skizze. [ProQuest](https://www.proquest.com/docview/219709411)
- Kritik an Freud: Feministische Kritik sieht darin nur die männliche Perspektive. [Cavacopedia](https://cavac.at/cavacopedia/Medusa%27s%20Head)
- Cixous: 1975 in der Zeitschrift L’Arc, 1976 englisch in Signs. [Orlando, Cambridge](https://orlando.cambridge.org/index.php/profiles/cixohe)
- Umstritten: Die Lesart „Athena wollte Medusa schützen“ hat keine antike Grundlage; bei Ovid ist es eine Strafe. [Tales of Times Forgotten](https://talesoftimesforgotten.com/2022/09/07/no-athena-didnt-turn-medusa-into-a-monster-to-protect-her) Gegenposition: Verwandlung als Schutz und Protest. [Antigone Journal](https://antigonejournal.com/2021/10/mary-minerva-symbolic-protest/)

### Ζ – Literatur

- Hesiods „Schild des Herakles“: Gorgonen mit Schlangen um die Hüften; Pindar nennt das Schlangenhaar ausdrücklich. [Wikipedia: Gorgons](https://www.Wikipedia.com/wiki/Gorgons)
- Homer, Ilias: Gorgonenhaupt auf Athenas Aigis (5,741) und auf Agamemnons Schild (11,36); Hektor hat „Gorgonenaugen“ (8,349). [theoi.com](https://ftp.theoi.com/Pontios/Gorgones.html), [University of Washington](https://digital.lib.washington.edu/researchworks/bitstreams/925aa792-fee2-4094-9cf0-560ea265951f/download)
- Dante, Inferno IX: Die drei Furien rufen Medusa herbei; Vergil hält Dante die Augen zu. [Yale Open Courses](https://oyc.yale.edu/node/1430)
- Deutung bei Dante: Furien als Reue, Medusa als Verzweiflung (Barbara Reynolds). [Dante Book Club](https://armenikus.substack.com/p/medusa-and-the-mind-what-dantes-furies)
- Goethe, Faust I, Walpurgisnacht: Mephisto nennt die Gretchen-Erscheinung ein Zauberbild wie die Meduse, der Perseus den Kopf abschlug. [Sahlberg, PDF](https://mattes.de/buecher/praenatale_psychologie/PP_PDF/PP_13_1-2_Sahlberg.pdf)
- Shelley, 1819: Gedicht über ein Medusa-Gemälde der Uffizien, damals Leonardo zugeschrieben, heute einem unbekannten Flamen. [UCL](https://discovery.ucl.ac.uk/id/eprint/10180035/1/Nabugodi%20Medusan%20Figures.pdf)
- Natalie Haynes, „Stone Blind“ (2022), Longlist Women’s Prize 2023. [Wikipedia](https://en.wikipedia.org/wiki/Stone_Blind)
- Jessie Burton, „Medusa“: Neuerzählung, zuerst für junge Erwachsene. [Goodreads](https://www.goodreads.com/author_blog_posts/24318420-jessie-burton-s-feminist-medusa-flips-the-script-on-an-ancient-greek-myt)
- Lauren J. A. Bear, „Medusa’s Sisters“ (2023): erzählt von Stheno und Euryale. [Reading the Past](https://readingthepast.blogspot.com/2023/02/a-monster-reenvisioned-natalie-haynes.html)
- Rick Riordan, „Percy Jackson – Diebe im Olymp“: Medusa tarnt sich als „Aunty Em“ mit einem Laden voller Gartenstatuen – ihren versteinerten Opfern. Percy erkennt sie in einer spiegelnden Glaskugel, wie Perseus im Schild; sie hasst Annabeth, weil deren Mutter Athena sie verflucht hat. [LitCharts](https://litcharts.com/lit/the-lightning-thief/chapter-11), [SparkNotes](https://www.sparknotes.com/lit/lightning-thief/section5/)

### Η – Kunst

| Werk | Jahr | Ort | Kernfakt | Beleg |
| --- | --- | --- | --- | --- |
| Luciano Garbati, Medusa mit dem Haupt des Perseus | 2008 | Bronze 2020/21 in New York | Rollentausch; Kritik: männlicher Künstler, nackte Figur | [Smithsonian](https://www.smithsonianmag.com/smart-news/controversial-metoo-medusa-statue-unveiled-180976048/), [Daily Beast](https://www.thedailybeast.com/medusa-is-back-standing-tall-and-complicated-in-the-metoo-era) |
| Antonio Canova, Perseus | 1798–1801 | Vatikanische Museen | Medusenkopf nach Vorbild der Rondanini | [Wikipedia](https://Www.Wikipedia.org/wiki/Medusa_Rondanini) |
| Flämischer Maler, Haupt der Medusa | um 1620–30 | Uffizien | Vorlage für Shelleys Gedicht | [CUNY Manifold](https://cuny.manifoldapp.org/read/on-the-medusa-of-leonardo-da-vinci-in-the-florentine-gallery) |
| Rubens und Snyders, Haupt der Medusa | 1617/18 | KHM Wien | Schlangen vermutlich von Snyders | [KHM](https://khm.at/en/object/1626) |
| Caravaggio, Medusa | 1597/98 | Uffizien | auf gewölbten Holzschild gemalt; Geschenk an Ferdinando I. de’ Medici | [Wikipedia](<https://Www.Wikipedia.org/wiki/Medusa_(Caravaggio)>), [The Collector](https://www.thecollector.com/why-did-caravaggio-paint-medusa/) |
| Benvenuto Cellini, Perseus | 1545–1554 | Loggia dei Lanzi, Florenz | Perseus hält Medusas Kopf hoch | [Smithsonian](https://www.smithsonianmag.com/smart-news/controversial-metoo-medusa-statue-unveiled-180976048/) |

- Garbati: Aufstellung im Collect Pond Park vom 14. Oktober 2020 bis 30. April 2021, gegenüber dem Gericht des Weinstein-Prozesses. [The Art Newspaper](https://www.theartnewspaper.com/2020/10/13/metoo-medusa-sculpture-to-be-installed-across-from-new-york-courthouse-where-harvey-weinstein-stood-trial), [Untapped Cities](https://www.untappedcities.com/medusa-sculpture-nyc/)
- Caravaggio malte zwei Versionen (1596 und ca. 1597); Lieferung an die Medici vermutlich am 7. September 1598. [Wikipedia](<https://en.wikipedia.org/wiki/Medusa_(Caravaggio)>), [BeCulture](https://www.beculture.it/en/wp-json/wp/v2/posts/19368)
- Weitere Werke (Burne-Jones, Böcklin, Géricault) stehen unter „Ergänzungen aus der zweiten Recherche“.

### Θ – Heute

- Sizilien: Flagge seit 4. Januar 2000 offiziell; Gorgoneion mit drei Beinen (Triskeles) und drei Ähren. Das Motiv steht schon auf Münzen aus Syrakus im 4. Jh. v. Chr. [Wikipedia: Flag of Sicily](https://en.wikipedia.org/wiki/Flag_of_Sicily), [Region Sizilien](https://regione.sicilia.it/index%2Ephp/la-regione/i-simboli-della-regione/la-bandiera)
- Versace: Marke 1978 gegründet; Medusa als Sinnbild für Schönheit und Gefahr. Logo-Datum widersprüchlich (siehe unten). [Adweek](https://www.adweek.com/brand-marketing/versaces-medusa-logo-breaks-every-design-rule-so-why-does-it-work/)
- Medusa-Tattoos: Ende 2021 und Mitte 2022 Trend auf TikTok als Zeichen des Überlebens sexueller Gewalt. [Know Your Meme](https://knowyourmeme.com/memes/medusa-tattoo), [Parade/Yahoo](https://www.yahoo.com/lifestyle/medusa-tattoos-everywhere-lately-heres-110000504.html)
- Istanbul, Cisterna Basilica (532 unter Justinian): zwei Medusenköpfe als Säulenbasen, einer seitlich, einer kopfüber; wohl aus älteren römischen Bauten wiederverwendet. [istanbul.com](https://istanbul.com/de/blog/landmark-guides/basilica-cistern-guide)
- Biologie: Die „Meduse“ ist bei vielen Nesseltieren nur eine von zwei Lebensformen, die frei schwimmende. Linné wählte 1758 den Gattungsnamen Medusa wegen der langen Tentakel. [wissen.de](https://www.wissen.de/bildwb/sind-quallen-immer-durchsichtige-frei-schwimmende-gebilde), [Etymonline](https://www.etymonline.com/de/word/medusa)

### Ergänzungen aus der zweiten Recherche

**Α – Herkunft**

- Das Wort Gorgo hängt mit griech. gorgós („grimmig, furchtbar“) zusammen. [Wikipedia: Gorgons](https://www.Wikipedia.com/wiki/Gorgons)
- Homer kennt nur eine einzige Gorgo; in der Odyssee (11,633) erscheint sie als Schreckbild in der Unterwelt. [theoi.com](https://ftp.theoi.com/Pontios/Gorgones.html)

**Γ – Perseus**

- Einer Überlieferung nach versteinerte Perseus mit dem Haupt auch den Titanen Atlas – daraus wurde das Atlasgebirge in Marokko. [Planet Wissen](https://www.planet-wissen.de/natur/tiere_im_wasser/quallen/pwiewissensfrage466.html)
- In Athen hieß es, Medusas Kopf sei unter einem Hügel auf der Agora begraben (Pausanias); Herakles soll von Athena eine Locke Medusas bekommen haben, die genauso wirkte wie das Haupt. [theoi.com](https://ftp.theoi.com/Pontios/Gorgones.html)
- Bei Euripides („Ion“) schenkt Athena zwei Tropfen Gorgonenblut: einer wehrt Krankheiten ab, der andere ist Gift. [Wikipedia: Gorgon](https://www.Wikipedia.org/wiki/Gorgon)

**Δ – Schutzzeichen**

- Schon auf den frühesten Darstellungen wendet Perseus den Blick ab – dass der direkte Blick tödlich ist, war also von Anfang an Teil der Sage. [Wikipedia: Gorgon](https://wikipedia.com/wiki/Gorgon)
- Korfu: Der Giebel wurde unter Beteiligung des deutschen Archäologen Wilhelm Dörpfeld ausgegraben; die New York Times nannte ihn das beste erhaltene Beispiel archaischer Tempelskulptur. [Wikiwand](https://www.wikiwand.com/en/articles/Artemis_Temple_of_Corfu), [Wikipedia](https://en.Wikipedia.com/wiki/Artemis_Temple_of_Corfu)
- Gibraltar: 2021 wurden Fragmente eines Gorgoneions aus der Gorham’s Cave veröffentlicht, einem Heiligtum antiker Seefahrer – die einzigen bekannten Medusa-Funde aus einer Höhle. [PLOS ONE](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8016213/)

**Η – Kunst**

- Burne-Jones, Perseus-Zyklus: 1875 von Arthur Balfour für sein Londoner Musikzimmer bestellt; nur vier Ölbilder wurden fertig, heute in der Staatsgalerie Stuttgart; die zehn großen Gouache-Entwürfe hängen in Southampton. [Tru Vue](https://tru-vue.com/?p=6070)
- Böcklin, „Medusa“ (1878), Germanisches Nationalmuseum Nürnberg. [DailyArt](https://www.dailyartmagazine.com/metoo-and-the-medusa-myth/)
- Garbati: Der Kopf des Perseus trägt die Züge des Künstlers selbst; Medusa hält das Schwert links und den Kopf rechts. [Artdaily](https://artdaily.com/news/129187/How-a-Medusa-sculpture-from-a-decade-ago-became--MeToo-art)
- Géricault, „Das Floß der Medusa“ (1818/19, Louvre): zeigt Überlebende der Fregatte Méduse, die am 2. Juli 1816 vor Mauretanien auf Grund lief – mit der Gorgone hat es nur den Namen gemein. [Sygic Travel](https://travel.sygic.com/en/poi/the-raft-of-the-medusa-poi:4088597), [Uni Heidelberg](https://journals.ub.uni-heidelberg.de/index.php/kb/article/view/80211/74169)

**Konkrete Bildquellen**

| Motiv | Quelle | Lizenz |
| --- | --- | --- |
| Korfu-Giebel | [World History Encyclopedia, Foto „Dr. K.“](https://www.worldhistory.org/image/1255/gorgon-temple-of-artemis-corcyra/) | CC BY 4.0 |
| Medusa Rondanini | [Commons: Rondanini Medusa Glyptothek Munich 252 n2.jpg](https://en.wikipedia.com/wiki/File:Rondanini_Medusa_Glyptothek_Munich_252_n2.jpg) | auf der Dateiseite prüfen |
| Cellini, Perseus | Commons, Foto Paolo Villa ([Nachweis](https://classicalclayton.blogspot.com/2020/11/a-medusa-for-manhattan-luciano-garbatis.html)) | CC BY-SA 4.0 |
| Garbati, Medusa | kein freies Foto gefunden – nur verlinken: [Wikipedia](https://en.wikipedia.org/wiki/Medusa_with_the_Head_of_Perseus) | – |
| Rubens, Haupt der Medusa | [KHM](https://khm.at/en/object/1626) | CC BY-NC-SA 4.0 |

### Ergänzungen aus der dritten Recherche

Damit ist das Bild vollständig: Es gibt nicht „den“ Medusa-Mythos, sondern ein Netz von Versionen und Deutungen – vom Monster (Hesiod) über das Opfer (Ovid) bis zur Königin (Pausanias), vom Schutzzeichen bis zum Bild für den Tod, den fremden Blick und politische Gewalt.

**Α – Ursprung des Gorgonen-Bildes**

- Mögliche Vorbilder im Alten Orient: der Dämon Humbaba aus dem Gilgamesch-Epos, der wie Medusa von einem Helden enthauptet und oft nur als Kopf dargestellt wird, und die Dämonin Lamaschtu. [Gujabidze 2025](https://ojs.ppke.hu/fhs/article/view/1456), [Mythopedia](https://mythopedia.com/topics/gorgons/)
- Verwandtschaft mit der „Herrin der Tiere“ (Potnia Theron), einer Frauenfigur zwischen zwei Tieren – wie die Gorgo auf Korfu zwischen zwei Raubkatzen. [Wikipedia: Potnia Theron](https://en.wikipedia.org/wiki/Potnia_Theron), [Quellensammlung Gorgons](https://wiki.riteme.site/wiki/User:Paul_August/Gorgons)
- Jane Ellen Harrison (frühes 20. Jh.): Das Gorgoneion sei ursprünglich eine Ritualmaske gewesen. [Olalquiaga](https://www.celesteolalquiaga.com/_files/ugd/514c6b_e733e577dde84b0ba9e63203a40af741.pdf)
- Umstritten: Thesen, die Gorgo verkörpere eine ältere weibliche Gottheit oder weibliche Sexualität, lassen sich weder durch Texte noch durch Funde belegen – nur als These darstellen. [Quellensammlung Gorgons](https://www.wikipedia.org/wiki/User:Paul_August/Gorgons)

**Β – weitere Versionen des Mythos**

- Pausanias (2. Jh. n. Chr.) erzählt eine „vernünftige“ Fassung: Medusa ist nach dem Tod ihres Vaters Phorkys Königin am Tritonsee in Libyen, jagt und führt die Libyer in den Krieg; Perseus lässt sie nachts im Feldlager ermorden und nimmt ihren Kopf mit, weil er selbst die Tote noch schön findet. Der Kopf soll unter einem Erdhügel auf dem Markt von Argos liegen. [Pausanias 2.21.5–6](https://cts.perseids.org/read/greekLit/tlg0525/tlg001/perseus-eng2/2.20.9-2.21.6), [GRBS](https://grbs.library.duke.edu/index.php/grbs/article/download/1321/1411/5331)
- Prokles von Karthago (bei Pausanias): Medusa als wilde Frau aus der libyschen Wüste, die Perseus mit Athenas Hilfe tötet. [Pausanias, Perseids](https://fgh.perseids.org/read/greekLit/tlg0525/tlg001/perseus-eng2/2.20.10-2.21.6)
- Diodor (1. Jh. v. Chr.): Die Gorgonen sind ein kriegerisches Frauenvolk im Westen Libyens, das gegen die Amazonen der Königin Myrina kämpft und später von Herakles ausgelöscht wird. [Wikipedia: Myrina](<https://en.wikipedia.org/wiki/Myrina_(Amazon)>), [Lexikon Perseids](https://cts.perseids.org/read/pdlrefwk/viaf88890045/003/perseus-eng1/G.gorgo_1)
- Lucan, „Pharsalia“ IX (1. Jh. n. Chr.): Athena schickt Perseus über die menschenleere Wüste, damit niemand beim Hochschauen versteinert; Medusas Blut, das dabei herabtropft, erzeugt alle Giftschlangen Libyens. [CAMWS](https://camws.org/meeting/2010/program/abstracts/12D4.Brinnehl.pdf), [Bestiary](https://bestiary.ca/prisources/psdetail964.htm)

**Ε – weitere Deutungen**

- Jean-Pierre Vernant, „La mort dans les yeux“ (1985): Die Gorgo ist die Maske des Todes und des radikal Anderen; wer sie ansieht, erstarrt, weil er in ihr einen unerträglichen Teil von sich selbst erkennt. [CHS Harvard](https://www-current.chs.harvard.edu/chapter/9-homeric-flowers-and-the-monstrousness-of-death), [Olalquiaga](https://www.celesteolalquiaga.com/_files/ugd/514c6b_e733e577dde84b0ba9e63203a40af741.pdf)
- Jean-Paul Sartre, „Das Sein und das Nichts“ (1943): Der Blick des Anderen macht mich zum Objekt – Medusas versteinernder Blick wird zum Bild dafür; der Psychiater R. D. Laing griff das auf. [Toyama](https://dlib.si/stream/URN:NBN:SI:DOC-6FEB21UQ/6be9b71f-b9cb-47a9-9be5-f3e9739102a2/PDF), [Philosophical Eggs](https://philosophicaleggs.com/?p=4572)
- „Medusa-Komplex“ (Gaston Bachelard, 1948): das Erstarren unter einem bedrohlichen Blick. [Wikipedia](https://Www.Wikipedia.org/wiki/Medusa_complex)
- Mary Beard, „Women & Power“ (2017): Medusa als Bild, mit dem mächtige Frauen symbolisch „geköpft“ werden. [Inside Story](https://insidestory.org.au/?p=46369)
- Vorschlag für die Szene: Karte 4 „Der Blick“ um Sartre erweitern, neue Karte 7 „Tod und das Andere“ (Vernant).

```
s5-karte7: An ancient Greek funerary stele in darkness, a carved round shield with a smooth, featureless face, mist drifting across it, [Stil-Baustein Bild]
```

**Ζ – Literatur ergänzt**

- Lucan (siehe oben) als römisches Gegenstück zu Ovid.
- Sylvia Plath schrieb ein Gedicht mit dem Titel „Medusa“; Annie Lennox benannte ein Album nach ihr. [Circa](https://www.circa.co.nz/wp-content/uploads/2018/09/Final-Print-1.pdf)

**Η – Kunst ergänzt**

- Gian Lorenzo Bernini, Büste der Medusa (um 1644–48, Kapitolinische Museen, Rom): Medusa sieht ihr eigenes Spiegelbild und verwandelt sich vor unseren Augen selbst in Marmor – ein Wortspiel mit dem Material und eine Metapher für die Macht des Bildhauers. Passt exakt zum Konzept der Website. [Musei Capitolini](https://museicapitolini.org/en/node/82220), [Google Arts & Culture](https://artsandculture.google.com/asset/bust-of-the-medusa/KgHR0dPsgjMwGw)
- Gustav Klimt, Beethovenfries (1902, Secession Wien): drei Gorgonen als „feindliche Gewalten“ – Krankheit, Wahnsinn, Tod. Gemeinfrei. [Albertina](https://digitalepublikationen.albertina.at/groups/beethovenfries/results), [Austria-Forum](https://austria-forum.org/af/AustriaWiki/Beethovenfries)

**Θ – Heute ergänzt**

- Politik: Im US-Wahlkampf 2016 zeigten Fanartikel Trump als Cellinis Perseus mit Hillary Clintons Kopf; auch Angela Merkel und Theresa May bekamen die „Medusa-Behandlung“. Garbatis Statue lässt sich als Antwort darauf lesen. [Prospect](https://prospectmagazine.co.uk/society/39609/why-do-we-still-depict-medusa-as-a-monster), [MetaFilter](https://metafilter.com/178442/The-Wrath-of-a-Gorgon-Wronged)
- Film: „Kampf der Titanen“ (1981) mit Medusa als Stop-Motion-Figur von Ray Harryhausen, dessen letzter Film; Remake 2010 mit CGI. [Wikipedia](<https://www.Wikipedia.com/wiki/Clash_of_the_Titans_(1981_film)>), [Den of Geek](https://www.denofgeek.com/movies/the-top-10-ray-harryhausen-creatures)
- Spiele: In „Assassin’s Creed Odyssey“ ist Medusa ein durch ein mächtiges Artefakt verwandelter Mensch. [Cultural depictions](https://ipfs.ssi.eecc.de/ipns/en.wikipedia-on-ipfs.org/wiki/Cultural_depictions_of_Medusa_and_Gorgons)

### Zitate (kurz, frei nutzbar)

**Saal-Mottos:** Jeder Saal öffnet mit einem Zitat, groß gesetzt in Instrument Serif, Original plus deutsche Übersetzung.

| Szene | Motto | Deutsch | Quelle |
| --- | --- | --- | --- |
| Startseite | „Approach the chamber, and destroy your sight / With a new Gorgon.“ | „Tretet ein und zerstört euer Augenlicht an einer neuen Gorgo.“ | Shakespeare, Macbeth 2.3 ([Folger](https://shakespeareandbeyond.folger.edu/2021/12/14/athena-how-shakespeares-plays-invoke-the-greek-goddess/)) |
| Α Herkunft | – | „Nur Medusa war sterblich.“ | nach Apollodor, Bibliotheke 2.4.2 |
| Β Mythos | „clarissima forma“ | „von strahlendster Schönheit“ | Ovid, Met. 4,794 |
| Γ Perseus | – | „Tröpfelten blutige Tropfen vom Haupt der Gorgo Medusa“ | Ovid, Met. IV, dt. Übersetzung ([Gutenberg](https://projekt-gutenberg.org/authors/ovid/books/metamorphosen/chapter/24)) |
| Δ Schutzzeichen | – | „… die Gorgo, grässlich anzuschauen, furchtbar blickend, und um sie Schrecken und Flucht.“ | Homer, Ilias 11,36 (eigene Übersetzung) |
| Ε Deutungen | „Though he be painted one way like a Gorgon, / The other way’s a Mars.“ | „Von der einen Seite gemalt wie eine Gorgo, von der anderen ein Mars.“ | Shakespeare, Antony and Cleopatra 2.5 ([Folger](https://shakespeareandbeyond.folger.edu/2021/12/14/athena-how-shakespeares-plays-invoke-the-greek-goddess/)) |
| Ζ Literatur | „Volgiti ’n dietro e tien lo viso chiuso“ | „Dreh dich um und halte die Augen geschlossen.“ | Dante, Inferno IX, 55 |
| Η Kunst | „Its horror and its beauty are divine.“ | „Ihr Grauen und ihre Schönheit sind göttlich.“ | Shelley, 1819 ([poets.org](https://poets.org/index%2ephp/poem/medusa-leonardo-da-vinci-florentine-gallery/print)) |
| Θ Heute | – | Man muss Medusa nur direkt ansehen: Sie ist nicht tödlich, sie ist schön und sie lacht. (sinngemäß) | Cixous, 1975 |
| Ω Fazit | „Omnia mutantur, nihil interit.“ | „Alles wandelt sich, nichts vergeht.“ | Ovid, Met. 15,165 |

Zusätzlich für die Deutungs-Karte Psychoanalyse: „Kopfabschneiden = Kastrieren“ (Freud, Das Medusenhaupt, 1922/1940).

Warum gerade das Shakespeare-Zitat in Saal V: Cleopatra spielt auf Vexierbilder an, die von der einen Seite ein Monster, von der anderen einen Gott zeigen – genau das Thema des Saals.

### Widersprüche zwischen Quellen

| Punkt | Angabe A | Angabe B | Umgang |
| --- | --- | --- | --- |
| Versace-Logo | seit 1978 ([Sixtysix](https://sixtysixmag.com/landing/what-does-the-versace-logo-mean/)) | Schriftlogo ab 1980, Medusa ab 1993 ([Medium](https://medium.com/@darar.11des/history-of-the-logo-versace-b805f0ff629b)) | „Marke seit 1978; Medusa-Logo prägt sie seit den 1990ern“ |
| Medusa Rondanini | Kopie eines Originals des 5. Jh. v. Chr. | späthellenistische oder augusteische Kopie ([Wikiwand](https://wikiwand.com/en/Medusa_Rondanini)) | als „umstritten“ kennzeichnen |
| Rubens-Medusa | Wiener Bild ist das Original | Wien ist spätere Fassung, Original in Brünn ([Wikipedia](<https://en.wikipedia.org/wiki/Medusa_(Rubens)>)) | beide Fassungen nennen |
| Korfu-Giebel | 585 v. Chr. ([ADAC](https://maps.adac.de/poi/archaeologisches-museum-korfu)) | 590–580 v. Chr. | „um 590/580 v. Chr.“ |
| Medusenköpfe Istanbul | gedreht gegen den bösen Blick | gedreht, damit die Größe passt | beide Erklärungen nennen |
| Rondanini-Erwerb | 1811 ([Kestner](https://nds.museum-digital.de/pdf/object/85903.pdf?lang=de)) | 1814 ([Lempertz](https://lempertz.com/en/catalogues/lot/1244-2/879-an-italien-panel-with-a-gorgoneion-motif.html)) | Jahr weglassen oder beide nennen |

## Bildliste

22 Abbildungen sind vorgesehen; jede bekommt eine Nummer, die im Bildnachweis am Ende der Ausstellung wieder auftaucht. Gemeinfreie Werke zuerst bei Wikimedia Commons suchen, Museumsfotos bei den Museen selbst.

**So lädst du ein Bild herunter:** Dateiseite bei Wikimedia Commons (oder dem Museum) öffnen → „Herunterladen“ bzw. „Originaldatei“ → größte Auflösung wählen → mit dem Dateinamen aus der Liste speichern. Gleich notieren: Titel, Künstler, Fotograf, Lizenz und Link. Echte Kunstwerke (Caravaggio, Cellini usw.) müssen echte Fotos sein; alles andere darf KI-generiert werden (siehe Prompt-Bibliothek).

**Fries in Γ Perseus:** Für die neun Stationen eignet sich Burne-Jones’ Perseus-Zyklus perfekt – gemeinfrei und genau die Stationen der Sage (u. a. Perseus und die Graien, Auffinden der Medusa, Tod der Medusa, Geburt von Pegasus, Das unheilvolle Haupt). Auf Commons nach „Burne-Jones Perseus“ suchen.

| Datei | Saal | Motiv | Wo suchen | Lizenz | Status |
| --- | --- | --- | --- | --- | --- |
| s1-gorgonen-vase.jpg | I | Gorgonen verfolgen Perseus, schwarzfigurige Pyxis, 6. Jh. v. Chr., Louvre | Wikimedia Commons | Foto prüfen | offen |
| s1-stammbaum.svg | I | Stammbaum der Familie | selbst gezeichnet | eigenes Werk | offen |
| s2-ovid-druck.jpg | II | Alter Druck oder Holzschnitt der Metamorphosen | Wikimedia Commons | gemeinfrei | offen |
| s2-athena-aigis.jpg | II | Athena mit Aigis und Gorgonenhaupt, Vasenbild | Wikimedia Commons | Foto prüfen | offen |
| s3-perseus-vase.jpg | III | Perseus mit dem Medusenhaupt, Vasenmalerei | Wikimedia Commons | Foto prüfen | offen |
| s3-graien.jpg | III | Perseus und die Graien, Edward Burne-Jones | Wikimedia Commons | gemeinfrei | offen |
| s3-pegasus.jpg | III | Geburt von Pegasus und Chrysaor, Pyxis im Louvre | Wikimedia Commons | Foto prüfen | offen |
| s4-korfu-giebel.jpg | IV | Gorgo-Giebel vom Artemis-Tempel, Korfu | Wikimedia Commons, Deutsche Fotothek | Lizenz prüfen | offen |
| s4-archaisch.jpg | IV | Archaisches Gorgoneion, z. B. Münze Athen um 520 v. Chr. | Wikimedia Commons | Foto prüfen | offen |
| s4-uebergang.jpg | IV | Stirnziegel aus Tarent, Übergangstyp | Met Museum Open Access | CC0 | offen |
| s4-rondanini.jpg | IV | Medusa Rondanini, Glyptothek München | Wikimedia Commons | Foto prüfen | offen |
| s5-mosaik.jpg | V | Gorgoneion-Mosaik aus Rom, Getty Villa | Getty Open Content | frei nutzbar | offen |
| s6-dante.jpg | VI | Dante und Vergil vor den Furien, Illustration von William Blake | Wikimedia Commons, NGV | gemeinfrei | offen |
| s7-cellini.jpg | VII | Cellini, Perseus, Loggia dei Lanzi | Wikimedia Commons | meist CC BY-SA | offen |
| s7-caravaggio.jpg | VII | Caravaggio, Medusa, Uffizien | Wikimedia Commons | gemeinfrei | offen |
| s7-rubens.jpg | VII | Rubens und Snyders, Haupt der Medusa | KHM Online-Sammlung | CC BY-NC-SA 4.0 | offen |
| s7-uffizi-flaemisch.jpg | VII | Flämisches Haupt der Medusa (Shelleys Vorlage) | Wikimedia Commons | gemeinfrei | offen |
| s7-canova.jpg | VII | Canova, Perseus, Vatikan | Wikimedia Commons | Foto prüfen | offen |
| s7-garbati.jpg | VII | Garbati-Statue in New York | Wikimedia Commons, sonst nur verlinken | urheberrechtlich geschützt | offen |
| s8-sizilien-flagge.svg | VIII | Flagge Siziliens | Wikimedia Commons | gemeinfrei | offen |
| s8-zisterne.jpg | VIII | Medusenkopf in der Cisterna Basilica, Istanbul | Wikimedia Commons | meist CC BY-SA | offen |
| s8-qualle.jpg | VIII | Meduse, z. B. Ohrenqualle | Wikimedia Commons | meist CC BY-SA | offen |

- Das Versace-Logo ist eine geschützte Marke: nicht abbilden, nur beschreiben.
- Pro Bild notieren: Titel, Künstler, Jahr, Fotograf, Lizenz, Link. Bei CC BY-SA den Lizenznamen mit angeben.
- Für den Unterricht erlaubt § 60a UrhG die Nutzung geschützter Bilder; die Ausstellung deshalb nicht öffentlich ins Netz stellen.

### Freisteller und Videos

| Datei | Szene | Motiv | Hinweis |
| --- | --- | --- | --- |
| f-caravaggio.webp | Β Mythos | Caravaggios Medusenkopf ohne Schild | für den Versteinerungs-Effekt |
| f-gorgo-korfu.webp | Δ Schutzzeichen | Gorgo vom Korfu-Giebel | Startbild des Verwandlungs-Scrubs |
| f-rondanini.webp | Δ Schutzzeichen | Medusa Rondanini ohne Hintergrund | Endbild des Verwandlungs-Scrubs |
| v-rauch.mp4 | Übergänge | Rauch im Lichtbündel | langsam, als Maske zwischen Szenen |
| v-marmor.mp4 | Übergänge | Marmor-Textur in Bewegung | sehr ruhig |
| v-fackel.mp4 | Γ Perseus | Staub im Fackelschein | Stimmung im Fries |
| v-qualle.mp4 | Θ Heute | Qualle (Meduse) | Video-Kachel |
| v-zisterne.mp4 | Θ Heute | Cisterna Basilica, Istanbul | Video-Kachel |

Für Freisteller zählt ein Foto mit klarem Umriss und ruhigem Hintergrund; je größer, desto besser (mindestens 2.000 px Höhe).

## Prompt-Bibliothek

Alle KI-Bilder und -Videos für die Szenen, im selben Look wie die Startseite. Die Prompts der Startseite stehen im Abschnitt „Startseite: Die Verwandlung“. An jeden Bild-Prompt den Stil-Baustein Bild hängen, an jeden Video-Prompt den Stil-Baustein Clip.

**Stil-Baustein Bild (Szenen):**

```
cinematic, photorealistic, low camera angle, warm amber volumetric light beam from the upper left filled with floating dust, golden rim light, chiaroscuro with the right side falling into deep black, ultra detailed ivory Carrara marble with faint veins, shallow depth of field, filmic grain, 16:9, 4K, no text, no watermark
```

**Stil-Baustein Clip:**

```
one continuous shot, slow motion, smooth continuous motion, no cuts, warm amber volumetric light from the upper left, deep black background, photorealistic, filmic grain, no text
```

### Bilder

**s1-gorgonen.png · Α Herkunft**

```
Three marble statues of the Gorgon sisters standing together on a rocky shore at the edge of the world, the two immortal sisters with bronze wings and boar tusks on either side, the mortal Medusa between them with a human face and snake hair, a dark ocean behind them, [Stil-Baustein Bild]
```

**s1-graien.png · Α Herkunft**

```
Three ancient grey-haired marble sisters, the Graeae, seated close together in a dark cave, passing a single glowing eye from hand to hand, [Stil-Baustein Bild]
```

**s2-tempel.png · Β Mythos**

```
Interior of an ancient Greek marble temple of Athena at night, an empty altar, a colossal statue of Athena in the background turning her face away and raising her shield, scattered flower petals on the floor, the stillness after a terrible event, no people, [Stil-Baustein Bild]
```

**s3-ausruestung.png · Γ Perseus**

```
Still life on a dark stone altar: winged bronze sandals, a curved sickle-shaped sword, a leather pouch, a dark helmet and a polished round bronze shield, [Stil-Baustein Bild]
```

**s3-medusa-schlaf.png · Γ Perseus (für den Spiegelschild)**

```
Medusa asleep in a dark cave, her marble face calm, the stone snakes in her hair coiled and resting, the two other Gorgon sisters asleep in the shadows behind her, [Stil-Baustein Bild]
```

**s3-pegasus.png · Γ Perseus**

```
A winged white marble horse, Pegasus, bursting upward out of a cloud of marble dust and gold sparks, wings spread wide, [Stil-Baustein Bild]
```

**s5-karte1-schutz.png bis s5-karte6.png · Ε Deutungen (je ein Bild pro Deutungs-Karte)**

```
1 Schutz: An ancient bronze Greek shield hanging on a dark temple wall above a doorway, seen from the side, its relief hidden in shadow, guarding the entrance, [Stil-Baustein Bild]
2 Opfer: A cracked marble statue of a woman seen from behind, standing alone in an empty temple, head bowed, [Stil-Baustein Bild]
3 Ordnung und Chaos: Dark silhouette of a Greek hero against a stormy sky at the edge of the world, seen from far below, raising a round shield, [Stil-Baustein Bild]
4 Der Blick: A polished round bronze mirror reflecting a single beam of light in total darkness, [Stil-Baustein Bild]
5 Psychoanalyse: An empty vintage psychoanalyst's couch in a dark 1920s Vienna study, a coiled stone snake resting on the cushion, [Stil-Baustein Bild]
6 Feminismus: Stone snakes breaking free from shattered chains on a marble floor and rising upward into the light, [Stil-Baustein Bild]
```

**s6-buch.png · Ζ Literatur**

```
An old leather-bound book lying open on a dark desk, stone snakes rising from its pages like smoke, [Stil-Baustein Bild]
```

**s8-qualle.png · Θ Heute**

```
A glowing translucent jellyfish drifting in black water, its long tentacles flowing like snake hair, warm amber light from above, [Stil-Baustein Bild]
```

**s8-zisterne.png · Θ Heute**

```
An underground Byzantine cistern with rows of marble columns reflected in still water, at the base of one column a giant upside-down Medusa head carved in stone, [Stil-Baustein Bild]
```

**s9-augen.png · Ω Fazit**

```
Extreme close-up of Medusa's marble eyes opening, the stone slowly turning into living skin with natural color, [Stil-Baustein Bild]
```

### Videos (Schleifen, 6–10 Sekunden)

**v-rauch.mp4 · Übergänge** (nur Text)

```
Golden smoke and dust slowly drifting through a single amber light beam, seamless loop, [Stil-Baustein Clip]
```

**v-marmor.mp4 · Übergänge** (nur Text)

```
Extreme macro shot, the camera glides slowly across white Carrara marble veins, seamless loop, [Stil-Baustein Clip]
```

**v-fackel.mp4 · Γ Perseus** (nur Text)

```
Torchlight flickering on rough stone cave walls, dust floating in the air, seamless loop, [Stil-Baustein Clip]
```

**v-qualle.mp4 · Θ Heute** (aus s8-qualle.png)

```
The jellyfish pulses slowly, its tentacles flowing like snakes, static camera, seamless loop, [Stil-Baustein Clip]
```

**v-zisterne.mp4 · Θ Heute** (aus s8-zisterne.png)

```
Slow dolly forward between the columns, the water ripples gently as single drops fall from above, [Stil-Baustein Clip]
```

Alle KI-Dateien im Bildnachweis mit „KI-generiert mit \[Werkzeug\]“ kennzeichnen.

## Arbeitsplan

Gebaut wird in 10 Schritten: erst Vorbereitung durch dich, dann Gerüst und Texte mit mir, zum Schluss Bilder, PDF und Prüfung. Jeder Schritt endet mit einem Ergebnis, das du ansehen kannst, bevor der nächste beginnt.

| Nr. | Schritt | Wer | Ergebnis |
| --- | --- | --- | --- |
| ✓ | Planung, Recherche, Startseiten-Bilder und finales Video | du + Claude im Chat | erledigt |
| 1 | Claude Code einrichten; Build-Brief, Plan, Video und Bilder A, B, X, C in den Projektordner | du | läuft |
| 2 | Session 1: Fundament, Scroll-Film, Schild → Logo, Navigation | Claude Code, nach deinem Okay | Startseite fertig und durchscrollbar |
| 3 | Szenen-Bilder und -Videos per KI mit der Prompt-Bibliothek erzeugen (Kunstwerke und Burne-Jones-Zyklus lädt Claude Code in Session 2 selbst herunter) | du | vor Session 2 |
| 4 | Session 2: Szenen Α–Δ | Claude Code, nach deinem Okay | vier Szenen mit Texten und großem Moment |
| 5 | Eigene Stellungnahme für das Fazit schreiben | du | vor Session 3 |
| 6 | Session 3: Szenen Ε–Ω und Übergänge | Claude Code, nach deinem Okay | ganze Seite durchscrollbar |
| 7 | Texte lesen und in eigenen Worten überarbeiten | du | nach Session 3 |
| 8 | Session 4: PDF, Feinschliff, Prüfliste, ZIP | Claude Code, nach deinem Okay | Abgabe fertig |

### Prüfliste vor der Abgabe

- [ ] Jeder Fakt hat eine Quelle im Quellenverzeichnis
- [ ] Alle „prüfen“-Punkte aus dem Dossier sind geprüft oder gestrichen
- [ ] Widersprüche aus dem Dossier sind im Text korrekt dargestellt
- [ ] Jedes Bild hat Bildunterschrift, Nummer und Eintrag im Bildnachweis; KI-Bilder sind als „KI-generiert“ gekennzeichnet
- [ ] Alle Bilder haben Alternativtexte
- [ ] Texte sind in deinen eigenen Worten überarbeitet
- [ ] Namensfeld auf Startseite und im PDF von dir selbst ausgefüllt
- [ ] HTML öffnet offline in Chrome, Firefox und Safari
- [ ] Menü-Links springen zur richtigen Szene
- [ ] Deutungs-Reiter funktionieren mit Maus und Tastatur
- [ ] Ansicht und Animationen auf dem Handy geprüft; mit „Bewegung reduzieren“ bleibt alles lesbar
- [ ] PDF: jeder Saal beginnt auf neuer Seite, keine abgeschnittenen Bilder, Seitenzahlen da
- [ ] Rechtschreibung geprüft
- [ ] ZIP enthält Ordner und PDF, Dateinamen ohne Leer- und Sonderzeichen

## Quellenverzeichnis

Für die Abgabe zuerst die antiken Texte nennen, dann Fachliteratur und Museen, zuletzt Webseiten. Webquellen mit Abrufdatum angeben (abgerufen am 19.11.2026).

### Antike und historische Texte

- Hesiod: Theogonie, V. 270 ff. – [Auszüge bei greek-gods.org](https://www.greek-gods.org/sources/medusa.php)
- Ovid: Metamorphosen, Buch IV, V. 765–803, deutsche Übersetzung – [Projekt Gutenberg](https://projekt-gutenberg.org/authors/ovid/books/metamorphosen/chapter/24)
- Apollodor: Bibliotheke, Buch II, Kap. 4 – [Perseids 2.4.1–12](https://cts.perseids.org/read/greekLit/tlg0548/tlg001/perseus-eng2/2.4.1-2.4.12)
- Dante Alighieri: Inferno, Gesang IX – [Yale Open Courses](https://oyc.yale.edu/node/1430)
- Johann Wolfgang von Goethe: Faust I, Walpurgisnacht
- Percy Bysshe Shelley: On the Medusa of Leonardo da Vinci in the Florentine Gallery (1819) – [poets.org](https://poets.org/index%2ephp/poem/medusa-leonardo-da-vinci-florentine-gallery/print)
- Sigmund Freud: Das Medusenhaupt (1922, veröffentlicht 1940) – [Art and Popular Culture](https://artandpopularculture.com/Medusa%27s_Head)
- Hélène Cixous: Le Rire de la Méduse (1975) – [Orlando, Cambridge](https://orlando.cambridge.org/index.php/profiles/cixohe)

### Museen und Fachquellen

- [Kunsthistorisches Museum Wien: Haupt der Medusa](https://khm.at/en/object/1626)
- [Museum August Kestner: Medusa Rondanini (Kameo)](https://nds.museum-digital.de/pdf/object/85903.pdf?lang=de)
- [Metropolitan Museum: Gorgoneion-Stirnziegel](https://82nd-and-fifth.metmuseum.org/toah/works-of-art/20.215)
- [Deutsche Digitale Bibliothek: Gorgo-Giebel Korfu](https://www.deutsche-digitale-bibliothek.de/item/GVCO5E3I7EYUBJ5HCJ6DEXVFB5TTASAW)
- [Schollmeyer: Die 50 bekanntesten archäologischen Stätten der griechischen Inseln (Leseprobe)](https://www.na-verlag.de/wp-content/uploads/book-content/9783961762477_leseprobe_01.pdf)
- [Nabugodi: Medusan Figures (UCL)](https://discovery.ucl.ac.uk/id/eprint/10180035/1/Nabugodi%20Medusan%20Figures.pdf)
- [Region Sizilien: Die Flagge](https://regione.sicilia.it/index%2Ephp/la-regione/i-simboli-della-regione/la-bandiera)

### Artikel und Nachschlagewerke

- [Wikipedia: Gorgons](https://www.Wikipedia.com/wiki/Gorgons) · [Medusa Rondanini](https://Www.Wikipedia.org/wiki/Medusa_Rondanini) · [Medusa (Caravaggio)](<https://en.wikipedia.org/wiki/Medusa_(Caravaggio)>) · [Medusa (Rubens)](<https://en.wikipedia.org/wiki/Medusa_(Rubens)>) · [Flag of Sicily](https://en.wikipedia.org/wiki/Flag_of_Sicily) · [The Laugh of the Medusa](https://en.wikipedia.org/wiki/The_Laugh_of_the_Medusa) · [Stone Blind](https://en.wikipedia.org/wiki/Stone_Blind)
- [Smithsonian Magazine: Medusa-Statue in New York (2020)](https://www.smithsonianmag.com/smart-news/controversial-metoo-medusa-statue-unveiled-180976048/)
- [The Art Newspaper: #MeToo-Medusa (2020)](https://www.theartnewspaper.com/2020/10/13/metoo-medusa-sculpture-to-be-installed-across-from-new-york-courthouse-where-harvey-weinstein-stood-trial)
- [The Daily Beast: Kritik an der Garbati-Statue](https://www.thedailybeast.com/medusa-is-back-standing-tall-and-complicated-in-the-metoo-era)
- [Tales of Times Forgotten: Athena und Medusa](https://talesoftimesforgotten.com/2022/09/07/no-athena-didnt-turn-medusa-into-a-monster-to-protect-her)
- [Antigone Journal: Mary and Minerva](https://antigonejournal.com/2021/10/mary-minerva-symbolic-protest/)
- [Roman Empire Times: Ovid und Medusa](https://romanempiretimes.com/did-ovid-change-the-greek-medusa-myth-forever/)
- [The Collector: Caravaggios Medusa](https://www.thecollector.com/why-did-caravaggio-paint-medusa/)
- [Visit Tuscany: Medusa von Caravaggio](https://www.visittuscany.com/de/attraktionen/die-medusa-von-caravaggio/)
- [istanbul.com: Cisterna Basilica](https://istanbul.com/de/blog/landmark-guides/basilica-cistern-guide)
- [Know Your Meme: Medusa-Tattoo](https://knowyourmeme.com/memes/medusa-tattoo) · [Parade/Yahoo: Bedeutung der Medusa-Tattoos](https://www.yahoo.com/lifestyle/medusa-tattoos-everywhere-lately-heres-110000504.html)
- [Adweek: Versace-Logo](https://www.adweek.com/brand-marketing/versaces-medusa-logo-breaks-every-design-rule-so-why-does-it-work/)

Hinweis: Wikipedia und Blogs sind gut zum Einstieg, für die Abgabe aber nach Möglichkeit durch die Primärtexte oder Museumsseiten ersetzen.
