const START_HOURS = 1;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = MINUTES_PER_HOUR * SECONDS_PER_MINUTE;
const hourSpan = document.getElementById("hours");
const minuteSpan = document.getElementById("minutes");
const secondSpan = document.getElementById("seconds");
const stopBtn = document.getElementById("check");
const codeInput = document.getElementById("code");
const feedback = document.getElementById("instructions");
let timeLeft = START_HOURS * MINUTES_PER_HOUR * SECONDS_PER_MINUTE; //total seconds
let countdown; //I want this in global scope
let tickSpeed = 1000;
const lblText = "Enter the code to stop the AI takeover!";
let clueText = "Hint: Open the broswer console (f12)";
feedback.innerHTML = lblText;
setClock();
setCountdown();
function setClock() {
    if (timeLeft < 0) timeLeft = 0;
    let tempTime = timeLeft;
    hourSpan.innerHTML = Math.floor(tempTime / SECONDS_PER_HOUR)
        .toString()
        .padStart(2, "0");
    tempTime %= SECONDS_PER_HOUR;
    minuteSpan.innerHTML = Math.floor(tempTime / SECONDS_PER_MINUTE)
        .toString()
        .padStart(2, "0");
    tempTime %= SECONDS_PER_MINUTE;
    secondSpan.innerHTML = tempTime.toString().padStart(2, "0");
}

function setCountdown() {
    if (countdown) clearInterval(countdown);
    countdown = setInterval(function () {
        timeLeft--;
        if (timeLeft <= 0) {
            timeLeft = 0;
            clearInterval(countdown);
            document.body.classList.add("ai-takeover");
        }
        setClock();
    }, tickSpeed);
}

stopBtn.addEventListener("click", async function () {
    let userCode = codeInput.value;
    let encryptedCode = await sha256(userCode);
    if (
        encryptedCode ===
        "e4ed86c1627cdfe936b0609ef8bb3270e3ab444191f7e4ba47e0ddce33f3a823"
    ) {
        clearInterval(countdown);
        document.body.classList.add("success");
    } else {
        feedback.innerHTML = "That's incorrect";
        setTimeout(function () {
            feedback.innerHTML = lblText;
        }, 1000);
        timeLeft = Math.floor(timeLeft / 2);
        if (timeLeft < 5 * SECONDS_PER_MINUTE) {
            tickSpeed /= 2;
            setCountdown();
        }
    }
});

async function sha256(message) {
    // Encode string as UTF-8 bytes
    const msgBuffer = new TextEncoder().encode(message);

    // Hash the message using SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

    // Convert ArrayBuffer back to a readable Hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
