// Main application initialization and core functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Agent Studio loaded');
    
    // Initialize agent data
    window.agentData = [
        {
            id: 'email-summarizer',
            name: 'Email Summarizer',
            description: 'Summarizes your unread emails every morning and sends you a digest.',
            status: 'Active',
            icon: '📧',
            gradient: 'from-blue-500 to-cyan-500',
            lastRun: '2 hours ago',
            runsToday: 12,
            element: null
        },
        {
            id: 'news-aggregator',
            name: 'News Aggregator',
            description: 'Fetches top headlines from multiple sources and curates them for you.',
            status: 'Idle',
            icon: '📰',
            gradient: 'from-purple-500 to-pink-500',
            lastRun: '30 minutes ago',
            runsToday: 8,
            element: null
        },
        {
            id: 'weather-alert',
            name: 'Weather Alert Bot',
            description: 'Sends you weather alerts and forecasts for your city and travel destinations.',
            status: 'Inactive',
            icon: '🌤️',
            gradient: 'from-orange-500 to-red-500',
            lastRun: '1 day ago',
            runsToday: 0,
            element: null
        },
        {
            id: 'stock-monitor',
            name: 'Stock Monitor',
            description: 'Tracks your portfolio and sends alerts on significant price movements.',
            status: 'Active',
            icon: '💰',
            gradient: 'from-green-500 to-teal-500',
            lastRun: '5 minutes ago',
            runsToday: 24,
            element: null
        },
        {
            id: 'smart-home',
            name: 'Smart Home Manager',
            description: 'Automates your smart home devices based on your daily routines.',
            status: 'Active',
            icon: '🏠',
            gradient: 'from-indigo-500 to-purple-500',
            lastRun: '1 minute ago',
            runsToday: 45,
            element: null
        },
        {
            id: 'shopping-assistant',
            name: 'Shopping Assistant',
            description: 'Finds deals, compares prices, and manages your shopping lists automatically.',
            status: 'Active',
            icon: '🛒',
            gradient: 'from-pink-500 to-rose-500',
            lastRun: '15 minutes ago',
            runsToday: 6,
            element: null
        }
    ];

    // Update header stats
    updateHeaderStats();
    
    // Add click handlers to agent cards
    addAgentCardHandlers();
    
    // Initialize periodic updates
    startPeriodicUpdates();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
});

function updateHeaderStats() {
    const activeCount = window.agentData.filter(agent => agent.status === 'Active').length;
    const idleCount = window.agentData.filter(agent => agent.status === 'Idle').length;
    const inactiveCount = window.agentData.filter(agent => agent.status === 'Inactive').length;
    
    // Update the header stats if elements exist
    const headerStats = document.querySelectorAll('header .flex.items-center.space-x-2 span');
    if (headerStats.length >= 3) {
        headerStats[0].textContent = `${activeCount} Active`;
        headerStats[1].textContent = `${idleCount} Idle`;
        headerStats[2].textContent = `${inactiveCount} Inactive`;
    }
}

function addAgentCardHandlers() {
    const agentCards = document.querySelectorAll('.agent-grid > div');
    
    agentCards.forEach((card, index) => {
        if (window.agentData[index]) {
            window.agentData[index].element = card;
            
            // Add click handler
            card.addEventListener('click', function() {
                showAgentDetails(window.agentData[index]);
            });
            
            // Add context menu
            card.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                showAgentContextMenu(e, window.agentData[index]);
            });
        }
    });
}

function showAgentDetails(agent) {
    // Create and show agent details modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="glass-effect w-full max-w-2xl mx-4 p-6 rounded-2xl shadow-2xl border border-white/10">
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 rounded-lg bg-gradient-to-r ${agent.gradient} flex items-center justify-center text-white font-bold text-2xl">
                        ${agent.icon}
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-white">${agent.name}</h3>
                        <span class="text-xs bg-${getStatusColor(agent.status)}-500/20 text-${getStatusColor(agent.status)}-300 px-3 py-1 rounded-full border border-${getStatusColor(agent.status)}-500/30">
                            ${agent.status}
                        </span>
                    </div>
                </div>
                <button class="close-modal text-gray-400 hover:text-white text-3xl transition">&times;</button>
            </div>
            
            <div class="space-y-6">
                <div>
                    <h4 class="text-lg font-semibold text-white mb-2">Description</h4>
                    <p class="text-gray-300">${agent.description}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="glass-effect p-4 rounded-lg">
                        <div class="text-sm text-gray-400">Last Run</div>
                        <div class="text-white font-semibold">${agent.lastRun}</div>
                    </div>
                    <div class="glass-effect p-4 rounded-lg">
                        <div class="text-sm text-gray-400">Runs Today</div>
                        <div class="text-white font-semibold">${agent.runsToday}</div>
                    </div>
                </div>
                
                <div class="flex space-x-3">
                    <button class="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition">
                        Configure
                    </button>
                    <button class="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition">
                        Run Now
                    </button>
                    <button class="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition">
                        ${agent.status === 'Active' ? 'Pause' : 'Start'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add close handler
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function showAgentContextMenu(e, agent) {
    // Remove existing context menu
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    const menu = document.createElement('div');
    menu.className = 'context-menu fixed z-50 glass-effect border border-gray-600 rounded-lg shadow-lg py-2 min-w-[150px]';
    menu.style.left = e.pageX + 'px';
    menu.style.top = e.pageY + 'px';
    
    const menuItems = [
        { text: 'View Details', action: () => showAgentDetails(agent) },
        { text: 'Configure', action: () => alert('Configure functionality coming soon!') },
        { text: 'Duplicate', action: () => duplicateAgent(agent) },
        { text: 'Export', action: () => exportAgent(agent) },
        { text: '---', action: null },
        { text: 'Delete', action: () => deleteAgent(agent), danger: true }
    ];
    
    menuItems.forEach(item => {
        if (item.text === '---') {
            const divider = document.createElement('div');
            divider.className = 'border-t border-gray-600 my-2';
            menu.appendChild(divider);
        } else {
            const menuItem = document.createElement('button');
            menuItem.className = `w-full text-left px-4 py-2 hover:bg-gray-700/50 transition ${item.danger ? 'text-red-400 hover:text-red-300' : 'text-white'}`;
            menuItem.textContent = item.text;
            menuItem.addEventListener('click', () => {
                if (item.action) item.action();
                menu.remove();
            });
            menu.appendChild(menuItem);
        }
    });
    
    document.body.appendChild(menu);
    
    // Remove menu when clicking elsewhere
    setTimeout(() => {
        document.addEventListener('click', function handler() {
            menu.remove();
            document.removeEventListener('click', handler);
        });
    }, 100);
}

function getStatusColor(status) {
    switch (status) {
        case 'Active': return 'green';
        case 'Idle': return 'yellow';
        case 'Inactive': return 'red';
        default: return 'gray';
    }
}

function duplicateAgent(agent) {
    const newAgent = { ...agent, id: agent.id + '-copy', name: agent.name + ' (Copy)' };
    window.agentData.push(newAgent);
    // In a real app, you'd recreate the grid here
    alert(`${agent.name} duplicated successfully!`);
}

function exportAgent(agent) {
    const dataStr = JSON.stringify(agent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${agent.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function deleteAgent(agent) {
    if (confirm(`Are you sure you want to delete "${agent.name}"?`)) {
        const index = window.agentData.findIndex(a => a.id === agent.id);
        if (index > -1) {
            window.agentData.splice(index, 1);
            if (agent.element) {
                agent.element.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    agent.element.remove();
                    updateHeaderStats();
                }, 300);
            }
        }
    }
}

function startPeriodicUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        window.agentData.forEach(agent => {
            if (agent.status === 'Active' && Math.random() < 0.1) {
                agent.runsToday++;
                // Update UI if needed
                updateAgentCard(agent);
            }
        });
    }, 30000); // Update every 30 seconds
}

function updateAgentCard(agent) {
    if (agent.element) {
        const runsElement = agent.element.querySelector('.text-xs.text-gray-500 span:last-child');
        if (runsElement) {
            runsElement.textContent = `⚡ ${agent.runsToday} runs today`;
        }
    }
}

function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput')?.focus();
        }
        
        // Ctrl/Cmd + N to create new agent
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            document.getElementById('openModal')?.click();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const modal = document.getElementById('agentModal');
            if (modal && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        }
    });
}

// Add CSS animation for fadeOut
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
    }
`;
document.head.appendChild(style);