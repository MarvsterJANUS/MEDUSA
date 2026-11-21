#!/bin/sh
# Wandelt quellen-bilder/*.jpg in WebP für die Website um (Ausschnitte für die Szenen).
cd "$(dirname "$0")/.." || exit 1
FF=node_modules/ffmpeg-static/ffmpeg.exe
Q=quellen-bilder
O=medusa-website/media/bilder
mkdir -p $O
w() { $FF -v error -y -i "$Q/$1.jpg" -vf "$2" -c:v libwebp -quality ${4:-80} "$O/$3.webp"; }
# Burne-Jones-Zyklus (Fries in Γ)
for i in 01 02 03 04 05 06 07 08 09; do w s3-bj-$i "scale='min(1400,iw)':-2" s3-bj-$i 74; done
# Α: Medaillon aus der Trinkschale
w s1-gorgonen-vase "crop=iw*0.346:iw*0.346:iw*0.324:ih*0.372,scale=1200:-2" s1-gorgonen-vase
# Β: Gorgo (Hesiod), Caravaggio + Stein-Fassung
w s2-gorgo-archaisch "crop=ih:ih:iw*0.1166:0,scale=1400:-2" s2-gorgo-archaisch 70
# rund freigestellt (Schild ohne grauen Hintergrund), Farb- und Stein-Fassung deckungsgleich
RUND="crop=1320:1320:38:26,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*clip((650-hypot(X-660.5,Y-660))/2.5,0,1)',scale=1200:1200:flags=lanczos"
w f-caravaggio "scale=1400:-2,$RUND" f-caravaggio 85
w f-caravaggio "scale=1400:-2,hue=s=0,eq=contrast=1.12:brightness=0.02:gamma=1.05,colorbalance=rs=-.03:bs=.03:rm=-.02:bm=.02,$RUND" f-caravaggio-stein 85
# Δ: drei Gesichter, Augen jeweils auf 42 % Höhe, quadratisch
w s4-korfu "crop=iw*0.28:iw*0.28:iw*0.3677:0,scale=1200:-2" s4-gesicht-1
w s4-uebergang "crop=iw*0.654:iw*0.654:iw*0.143:ih*0.068,scale=1200:-2" s4-gesicht-2
w s4-rondanini2 "crop=iw*0.814:iw*0.814:iw*0.0625:ih*0.0918,scale=1200:-2" s4-gesicht-3
w s4-korfu-giebel "scale=1920:-2" s4-korfu-giebel
w s4-korfu "scale=1600:-2" s4-korfu
w s4-uebergang "scale=1400:-2" s4-uebergang
# Ζ: Doré, Inferno IX (Furien) – Bildunterschrift abgeschnitten, warm abgedunkelt
w s6-dore "crop=676:960:12:10,eq=gamma=0.82:contrast=1.12:brightness=-0.05,colorchannelmixer=rr=1.0:gg=0.93:bb=0.80,vignette=angle=PI/4.2" s6-dore 86
# Η Kunst: Werke (längste Seite max. 1600 px)
for k in s7-cellini s7-canova s7-bernini s7-klimt s7-gericault s7-rubens s7-uffizi s7-boecklin s7-garbati s7-garbati-ny; do
  w $k "scale='if(gt(iw,ih),min(1600,iw),-2)':'if(gt(iw,ih),-2,min(1600,ih))'" $k 82
done
# Η Kunst: Vergleichsregler Cellini ↔ Garbati, gleich große Hochformate (4:5), dunkel abgestimmt
w s7-cellini "crop=1920:2400:0:120,scale=1000:1250,curves=all='0/0 0.25/0.25 0.55/0.45 1/0.58',eq=contrast=1.12:gamma=0.97,vignette=angle=PI/3.8" s7-vergleich-cellini 84
w s7-garbati "crop=560:700:320:40,scale=1000:1250,eq=gamma=0.95,vignette=angle=PI/4" s7-vergleich-garbati 84
# Θ Heute: Kacheln im Hochformat 800×1000
w s8-zisterne "scale=1920:-2,crop=900:1125:620:150,scale=800:1000,eq=gamma=0.9" s8-zisterne 82
w s8-flagge "crop=ih*0.8:ih:(iw-ih*0.8)/2:0,scale=800:1000" s8-flagge 85
w s8-tattoo "scale=1500:-2,crop=1200:1500:150:250,scale=800:1000" s8-tattoo 82
w s8-harryhausen "crop=1095:1369:0:0,scale=800:1000,eq=gamma=0.9:saturation=0.85" s8-harryhausen 82
# Versace-Emblem: Schachbrett ist eingebrannt → dunkle Linien als Maske, Marmorweiß auf Nacht
$FF -v error -y -f lavfi -i color=c=0x0D0F0E:s=800x1000 -i "$Q/s8-versace.png" -filter_complex "[1]scale=600:600,format=rgba,geq=r=232:g=228:b=220:a='if(lt((r(X,Y)+g(X,Y)+b(X,Y))/3,110),255,0)'[l];[0][l]overlay=100:200" -frames:v 1 -c:v libwebp -quality 85 "$O/s8-versace.webp"
# Qualle: 8-s-Schleife, Blau → Gold auf Schwarz (Rot+Grün als Helligkeit), MP4 + WebM + Standbild
QV="trim=start=2:end=10,setpts=PTS-STARTPTS,crop=864:1080:528:0,scale=640:800:flags=lanczos,colorchannelmixer=rr=.5:rg=.5:rb=0:gr=.5:gg=.5:gb=0:br=.5:bg=.5:bb=0,curves=all='0/0 0.12/0.02 0.55/0.6 1/1',colorchannelmixer=rr=1.0:gg=0.80:bb=0.50,fps=24,format=yuv420p"
mkdir -p medusa-website/media/videos
$FF -v error -y -i "$Q/s8-qualle.webm" -an -vf "$QV" -c:v libx264 -preset slow -crf 23 -movflags +faststart medusa-website/media/videos/s8-qualle.mp4
$FF -v error -y -i "$Q/s8-qualle.webm" -an -vf "$QV" -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 medusa-website/media/videos/s8-qualle.webm
$FF -v error -y -ss 3 -i medusa-website/media/videos/s8-qualle.mp4 -frames:v 1 -c:v libwebp -quality 80 "$O/s8-qualle.webp"
# Ω Fazit: Augen-Video als Einzelbilder (Scroll-Scrub), Standbilder für „Bewegung reduzieren“
mkdir -p medusa-website/media/fazit/desktop medusa-website/media/fazit/mobile
$FF -v error -y -i ki-bilder/s9-augen-animation.mp4 -vf "scale=1600:-2:flags=lanczos" -c:v libwebp -quality 72 medusa-website/media/fazit/desktop/f_%03d.webp
$FF -v error -y -i ki-bilder/s9-augen-animation.mp4 -vf "scale=960:-2:flags=lanczos" -c:v libwebp -quality 68 medusa-website/media/fazit/mobile/f_%03d.webp
