console.log("p@$$w0rd");
const START_HOURS = 1;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = MINUTES_PER_HOUR * SECONDS_PER_MINUTE;
const hourSpan = document.getElementById("hours");
const minuteSpan = document.getElementById("minutes");
const secondSpan = document.getElementById("seconds");
const controls = document.getElementById("controls");
const codeInput = document.getElementById("code");
const feedback = document.getElementById("instructions");
const timeContainer = document.getElementById("timer");
let timeLeft = START_HOURS * MINUTES_PER_HOUR * SECONDS_PER_MINUTE;
let countdown;
let tickSpeed = 1000;
const lblText = "Enter the code to stop the AI takeover!";
let clueText = "Hint: Open the browser console (F12)";

feedback.innerHTML = `${lblText}<br>${clueText}`;
setClock();
setCountdown();

function setClock() {
    if (timeLeft < 0) timeLeft = 0;
    if (timeLeft < SECONDS_PER_MINUTE * 2) addStress();

    let tempTime = timeLeft;
    hourSpan.textContent = Math.floor(tempTime / SECONDS_PER_HOUR)
        .toString()
        .padStart(2, "0");
    tempTime %= SECONDS_PER_HOUR;
    minuteSpan.textContent = Math.floor(tempTime / SECONDS_PER_MINUTE)
        .toString()
        .padStart(2, "0");
    tempTime %= SECONDS_PER_MINUTE;
    secondSpan.textContent = tempTime.toString().padStart(2, "0");
}

function setCountdown() {
    if (countdown) clearInterval(countdown);
    countdown = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            timeLeft = 0;
            clearInterval(countdown);
            document.body.classList.add("ai-takeover");
        }
        setClock();
    }, tickSpeed);
}

controls.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userCode = codeInput.value;
    const encryptedCode = await sha256(userCode);

    if (
        encryptedCode ===
        "6f446c68112122635df0c5cab319203a7e10e843accd8d60a90721a1b3420036"
    ) {
        clearInterval(countdown);
        document.body.classList.add("success");
        return;
    }

    updateClue(userCode);
    blinkRed();
    feedback.innerHTML = "That's incorrect<br>Countdown Adjusted";
    setTimeout(() => {
        feedback.innerHTML = `${lblText}<br>${clueText}`;
    }, 1000);
    timeLeft = Math.floor(timeLeft / 2);
    if (timeLeft < 5 * SECONDS_PER_MINUTE) {
        tickSpeed /= 2;
        setCountdown();
    }
});

function addStress() {
    timeContainer.classList.add("stress");
}

function blinkRed() {
    timeContainer.classList.add("wrong");
    setTimeout(() => timeContainer.classList.remove("wrong"), 1000);
}

function updateClue(userCode) {
    if (userCode === "p@$$w0rd") {
        clueText = "Try looking in the CSS";
    } else if (userCode === "D0ntUseTh1$P@ssw0rd!") {
        clueText = "Look in the HTML source";
    } else if (userCode === "U$eY0urH3@d!") {
        clueText = "The answer is right in front of you!";
    }
}

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
