# Clash Royale Emote Detector

Hold a hand gesture up to your webcam and the matching Clash Royale emote
pops up on screen. Runs entirely in the browser — no backend, no install.

## How it works

1. `utils/camera.js` opens the webcam and feeds frames to MediaPipe Hands
   (`libs/mediapipe/hands.js`), which returns 21 hand landmarks per frame.
2. `utils/gestures.js` turns those landmarks into a gesture label.
3. `utils/emoteManager.js` maps the label to an emote id.
4. `app.js` looks the id up in `data/emotes.json` and animates the GIF in,
   scaling and fading it, then hides it again after a short delay.

## Running it

The page needs to be served over `http://` or `https://` for the browser to
grant camera access — opening `index.html` directly from disk will not work.

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> and allow camera access when prompted.

## Adding an emote

Append an entry to `data/emotes.json`:

```json
{
  "id": "goblin_laugh",
  "label": "Goblin Laugh",
  "url": "https://media1.tenor.com/m/cSrjzp2jD8EAAAAC/clash-royale-emote-clash-royale.gif"
}
```

Then map a gesture to that `id` in `utils/emoteManager.js`.

## Files

| Path | Purpose |
|---|---|
| `index.html` | Page shell: video element and emote overlay |
| `app.js` | Emote loading and show/hide animation |
| `utils/camera.js` | Webcam capture and MediaPipe wiring |
| `utils/gestures.js` | Landmark-to-gesture classification |
| `utils/emoteManager.js` | Gesture-to-emote mapping |
| `data/emotes.json` | Emote ids, labels and GIF URLs |
| `style.css` | Layout and overlay styling |

## Notes

Emote GIFs are hotlinked from Tenor, so the page needs an internet connection
even though everything else runs locally.

## Licence

MIT — see [LICENSE](LICENSE).
