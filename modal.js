// Modal open/close
const modal = document.getElementById('agentModal');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const closeModal2Btn = document.getElementById('closeModal2');

// Open modal
openModalBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
});

// Close modal functions
function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto'; // Restore scrolling
  
  // Reset modal to default state
  document.getElementById('chatHistory').innerHTML = `
    <div class="text-center text-gray-400 text-xs mt-20">
      Start describing your agent and I'll help you build it! ✨
    </div>
  `;
  document.getElementById('chatInput').value = '';
  
  // Reset to chat mode
  const chatMode = document.getElementById('chatMode');
  const blockMode = document.getElementById('blockMode');
  const tabChat = document.getElementById('tabChat');
  const tabBlocks = document.getElementById('tabBlocks');
  
  chatMode.classList.remove('hidden');
  blockMode.classList.add('hidden');
  tabChat.classList.add('bg-blue-600', 'text-white');
  tabChat.classList.remove('text-gray-400');
  tabBlocks.classList.remove('bg-blue-600', 'text-white');
  tabBlocks.classList.add('text-gray-400');
}

closeModalBtn.addEventListener('click', closeModal);
closeModal2Btn.addEventListener('click', closeModal);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Tab switcher
const tabChat = document.getElementById('tabChat');
const tabBlocks = document.getElementById('tabBlocks');
const chatMode = document.getElementById('chatMode');
const blockMode = document.getElementById('blockMode');

tabChat.addEventListener('click', () => {
  chatMode.classList.remove('hidden');
  blockMode.classList.add('hidden');
  
  // Update tab styles
  tabChat.classList.add('bg-blue-600', 'text-white');
  tabChat.classList.remove('text-gray-400');
  tabBlocks.classList.remove('bg-blue-600', 'text-white');
  tabBlocks.classList.add('text-gray-400');
});

tabBlocks.addEventListener('click', () => {
  blockMode.classList.remove('hidden');
  chatMode.classList.add('hidden');
  
  // Update tab styles
  tabBlocks.classList.add('bg-blue-600', 'text-white');
  tabBlocks.classList.remove('text-gray-400');
  tabChat.classList.remove('bg-blue-600', 'text-white');
  tabChat.classList.add('text-gray-400');
});

// Create Agent button functionality
document.getElementById('createAgent').addEventListener('click', () => {
  const currentMode = !chatMode.classList.contains('hidden') ? 'chat' : 'blocks';
  
  if (currentMode === 'chat') {
    const chatHistory = document.getElementById('chatHistory');
    const messages = chatHistory.querySelectorAll('.bg-blue-600, .bg-gray-600');
    
    if (messages.length === 0) {
      alert('Please describe your agent first in the chat!');
      return;
    }
  }
  
  // Show success message
  const successMsg = document.createElement('div');
  successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
  successMsg.innerHTML = '✅ Agent created successfully!';
  document.body.appendChild(successMsg);
  
  // Animate in
  setTimeout(() => {
    successMsg.classList.remove('translate-x-full');
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    successMsg.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(successMsg);
    }, 300);
  }, 3000);
  
  // Close modal
  closeModal();
});