// --- DOM Elements ---
const chatWindow = document.getElementById("chat-window");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// --- Send message when button clicked ---
sendBtn.addEventListener("click", sendMessage);

// --- Send on Enter key ---
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

// --- Main send function ---
async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    
    // Display user's message in chat
    appendMessage("user", text);
    input.value = "";

    // Optional: show a "typing..." indicator
    const typingBubble = appendMessage("bot", "Typing...");
    
    try {
        // --- Call your backend API ---
        const response = await fetch("https://metalchat-ai.ddns.net/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ question: text })
        });

        const data = await response.json();
        
        // Replace typing indicator with actual answer
        typingBubble.innerText = data.answer;

    } catch (err) {
        typingBubble.innerText = "⚠️ Error connecting to server";
        console.error(err);
    }

    scrollToBottom();
}

// --- Append message to chat ---
function appendMessage(role, text) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", role);

    const bubble = document.createElement("span");
    bubble.innerText = text;

    msgDiv.appendChild(bubble);
    chatWindow.appendChild(msgDiv);

    scrollToBottom();
    return bubble;    // return element so we can modify it (e.g. typing → answer)
}

// --- Make chat auto-scroll ---
function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
