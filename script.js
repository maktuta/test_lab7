let anim, controls, playBtn, closeBtn, startBtn;
let smallCircle, bigCircle;
let interval, events = [];
let serverURL = "server.php";

document.addEventListener("DOMContentLoaded", () => {
    anim = document.getElementById("anim");
    controls = document.getElementById("controls");
    playBtn = document.getElementById("playBtn");
    closeBtn = document.getElementById("closeBtn");
    startBtn = document.getElementById("startBtn");
    smallCircle = document.getElementById("circleSmall");
    bigCircle = document.getElementById("circleBig");

    playBtn.addEventListener("click", () => {
        document.getElementById("block5").style.display = "block";
        addEvent("Animation started");
    });

    closeBtn.addEventListener("click", () => {
        document.getElementById("block5").style.display = "none";
        showSavedEvents();
    });

    startBtn.addEventListener("click", startAnimation);
});

function addEvent(message) {
    let event = { id: events.length + 1, time: new Date().toLocaleString(), message };
    events.push(event);
    sendEventToServer(event);
    localStorage.setItem("events", JSON.stringify(events));
}

function sendEventToServer(event) {
    fetch(serverURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
    });
}

function startAnimation() {
    startBtn.style.display = "none";
    addEvent("Animation started");
    let smallDX = 2, smallDY = 2, bigDX = 1, bigDY = 1;
    interval = setInterval(() => {
        moveCircle(smallCircle, smallDX, smallDY, bigCircle);
        moveCircle(bigCircle, bigDX, bigDY);
    }, 16);
}

function moveCircle(circle, dx, dy, otherCircle = null) {
    let rect = circle.getBoundingClientRect();
    let animRect = anim.getBoundingClientRect();
    let x = rect.left + dx, y = rect.top + dy;

    if (x <= animRect.left || x + rect.width >= animRect.right) dx = -dx;
    if (y <= animRect.top || y + rect.height >= animRect.bottom) dy = -dy;

    circle.style.transform = `translate(${x}px, ${y}px)`;

    if (otherCircle && isOverlapping(circle, otherCircle)) {
        clearInterval(interval);
        addEvent("Circles overlapped, animation stopped");
    }
}

function isOverlapping(circle1, circle2) {
    let rect1 = circle1.getBoundingClientRect();
    let rect2 = circle2.getBoundingClientRect();
    return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

function showSavedEvents() {
    let localEvents = JSON.parse(localStorage.getItem("events") || "[]");
    fetch(serverURL)
        .then(res => res.json())
        .then(serverEvents => {
            document.getElementById("eventLogs").innerHTML = localEvents.map((event, i) => `
                <tr>
                    <td>${event.time}: ${event.message}</td>
                    <td>${serverEvents[i] ? serverEvents[i].time + ": " + serverEvents[i].message : ""}</td>
                </tr>
            `).join("");
        });
}
