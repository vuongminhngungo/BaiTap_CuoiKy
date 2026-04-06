const API_URL = `${window.location.origin}/api/chat`;
const openChatBtn = document.getElementById('openChat');
const chatBox = document.getElementById('chatBox');
const closeChatBtn = document.getElementById('closeChat');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

function createMessageBubble(text, type) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = text;
  return bubble;
}

function addMessage(text, type) {
  const bubble = createMessageBubble(text, type);
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setLoadingState(isLoading) {
  const existing = document.querySelector('.chat-bubble.loading');
  if (isLoading) {
    if (!existing) {
      const loadingBubble = createMessageBubble('Trợ lý đang trả lời...', 'bot loading');
      chatMessages.appendChild(loadingBubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  } else {
    existing?.remove();
  }
}

async function sendChatMessage(message) {
  console.log('[CHAT] Sending message to backend:', message);
  setLoadingState(true);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error
        ? `${errorData.error}${errorData.details ? ' - ' + errorData.details : ''}`
        : `Lỗi từ máy chủ (${response.status})`;
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('[CHAT] Received backend response:', result);
    addMessage(result.reply, 'bot');
  } catch (error) {
    const displayMessage = error.message || 'Xin lỗi, có lỗi xảy ra khi kết nối với trợ lý. Vui lòng thử lại.';
    addMessage(displayMessage, 'bot');
    console.error('[CHAT] Chat send error:', error);
  } finally {
    setLoadingState(false);
  }
}

openChatBtn.addEventListener('click', () => {
  document.querySelector('.chat-widget').classList.toggle('open');
  chatBox.classList.add('open');
  chatInput.focus();
});

closeChatBtn.addEventListener('click', () => {
  document.querySelector('.chat-widget').classList.remove('open');
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  chatInput.value = '';
  sendChatMessage(message);
});

chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    chatForm.dispatchEvent(new Event('submit', { cancelable: true }));
  }
});

// Open chat with a welcome message on first use
window.addEventListener('load', () => {
  addMessage('Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?', 'bot');
});
