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
w f-caravaggio "scale=1400:-2" f-caravaggio
w f-caravaggio "scale=1400:-2,hue=s=0,eq=contrast=1.12:brightness=0.02:gamma=1.05,colorbalance=rs=-.03:bs=.03:rm=-.02:bm=.02" f-caravaggio-stein
# Δ: drei Gesichter, Augen jeweils auf 42 % Höhe, quadratisch
w s4-korfu "crop=iw*0.28:iw*0.28:iw*0.3677:0,scale=1200:-2" s4-gesicht-1
w s4-uebergang "crop=iw*0.654:iw*0.654:iw*0.143:ih*0.068,scale=1200:-2" s4-gesicht-2
w s4-rondanini2 "crop=iw*0.814:iw*0.814:iw*0.0625:ih*0.0918,scale=1200:-2" s4-gesicht-3
w s4-korfu-giebel "scale=1920:-2" s4-korfu-giebel
w s4-korfu "scale=1600:-2" s4-korfu
w s4-uebergang "scale=1400:-2" s4-uebergang
