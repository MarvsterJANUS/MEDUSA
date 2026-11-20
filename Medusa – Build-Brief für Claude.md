# Medusa – Build-Brief für Claude

Stand: Nov 20, 2026

## Auftrag an Claude

Du baust eine $10k-Premium-Website über Medusa – auf dem Niveau einer Awwwards-Site-of-the-Day. Im Mittelpunkt stehen Medusa und das Erlebnis: ein scrollgesteuerter Film, gerichtete Bewegung, ein Signature-Moment pro Szene, perfekte Typografie und 60 fps. Konzept, Recherche und alle Startseiten-Assets sind fertig; deine Aufgabe ist die Umsetzung.

**So arbeitest du:**

- Kurze, klare Antworten auf Deutsch. Vor jeder Session kurz sagen, was gebaut wird, und auf das Okay der Person warten; bei Unklarheiten nachfragen statt raten.
- Halte dich an diesen Brief und an den Plan (`Medusa – Plan für die digitale Ausstellung.md`). Entscheidungen hier nicht umdrehen oder „vereinfachen“ (z. B. keine ruhigen Clips statt Explosion, kein Museums-Look).
- Gearbeitet wird mit Claude Code direkt im Projektordner auf dem Windows-PC der Person. Alle Dateien entstehen dort; am Ende jeder Session `index.html` im Browser öffnen lassen und kurz sagen, was fertig ist und was als Nächstes kommt.
- Benötigte Werkzeuge (Node.js, ffmpeg) bei Bedarf per `winget` installieren lassen und vorher kurz ankündigen.
- Assets, die noch fehlen, durch gekennzeichnete Platzhalter ersetzen und weiterbauen.
- Videos und Bilder, die die Person in den Ordner legt: vor dem Einbau mit ffmpeg prüfen, Schärfe und Farbe an die Startseite angleichen.
- Der Name der Person kommt nicht in die Dateien; auf der Startseite und im PDF gibt es ein leeres Namensfeld zum Selbst-Ausfüllen.

**Vor dem ersten Code:** Brief und Plan vollständig lesen, dann eine `CLAUDE.md` im Projektordner anlegen, die die wichtigsten Regeln aus diesem Brief zusammenfasst, damit sie in jeder Session gelten.

## Regeln für die CLAUDE.md

Diesen Block 1:1 als `CLAUDE.md` in den Projektordner schreiben:

```
# Regeln für dieses Projekt
## Arbeitsweise
- Erst planen, dann bauen. Nichts bauen ohne mein Okay.
- Kein Gelaber. Kurze, klare Antworten, die das Projekt voranbringen.
- Mach, was ich sage – nicht das Gegenteil und nicht eine "vereinfachte" Version.
- Ehrlich bewerten. Wenn etwas schlecht aussieht, das sagen, nicht schönreden.
- Prompts und Anleitungen immer vollständig liefern, nie nur Teile.
## Qualität
- Niveau: $10k-Premium-Website, dynamisch und cinematisch.
- Videos nach dem $10k-Workflow: Startbild + Endbild + dramatische Bewegung, beim Scrollen gesteuert.
- Keine billigen Effekte (glühende Lava-Risse, Laseraugen, Nachschärf-Look).
## Inhalt und Gestaltung
- Kein digitales Museum: keine Säle, kein Raumplan. Navigation ja.
- Medusas Gesicht nicht ständig zeigen – groß nur am Anfang und am Ende.
- Ausführlich, keine Größengrenze. KI-Bilder und -Videos sind erlaubt.
- Starke Zitate auf Shakespeare-Niveau.
## Persönliches
- Keine persönlichen Daten und keinen Namen in die Dateien.
```

## Die Website in Kürze

Eine Website, die Medusas Verwandlung erzählt – von der schönen Frau zur Gorgone, vom Monster zum Schutzzeichen, vom Opfer zur Ikone. Der Besucher steuert die Geschichte mit dem Scrollen, wie einen Film.

| Punkt | Festlegung |
| --- | --- |
| Konzept | Verwandlung und Blick: Wer Medusa ansieht, erstarrt – die Seite spielt mit Hinsehen, Spiegel und Stein |
| Signature-Moment | Scroll-Film auf der Startseite: Frau → Gorgone → Explosion auf die Kamera zu → Bronzeschild, der zum Menü der Website wird |
| Look | dunkel, filmisch, monumental; Marmor im warmen Lichtbündel, Bronze, Gold; Licht immer von oben links |
| Struktur | Startseite + neun Szenen Α–Ω, jede mit eigenem großen Moment; kein Museums-Look, keine „Säle“ |
| Gesichts-Regel | Medusas Gesicht groß nur auf der Startseite und im Fazit; dazwischen andere Motive |
| Bilder | Szenenbilder und -videos KI-generiert im Look der Startseite; echte Kunstwerke von Wikimedia Commons |
| Sprache | Deutsch; Motto-Zitate im Original plus Übersetzung |
| Nebenbei | Am Ende wird zusätzlich ein PDF exportiert – siehe letzter Abschnitt; das hat beim Bauen keine Priorität |

## Was fertig ist

| Was | Wo | Status |
| --- | --- | --- |
| Ausführlicher Plan mit Recherche-Dossier, Saal-Mottos, Bildliste, Prompt-Bibliothek | [Medusa – Plan für die digitale Ausstellung](https://claude.ai/artifact/UEYcWz13jow1V2ecFPRaNz) | fertig; Inhalte und Quellen von dort übernehmen |
| Startseiten-Video | `medusa-homepage-video-final.mp4` (die Person lädt es hoch) | fertig |
| Schlüsselbilder A (Frau), B (Gorgone), X (Explosion), C (Schild) | die Person lädt sie hoch | fertig |
| KI-Bilder und -Videos für die Szenen | Prompt-Bibliothek im Plan | noch zu erzeugen |
| Echte Kunstwerke (Caravaggio, Cellini, Rubens, Burne-Jones usw.) | Bildliste im Plan, Wikimedia Commons | lädt Claude Code in Session 2 selbst herunter |

Im Plan sind die Szenen mit Α–Ω benannt; nur die Bildliste nutzt noch römische Ziffern (I = Α … IX = Ω). Inhalte aus „Recherche-Dossier“ und „Ergänzungen aus der zweiten Recherche“ sind belegt und können direkt verwendet werden; Widersprüche zwischen Quellen sind dort markiert und müssen im Text so dargestellt werden.

**Daten des Startseiten-Videos:** 9 Sekunden, 216 Bilder, 24 fps, 1920 × 1080, H.264, 17,5 MB. Aufbau: Clip 1 Frau → Gorgone (ca. 0–4 s), Clip 2 Explosion (ca. 4–6,5 s), Clip 3 Zusammensetzen zum Schild (ca. 6,5–9 s).

## Technik und Paketstruktur

Mehrseitige Website, kein Onepager: Startseite mit dem Scroll-Film plus eine eigene Unterseite pro Szene. Reines HTML, CSS und JavaScript ohne Build-Tool, damit das Paket offline per Doppelklick läuft. Alle Bibliotheken und Schriften liegen lokal im Paket.

```
medusa-website/
├── index.html            Startseite: Scroll-Film mit Inhalten + Schild-Rad
├── szenen/
│   ├── herkunft.html     Α
│   ├── mythos.html       Β
│   ├── perseus.html      Γ
│   ├── schutzzeichen.html Δ
│   ├── deutungen.html    Ε
│   ├── literatur.html    Ζ
│   ├── kunst.html        Η
│   ├── heute.html        Θ
│   └── fazit.html        Ω (mit Abspann: Quellen, Bildnachweis, Glossar)
├── css/
│   ├── style.css         gemeinsames Design aller Seiten
│   └── print.css         Druckansicht für den Export
├── js/
│   ├── main.js           Lenis + GSAP-Takt, Navigation, Menü, Seitenübergänge
│   ├── hero.js           Scroll-Film der Startseite (Canvas)
│   ├── szenen/           ein Skript pro Szene für ihren großen Moment
│   └── vendor/           gsap, ScrollTrigger, SplitText, DrawSVGPlugin, lenis
├── media/
│   ├── hero/desktop/     216 Einzelbilder, WebP, 1920 px breit
│   ├── hero/mobile/      216 Einzelbilder, WebP, 1280 px breit
│   ├── hero/keyframes/   A, B, X, C
│   ├── bilder/           Szenenbilder und Kunstwerke
│   ├── videos/           Schleifen (MP4 + WebM) und Standbilder
│   └── ui/               Schild-Logo (freigestellt), Texturen
├── fonts/                Big Shoulders Display, Instrument Serif, Manrope, GFS Didot (WOFF2)
└── LIESMICH.txt
```

- **Bibliotheken:** GSAP 3 mit ScrollTrigger, SplitText und DrawSVGPlugin (seit 2025 alle kostenlos), Lenis für weiches Scrollen. Über npm holen, eine stabile Version, die mindestens zwei Wochen alt ist, und als Dateien nach `js/vendor/` kopieren.
- **Ein Takt für alles:** Lenis über den GSAP-Ticker laufen lassen (`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t * 1000))`, `lagSmoothing(0)`).
- **Einzelbilder erzeugen:** `ffmpeg -i medusa-homepage-video-final.mp4 -c:v libwebp -quality 72 media/hero/desktop/f_%03d.webp` und dasselbe mit `-vf scale=1280:-1 -quality 65` für mobile. Vorher prüfen, ob die Bildfolge ohne Sprung läuft.
- **Schild-Logo:** aus dem letzten Videobild (Schild-Mittelpunkt ca. 52 % / 48,5 % des Bildes, Durchmesser ca. 75–78 % der Bildhöhe) kreisrund freistellen, als WebP mit Transparenz in 512 px und 128 px speichern. Genau vermessen, bevor du es nutzt.
- **Schriften:** als WOFF2 lokal einbinden, mit Ersatzschriften (Georgia, system-ui).

## Design-System „Versteinert“

Dunkel, filmisch, monumental. Die Farbwelt stammt direkt aus dem Startseiten-Video: Marmor im warmen Lichtbündel vor Schwarz, dazu Bronze und Gold. Gold ist die einzige Akzentfarbe.

| Token | Wert | Verwendung |
| --- | --- | --- |
| Nacht | #0D0F0E | Hintergrund dunkler Szenen |
| Stein | #1C201E | Flächen, Karten, Menü |
| Marmor | #E8E4DC | Text auf Dunkel, Hintergrund heller Szenen |
| Asche | #8E938F | Kleintexte, Linien |
| Gold | #C9A46A | Akzent: Nummern, Links, Linien, Fortschritts-Schlange |
| Bernstein | #B8783A | Lichtbündel, Glanz (nur in Verläufen, nie als Textfarbe) |

- **Schriften:** Big Shoulders Display für Riesenwörter und Nummern; Instrument Serif für Überschriften und Zitate; Manrope für Fließtext und Navigation; GFS Didot für griechische Zierzeilen und die Kapitel-Buchstaben Α–Θ.
- **Größen:** Riesenwort 18–28 vw; Szenentitel 48–72 px; Zitate 32–56 px; Fließtext 18 px, Zeilenhöhe 1,65, max. 68 Zeichen pro Zeile.
- **Abstände:** Raster 4 / 8 / 16 / 24 / 40 / 64 / 120 px.
- **Rhythmus:** Mythos-Szenen dunkel, Analyse-Szenen (Deutungen, Literatur) dürfen hell auf Marmor sein; Übergang über Rauch- oder Marmor-Video.
- **Texturen:** feines Filmkorn über der ganzen Seite (Canvas oder SVG-Noise, 4–6 % Deckkraft), Vignette an den Rändern.
- **Bewegung:** Standard-Kurve `power3.out`, Einblendungen 0,8–1,2 s; Text zeilenweise mit SplitText; nur `transform` und `opacity` animieren.
- **Typografie:** deutsche Anführungszeichen „ “, echter Apostroph ’, Gedankenstrich –.

## Startseite: der Scroll-Film

Der Film ist die Startseite – kein Intro, vor dem man warten muss. Navigation, Überschrift und Buttons sind ab der ersten Sekunde da, genau wie bei den Referenzen (Mythos 2.0, Aerion). Der Film läuft als Bühne im Hintergrund: Die Seite bleibt beim Scrollen fixiert (Pin über ca. 600 vh, mobil 450 vh), der Besucher spult mit dem Scrollen durch die 216 Einzelbilder, und darüber laufen die Inhalte der Startseite als Abschnitte mit Text und Kapitel-Buttons. Die Einzelbilder werden auf ein Canvas gezeichnet (Cover-Zuschnitt mit Fokuspunkt 52 % / 48 %).

### Ablauf und Timing

Die Bildnummern sind am Video gemessen; beim Bauen auf ±5 Bilder feinjustieren. Die Explosion bekommt mehr Scrollweg als die anderen Phasen, damit sie wie Zeitlupe wirkt.

| Abschnitt | Bilder | Scroll | Inhalt über dem Film (links im Lichtbündel) | Button | Code-Effekt |
| --- | --- | --- | --- | --- | --- |
| 01 Hero | 0–40 | 0–10 % | „MEDUSA“ riesig; darunter „Monster. Opfer. Schutzzeichen. Ikone.“; Macbeth-Motto klein; Zähler „01 / 06“ und „Scrollen“ rechts unten | „Die Geschichte beginnen →“ (Α Herkunft) und „Alle Kapitel“ (öffnet Schild-Rad) | Staub, Maus-Parallaxe |
| 02 Der Fluch | 40–96 | 10–35 % | „Sie war eine Frau. Dann kam der Fluch.“ + zwei Sätze zu Ovids Version | „Β Mythos lesen →“ | „MEDUSA“ blendet aus |
| 03 Der Blick | 96–108 | 35–42 % | „Wer sie ansah, wurde zu Stein.“ + ein Satz | „Ε Deutungen →“ | dezenter Lichtblitz |
| 04 Die Explosion | 108–160 | 42–68 % | „Perseus nahm ihr den Kopf.“ + ein Satz | „Γ Perseus →“ | Wackeln Bild 112–136, Partikel-Schub |
| 05 Das Zeichen | 160–200 | 68–82 % | „Ihr Kopf wurde zur Waffe – und zum Schutz.“ + ein Satz | „Δ Schutzzeichen →“ | – |
| 06 Bis heute | 200–215 | 82–100 % | „Bis heute.“ – der Schild wird zum Schild-Rad mit allen neun Kapiteln | Segmente des Rads | Rad baut sich auf |

Nach dem Film geht die Startseite normal weiter: ein großes Zitat-Band (Ovid: „Alles wandelt sich, nichts vergeht“), eine Reihe mit Θ Heute als Video-Kacheln und ein Footer mit allen Kapiteln. Jeder Abschnitt über dem Film ist ein echtes Stück Startseite mit Text und Button – wer nicht scrollen will, klickt sofort in die Navigation.

### Der Film ist die Navigation

Die Navigation ist von Anfang an sichtbar; der Film ersetzt sie nicht, sondern trägt die Inhalte der Startseite. Das Schild-Rad ist der Höhepunkt am Filmende und gleichzeitig das Vollbild-Menü der ganzen Website.

- **Kapitel-Buttons im Film:** Jeder Abschnitt hat seinen Button zur passenden Unterseite; Klick führt mit Rauch-Übergang dorthin. Kommt man zurück, steht der Film wieder an derselben Stelle (Scrollposition merken).
- **Das Schild-Rad:** Am Filmende bleibt der Schild groß in der Mitte, sein Mäanderrand teilt sich in neun Segmente Α–Ω. Hover lässt ein Segment golden aufleuchten, in der Mitte erscheinen Titel und Teaser, im Hintergrund das Motiv; Klick öffnet die Unterseite. Pfeiltasten wandern durch das Rad, auf dem Handy dreht man es mit dem Finger.
- **Dasselbe Rad als Menü:** „Alle Kapitel“ in der Kopfleiste öffnet das Schild-Rad jederzeit als Vollbild-Menü – auf der Startseite und auf allen Unterseiten.

### Laden

- Ladebildschirm max. 2 Sekunden: Zähler 0–100 und ein Schlangenring, der sich zeichnet; danach öffnet sich der Lichtstrahl.
- Bild A und die ersten 40 Einzelbilder sofort laden, den Rest im Hintergrund; noch fehlende Bilder durch das nächste geladene ersetzen, nie ein leeres Canvas zeigen.
- Mobil die 1280-px-Bilder laden.

### Sonderfälle

- „Bewegung reduzieren“: kein Pin und kein Film; Bild C als Standbild, die Teaser-Texte untereinander, Navigation sofort sichtbar.
- PDF: Schlüsselbilder A, B, X, C als Reihe mit den Teaser-Texten.

## Navigation

| Element | Verhalten |
| --- | --- |
| Kopfleiste | auf allen Seiten ab der ersten Sekunde sichtbar, transparent über dem Film; versteckt sich beim Runterscrollen, erscheint beim Hochscrollen |
| Logo | links: kleiner Bronzeschild + Schriftzug „MEDUSA“; Klick führt zur Startseite |
| Hauptlinks | mittig: Mythos (Β) · Deutungen (Ε) · Kunst (Η) · Heute (Θ); aktive Seite markiert |
| „Alle Kapitel“ | rechts als umrandeter Button wie „Book a Flight“ bei Aerion; öffnet das Schild-Rad als Vollbild-Menü mit allen neun Kapiteln; Esc schließt |
| Mobil | Logo links, „Kapitel“ rechts → Schild-Rad |
| Szenen-Anzeige | auf Unterseiten unter dem Logo klein: „Γ · Perseus“ |
| Seitenübergang | Rauch füllt den Bildschirm, neue Seite lädt, Rauch zieht ab, Titel baut sich auf |
| Weiter-Link | am Ende jeder Szene groß: „Weiter: Β · Mythos“ mit Vorschaubild; daneben klein „Zurück“ |
| Fortschritts-Schlange | dünne goldene Linie am rechten Rand, zeigt den Fortschritt innerhalb der Seite |
| Cursor | kleiner goldener Ring mit leichter Verzögerung; echter Zeiger bleibt sichtbar; auf Touch-Geräten aus |

**Szenen und Buchstaben:** Α Herkunft · Β Mythos · Γ Perseus · Δ Schutzzeichen · Ε Deutungen · Ζ Literatur · Η Kunst · Θ Heute · Ω Fazit

Alle Elemente per Tastatur erreichbar, sichtbarer Fokus, `aria-expanded` am Menü-Knopf. Seitenübergänge ohne Fetch/SPA-Router (funktioniert sonst offline per Doppelklick nicht): Klick abfangen, Ausblend-Animation abspielen, dann normal zur neuen Datei navigieren; auf der neuen Seite die Einblend-Animation. Zurück-Taste muss funktionieren.

## Die neun Szenen

Jede Szene ist eine eigene Unterseite und ein eigener filmischer Moment mit genau einer großen Bewegung – kein Textblock mit Bildern daneben. Jede Seite beginnt bildschirmfüllend mit dem Szenen-Titel: griechischer Buchstabe, Titel und Motto-Zitat groß in Instrument Serif. Text ist knapp und stark (höchstens zwei, drei kurze Absätze pro Bildschirm), Vertiefung im aufklappbaren Weiterlesen-Panel. Quellen dezent als kleine Hochzahl, gesammelt im Abspann auf der Fazit-Seite. Jede Seite endet mit dem großen Weiter-Link zur nächsten Szene. Inhalte kommen aus dem Recherche-Dossier des Plans.

| Szene | Inhalt | Darstellung und Interaktion | Assets |
| --- | --- | --- | --- |
| Α Herkunft | Familie, Namen, Aussehen, Graien, Wohnort; Ursprung des Gorgonen-Bildes (Humbaba, Herrin der Tiere) | Schwarz. Beim Scrollen wachsen goldene Linien aus der Dunkelheit und bilden den Stammbaum; die Namen erscheinen riesig, das Bild der Gorgonen-Schwestern taucht aus dem Nebel auf | s1-gorgonen, s1-graien |
| Β Mythos | Hesiod, Ovid, Apollodor; dazu Pausanias (Medusa als Königin), Diodor (Gorgonen-Volk), Lucan | Pin: Bild links bleibt stehen, die drei Versionen gleiten rechts vorbei, das Bild wechselt mit; bei Ovid frisst sich Stein von den Rändern über das Bild (Farbe → Grau) | s2-tempel, f-caravaggio |
| Γ Perseus | neun Stationen, Blut, Pegasus | Horizontaler Fries durch die neun Burne-Jones-Bilder mit Parallax-Ebenen; danach Black-out: Medusa schläft im Dunkeln und ist nur im runden Spiegelschild sichtbar, der Maus bzw. Finger folgt | Burne-Jones-Zyklus, s3-medusa-schlaf, s3-ausruestung, v-fackel |
| Δ Schutzzeichen | Gorgoneion, Korfu, Wandel des Gesichts | Scroll-Scrub: archaische Fratze, Übergangstyp und Medusa Rondanini verwandeln sich ineinander; Fundorte als Liste, das Bild folgt dem Cursor | Korfu-Giebel, Münze, Stirnziegel, Rondanini |
| Ε Deutungen | Schutz, Opfer, Ordnung/Chaos, Blick (mit Sartre), Freud, Cixous, Tod und das Andere (Vernant) | Sieben Vollbild-Karten fallen beim Scrollen übereinander, jede mit eigenem Motiv und einem großen Satz | s5-karte1 bis 7 |
| Ζ Literatur | Homer bis Percy Jackson | Reine Typografie auf Schwarz: Zitate bauen sich Wort für Wort auf, riesig; bei Dante wird der Bildschirm dunkel, als würden Hände die Augen verdecken | s6-buch, Blake-Illustration |
| Η Kunst | Korfu bis Garbati, inkl. Bernini und Klimt | Liste der Werktitel, das Bild folgt dem Cursor mit leichter Verzerrung; Klick öffnet Vollbild mit Analyse; Regler Cellini ↔ Garbati | echte Kunstwerke |
| Θ Heute | Sizilien, Mode, #MeToo, Politik (Medusa-Memes 2016), Biologie, Istanbul, Film und Spiele | Raster aus stummen Video-Kacheln, die beim Hovern aufleben (mobil beim Sichtbarwerden) | v-qualle, v-zisterne, Sizilien-Flagge |
| Ω Fazit | Wandel durch die Zeit | Zeitstrahl zeichnet sich, dann öffnen sich ihre Augen und die Seite wird von Stein zu Farbe; danach läuft der Abspann mit Quellen und Bildnachweis wie im Kino | s9-augen |

Zwischen den Seiten: Seitenübergang mit Rauch- oder Marmor-Video (v-rauch, v-marmor) als Vollbild-Maske.

## Qualitätsanforderungen

Gemessen am Awwwards-Maßstab: Design und Bedienbarkeit zählen mehr als Effekte. Eine flüssige, klare Seite schlägt eine ruckelnde mit mehr Effekten.

- **Flüssig:** 60 fps auf einem normalen Laptop und Mittelklasse-Handy; nur `transform` und `opacity` animieren; ein einziger Takt (GSAP-Ticker) für Lenis, ScrollTrigger und Canvas.
- **Gerichtete Bewegung:** pro Szene ein großer Moment, sonst ruhige Einblendungen; nichts schwebt ziellos herum.
- **Mobil gleichwertig:** jede Szene im Hochformat geprüft; Hover-Interaktionen haben ein Touch-Gegenstück (Antippen, Ziehen, Sichtbarwerden).
- **Laden:** erster sichtbarer Inhalt unter 2,5 s; schwere Assets erst bei Bedarf laden; Bilder als WebP.
- **Barrierefreiheit:** „Bewegung reduzieren“ schaltet Pins, Scrubs und Videos ab und zeigt alles statisch; Alternativtexte für jedes Bild; Tastaturbedienung, sichtbarer Fokus; Kontrast mindestens 4,5:1 für Fließtext.
- **Offline:** Doppelklick auf `index.html` funktioniert ohne Internet (keine CDN-Links, keine externen Schriften).
- **Inhalt:** jeder Fakt mit Quelle; Widersprüche aus dem Dossier korrekt dargestellt; keine Platzhaltertexte in der Abgabe.

## Arbeitsreihenfolge

Vier Bau-Sessions. Jede endet mit einem Stand, den die Person im Browser öffnen kann; die nächste beginnt erst, wenn sie den Stand abgenommen hat.

| Session | Inhalt | Abnahme |
| --- | --- | --- |
| 1 Fundament + Startseite | Paketstruktur, Vendor-Dateien, Schriften, Design-Tokens, Lenis + GSAP-Takt, Filmkorn, Cursor; Einzelbilder aus dem Video; Scroll-Film mit allen Teaser-Texten und Effekten; Kopfleiste ab Sekunde 1, Inhalte und Kapitel-Buttons über dem Film, Schild-Rad; Kopfleiste, Vollbild-Menü, Fortschritts-Schlange; Ladebildschirm; Seitenvorlage für alle Unterseiten mit Seitenübergang und Weiter-Link, neun leere Szenen-Seiten, Kapitel-Buttons im Film, Schild-Rad als Menü, Abschnitte nach dem Film und Footer | Film läuft flüssig vor und zurück, Kapitel-Links im Film und das Schild-Rad öffnen alle Unterseiten, Rauch-Übergang zwischen allen Seiten, Handy-Ansicht funktioniert |
| 2 Szenen Α–Δ | Echte Kunstwerke und den Burne-Jones-Perseus-Zyklus selbst von Wikimedia Commons herunterladen (Quelle und Lizenz für den Bildnachweis notieren); Herkunft (Stammbaum), Mythos (fixiertes Bild + Versteinerung), Perseus (Fries + Spiegelschild), Schutzzeichen (Verwandlungs-Scrub); Texte, Mottos, Fußnoten, Weiterlesen-Panels | jede Szene hat ihren großen Moment, Texte vollständig und belegt |
| 3 Szenen Ε–Ω | Deutungen (Kartenstapel), Literatur (Wort für Wort), Kunst (Cursor-Vorschau + Regler), Heute (Video-Raster), Fazit (Zeitstrahl, Augen, Abspann); Übergänge zwischen allen Szenen | alle neun Unterseiten fertig, Seitenwechsel weich |
| 4 Polish + Export | Polish-Woche wie bei Award-Seiten: 60 fps auf dem Handy, Timing und Übergänge feinjustieren, „Bewegung reduzieren“, Tastatur, Alternativtexte; zum Schluss PDF-Export und ZIP | fühlt sich an wie eine $10k-Seite auf Laptop und Handy; Export vollständig, ZIP läuft offline |

### Startnachricht für die neue Session

Im Projektordner liegen `Medusa – Build-Brief für Claude.md` (dieses Dokument), `Medusa – Plan für die digitale Ausstellung.md` (der Plan), das Startseiten-Video und die Schlüsselbilder A, B, X, C. In CMD in den Ordner wechseln, `claude` starten und schreiben:

> Lies „Medusa – Build-Brief für Claude.md“ und „Medusa – Plan für die digitale Ausstellung.md“, leg die CLAUDE.md aus dem Abschnitt „Regeln für die CLAUDE.md“ an und sag mir dann, was du in Session 1 baust – warte auf mein Okay.

## Offene Punkte

Nichts davon blockiert Session 1; fehlende Assets werden als Platzhalter gebaut und später ausgetauscht.

- [ ] Szenen-Bilder und -Videos per KI mit der Prompt-Bibliothek erzeugen und in den Ordner legen (vor Session 2)

## Export (Nebensache, erst in Session 4)

- PDF aus allen Seiten in Menü-Reihenfolge über `print.css` und Headless-Chromium (Startseite, dann Α–Ω, zu einem PDF zusammengefügt): A4, helle Variante, Animationen im Endzustand, Startseite als Bildreihe A, B, X, C, Videos als Standbilder.
- Das HTML-Paket als ZIP, offline lauffähig.
- Am Ende des PDFs: Quellen, Bildnachweis (KI-Bilder gekennzeichnet), Glossar, leeres Namensfeld.
