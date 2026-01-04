// ================== ELEMENTS ==================
const video = document.getElementById("camera");
const emoteImg = document.getElementById("emote");

// ================== LOAD EMOTES ==================
let EMOTES = {};

fetch("data/emotes.json")
  .then(res => res.json())
  .then(data => {
    data.emotes.forEach(e => EMOTES[e.id] = e.url);
    console.log("✅ Emotes loaded");
  });

// ================== SHOW EMOTE ==================
let hideTimer = null;

function showEmote(id) {
  if (!EMOTES[id]) return;

  emoteImg.src = EMOTES[id];
  emoteImg.style.display = "block";

  emoteImg.style.transform = "scale(0.7)";
  emoteImg.style.opacity = "0";

  requestAnimationFrame(() => {
    emoteImg.style.transform = "scale(1)";
    emoteImg.style.opacity = "1";
  });

  if (hideTimer) clearTimeout(hideTimer);

  hideTimer = setTimeout(() => {
    emoteImg.style.opacity = "0";
    setTimeout(() => {
      emoteImg.style.display = "none";
    }, 250);
  }, 2000);
}

// ================== MEDIAPIPE HANDS ==================
const hands = new Hands({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

function isFingerUp(tip, pip) {
  return tip.y < pip.y;
}

let lastGesture = null;
let stableCount = 0;

hands.onResults((results) => {

  if (
    !results.multiHandLandmarks ||
    !results.multiHandLandmarks[0] ||
    results.multiHandLandmarks[0].length !== 21
  ) return;

  const lm = results.multiHandLandmarks[0];

  const thumbUp  = isFingerUp(lm[4], lm[3]);
  const indexUp  = isFingerUp(lm[8], lm[6]);
  const middleUp = isFingerUp(lm[12], lm[10]);
  const ringUp   = isFingerUp(lm[16], lm[14]);
  const pinkyUp  = isFingerUp(lm[20], lm[18]);

  let gesture = null;

  // 👍 THUMBS UP
  // 👍 THUMBS UP
if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
  gesture = "THUMBS_UP";
}

// ✌️ PEACE SIGN
else if (indexUp && middleUp && !ringUp && !pinkyUp) {
  gesture = "PEACE";
}

// ✋ OPEN PALM
else if (thumbUp && indexUp && middleUp && ringUp && pinkyUp) {
  gesture = "OPEN_PALM";
}

// ✊ FIST (thumb ignored)
else if (!indexUp && !middleUp && !ringUp && !pinkyUp) {
  gesture = "FIST";
}


  // ---- STABILITY FILTER ----
  if (gesture === lastGesture) {
    stableCount++;

    if (stableCount === 8) {
      if (gesture === "THUMBS_UP") showEmote("goblin_excited");
      if (gesture === "OPEN_PALM") showEmote("king_laugh");
      if (gesture === "FIST") showEmote("take_the_l");
    }

  } else {
    lastGesture = gesture;
    stableCount = 0;
  }
});


// ================== CAMERA PIPELINE ==================
const cam = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});

cam.start();

// ================== KEYBOARD (BACKUP) ==================
document.addEventListener("keydown", (e) => {
  if (e.key === "1") showEmote("goblin_excited");
});
