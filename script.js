// TODO: change this to your real backend URL
// const API_URL = "http://localhost:8000/chat"; // or your tunnel / LAN URL

let API_URL = localStorage.getItem('apiUrl') || 'http://0.0.0.0:8000/chat';

function saveApiUrl() {
  const IP_Address = document.getElementById('api-url').value;
  API_URL = `http://${IP_Address}:8000/chat`
  localStorage.setItem('apiUrl', API_URL);
}

const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const chatWindow = document.getElementById("chat-window");

function appendMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  input.value = "";
  input.focus();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "accept": "application/json" },
      body: JSON.stringify({ message: text })
    });

    if (!res.ok) {
      appendMessage(`Error: ${res.status}`, "bot");
      return;
    }

    const data = await res.json();
    const reply = data.reply || "(no reply field)";
    appendMessage(reply, "bot");
  } catch (err) {
    appendMessage("Network error talking to backend.", "bot");
  }
});
