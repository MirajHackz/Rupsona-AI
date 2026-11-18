// =================================
// ❤️ RUPSONA AI - JAVASCRIPT
// =================================

const chat = document.getElementById("chat");
const input = document.getElementById("message");
const typing = document.getElementById("typing");

let history = JSON.parse(
    localStorage.getItem("rupsona_history") || "[]"
);

// =================================
// DISPLAY MESSAGE
// =================================

function addMessage(text, type) {

    const div = document.createElement("div");

    div.className = type === "user"
        ? "message user-message"
        : "message bot-message";

    const name = document.createElement("div");

    name.className = "message-name";

    name.textContent = type === "user"
        ? "Miraj ❤️"
        : "Rupsona 💕";

    const content = document.createElement("div");

    content.textContent = text;

    div.appendChild(name);
    div.appendChild(content);

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}

// =================================
// SEND MESSAGE
// =================================

async function sendMessage() {

    const message = input.value.trim();

    if (!message) return;

    if (message.length > 4000) {
        alert("Message is too long!");
        return;
    }

    addMessage(message, "user");

    input.value = "";

    const previousHistory = [...history];

    history.push({
        role: "user",
        content: message
    });

    typing.style.display = "block";

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                message: message,

                history: previousHistory.slice(-12)

            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Server error");
        }

        const reply = data.reply;

        addMessage(reply, "bot");

        history.push({
            role: "assistant",
            content: reply
        });

        history = history.slice(-20);

        localStorage.setItem(
            "rupsona_history",
            JSON.stringify(history)
        );

    }

    catch (error) {

        console.error(error);

        addMessage(
            "Sorry Miraj! Connection problem. Please try again. ❤️",
            "bot"
        );

    }

    finally {

        typing.style.display = "none";

    }

}

// =================================
// ENTER TO SEND
// =================================

input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});

// =================================
// CLEAR CHAT
// =================================

function clearChat() {

    const confirmClear = confirm(
        "Are you sure you want to clear chat history? ❤️"
    );

    if (!confirmClear) return;

    history = [];

    localStorage.removeItem("rupsona_history");

    chat.innerHTML = `
        <div class="message bot-message">
            <div class="message-name">Rupsona ❤️</div>
            Hey Miraj! 🥰
            আবার শুরু থেকে কথা বলি!
        </div>
    `;

}

// =================================
// VOICE INPUT
// =================================

function voiceInput() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert("Voice input is not supported in this browser.");

        return;

    }

    const recognition = new SpeechRecognition();

    recognition.lang = "hi-IN";

    recognition.interimResults = false;

    recognition.onresult = function(event) {

        const transcript =
            event.results[0][0].transcript;

        input.value = transcript;

        sendMessage();

    };

    recognition.onerror = function() {

        alert("Voice recognition failed. Try again.");

    };

    recognition.start();

}

// =================================
// FEMALE VOICE REPLY
// =================================

function speakRupsona(text) {

    if (!("speechSynthesis" in window)) {

        alert("Voice not supported!");

        return;

    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "hi-IN";

    speech.rate = 0.9;

    speech.pitch = 1.3;

    const voices = speechSynthesis.getVoices();

    const femaleVoice = voices.find(v =>
        /female|zira|samantha|google.*hindi/i.test(v.name)
    );

    if (femaleVoice) {
        speech.voice = femaleVoice;
    }

    speechSynthesis.speak(speech);

}

// =================================
// RESTORE CHAT HISTORY
// =================================

function restoreHistory() {

    history.forEach(item => {

        if (item.role === "user") {

            addMessage(item.content, "user");

        }

        else if (item.role === "assistant") {

            addMessage(item.content, "bot");

        }

    });

}

// =================================
// START WEBSITE
// =================================

restoreHistory();

console.log("❤️ Rupsona AI Loaded Successfully!");