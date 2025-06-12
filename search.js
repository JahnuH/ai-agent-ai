// Enhanced search and filter functionality
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

function initializeSearch() {
    if (!searchInput || !statusFilter) {
        console.warn('Search elements not found');
        return;
    }

    // Add event listeners
    searchInput.addEventListener('input', debounce(filterAgents, 300));
    statusFilter.addEventListener('change', filterAgents);
    
    // Add search shortcuts and enhancements
    addSearchEnhancements();
}

function filterAgents() {
    const query = searchInput.value.toLowerCase().trim();
    const status = statusFilter.value;
    
    // Get all agent cards using the correct selector
    const agentCards = document.querySelectorAll('.agent-grid > div');
    let visibleCount = 0;
    
    agentCards.forEach(card => {
        const nameElement = card.querySelector('h3');
        const statusElement = card.querySelector('span[class*="bg-"]'); // Status badge
        const descriptionElement = card.querySelector('p');
        
        if (!nameElement || !statusElement) return;
        
        const name = nameElement.textContent.toLowerCase();
        const description = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
        const currentStatus = statusElement.textContent.trim();
        
        // Check if matches search query (name or description)
        const matchesQuery = !query || name.includes(query) || description.includes(query);
        
        // Check if matches status filter
        const matchesStatus = !status || currentStatus === status;
        
        // Show/hide card with animation
        if (matchesQuery && matchesStatus) {
            showCard(card);
            visibleCount++;
        } else {
            hideCard(card);
        }
    });
    
    // Update results count
    updateResultsCount(visibleCount, agentCards.length);
    
    // Show no results message if needed
    toggleNoResultsMessage(visibleCount === 0 && (query || status));
}

function showCard(card) {
    if (card.style.display === 'none') {
        card.style.display = '';
        card.style.animation = 'fadeIn 0.3s ease-out';
    }
}

function hideCard(card) {
    if (card.style.display !== 'none') {
        card.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }
}

function updateResultsCount(visible, total) {
    // Remove existing results count
    const existingCount = document.querySelector('.search-results-count');
    if (existingCount) {
        existingCount.remove();
    }
    
    // Add new results count if filtering is active
    if (searchInput.value.trim() || statusFilter.value) {
        const header = document.querySelector('main .p-6.border-b');
        const resultsCount = document.createElement('div');
        resultsCount.className = 'search-results-count text-sm text-gray-400 mt-2';
        resultsCount.textContent = `Showing ${visible} of ${total} agents`;
        header.appendChild(resultsCount);
    }
}

function toggleNoResultsMessage(show) {
    const existingMessage = document.querySelector('.no-results-message');
    
    if (show && !existingMessage) {
        const agentGrid = document.querySelector('.agent-grid');
        const message = document.createElement('div');
        message.className = 'no-results-message col-span-full text-center py-12';
        message.innerHTML = `
            <div class="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-semibold text-white mb-2">No agents found</h3>
            <p class="text-gray-400">Try adjusting your search or filter criteria</p>
            <button class="mt-4 text-blue-400 hover:text-blue-300 underline" onclick="clearFilters()">
                Clear all filters
            </button>
        `;
        agentGrid.appendChild(message);
    } else if (!show && existingMessage) {
        existingMessage.remove();
    }
}

function clearFilters() {
    searchInput.value = '';
    statusFilter.value = '';
    filterAgents();
    searchInput.focus();
}

function addSearchEnhancements() {
    // Add search icon functionality
    const searchIcon = searchInput.previousElementSibling;
    if (searchIcon) {
        searchIcon.style.cursor = 'pointer';
        searchIcon.addEventListener('click', () => {
            searchInput.focus();
        });
    }
    
    // Add clear button to search input
    searchInput.addEventListener('input', function() {
        const clearBtn = document.querySelector('.search-clear-btn');
        
        if (this.value.trim() && !clearBtn) {
            const button = document.createElement('button');
            button.className = 'search-clear-btn absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition';
            button.innerHTML = '✕';
            button.addEventListener('click', () => {
                searchInput.value = '';
                filterAgents();
                searchInput.focus();
                button.remove();
            });
            searchInput.parentElement.appendChild(button);
        } else if (!this.value.trim() && clearBtn) {
            clearBtn.remove();
        }
    });
    
    // Add keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.blur();
            clearFilters();
        }
    });
    
    // Add search suggestions/history (placeholder)
    searchInput.addEventListener('focus', showSearchSuggestions);
    searchInput.addEventListener('blur', hideSearchSuggestions);
}

function showSearchSuggestions() {
    // Remove existing suggestions
    const existingSuggestions = document.querySelector('.search-suggestions');
    if (existingSuggestions) return;
    
    const suggestions = ['email', 'weather', 'stock', 'news', 'shopping', 'smart home'];
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'search-suggestions absolute top-full left-0 right-0 mt-1 glass-effect border border-gray-600 rounded-lg shadow-lg z-10';
    
    const suggestionsHTML = suggestions.map(suggestion => 
        `<button class="suggestion-item w-full text-left px-4 py-2 hover:bg-gray-700/50 transition text-gray-300 hover:text-white" data-suggestion="${suggestion}">
            🔍 ${suggestion}
        </button>`
    ).join('');
    
    suggestionsDiv.innerHTML = `
        <div class="p-2 text-xs text-gray-400 border-b border-gray-600">Quick searches:</div>
        ${suggestionsHTML}
    `;
    
    // Add suggestion click handlers
    suggestionsDiv.addEventListener('click', (e) => {
        const suggestionItem = e.target.closest('.suggestion-item');
        if (suggestionItem) {
            const suggestion = suggestionItem.dataset.suggestion;
            searchInput.value = suggestion;
            filterAgents();
            hideSearchSuggestions();
        }
    });
    
    searchInput.parentElement.appendChild(suggestionsDiv);
}

function hideSearchSuggestions() {
    setTimeout(() => {
        const suggestions = document.querySelector('.search-suggestions');
        if (suggestions) {
            suggestions.remove();
        }
    }, 200);
}

// Debounce function to limit search frequency
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add advanced search modal (placeholder)
function showAdvancedSearch() {
    alert('Advanced search coming soon!\nFeatures will include:\n- Date range filters\n- Performance metrics\n- Tag-based filtering\n- Saved searches');
}

// Export functions for global access
window.clearFilters = clearFilters;
window.showAdvancedSearch = showAdvancedSearch;

// Add CSS for animations
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    .search-suggestions {
        animation: fadeIn 0.2s ease-out;
    }
    
    .suggestion-item:first-of-type {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
    }
    
    .suggestion-item:last-of-type {
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
    }
`;
document.head.appendChild(searchStyles);