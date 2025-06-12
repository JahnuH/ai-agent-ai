// Block-based visual workflow builder
let draggedBlock = null;
let connections = [];
let blockCounter = 0;

// Block templates
const blockTemplates = {
  trigger: {
    type: 'trigger',
    color: 'from-blue-500 to-blue-600',
    icon: '🔔',
    title: 'Trigger',
    options: [
      'When Email Received',
      'On Schedule (Daily/Weekly)',
      'When Website Changes',
      'Price Alert Triggered',
      'Social Media Mention',
      'File Upload Detected',
      'API Webhook Received'
    ]
  },
  process: {
    type: 'process',
    color: 'from-green-500 to-green-600',
    icon: '🔍',
    title: 'Process',
    options: [
      'Extract Summary',
      'Analyze Sentiment',
      'Filter Content',
      'Transform Data',
      'Validate Information',
      'Compare Values',
      'Generate Report'
    ]
  },
  action: {
    type: 'action',
    color: 'from-purple-500 to-purple-600',
    icon: '📤',
    title: 'Action',
    options: [
      'Send via WhatsApp',
      'Send Email Notification',
      'Post to Slack',
      'Save to Database',
      'Update Spreadsheet',
      'Create Calendar Event',
      'Send Push Notification'
    ]
  },
  condition: {
    type: 'condition',
    color: 'from-yellow-500 to-yellow-600',
    icon: '❓',
    title: 'Condition',
    options: [
      'If Contains Keywords',
      'If Price Above/Below',
      'If Time Between',
      'If User Matches',
      'If Data Exists',
      'If Previous Step Success',
      'If Custom Rule'
    ]
  }
};

// Initialize block mode
function initializeBlockMode() {
  const blockMode = document.getElementById('blockMode');
  
  if (blockMode.querySelector('.blocks-initialized')) {
    return; // Already initialized
  }
  
  // Create block palette
  const palette = createBlockPalette();
  const workspace = createWorkspace();
  
  // Clear existing content and add new structure
  blockMode.innerHTML = `
    <div class="blocks-initialized">
      <div class="flex gap-4 h-96">
        <div class="w-1/3">
          ${palette}
        </div>
        <div class="flex-1">
          ${workspace}
        </div>
      </div>
      <div class="mt-4 text-amber-400 text-sm flex items-center space-x-2">
        <span>⚠️</span>
        <span>Visual workflow builder in development - Drag blocks to create workflows</span>
      </div>
    </div>
  `;
  
  // Initialize drag and drop
  initializeDragAndDrop();
}

function createBlockPalette() {
  return `
    <div class="glass-effect rounded-xl p-4 h-full overflow-y-auto">
      <h4 class="text-white font-semibold mb-4 flex items-center space-x-2">
        <span>🧩</span>
        <span>Block Palette</span>
      </h4>
      <div class="space-y-3">
        ${Object.entries(blockTemplates).map(([key, template]) => `
          <div class="space-y-2">
            <div class="text-xs text-gray-400 uppercase tracking-wide">${template.title}s</div>
            ${template.options.slice(0, 3).map((option, index) => `
              <div class="block-template bg-gradient-to-r ${template.color} p-3 rounded-lg shadow-lg cursor-grab hover:shadow-xl transition-all transform hover:-translate-y-1" 
                   draggable="true" 
                   data-type="${template.type}" 
                   data-option="${option}"
                   data-icon="${template.icon}"
                   data-color="${template.color}">
                <div class="text-white font-medium text-sm mb-1">${template.icon} ${template.title}</div>
                <div class="text-white/80 text-xs">${option}</div>
              </div>
            `).join('')}
            ${template.options.length > 3 ? `
              <button class="w-full text-xs text-gray-400 hover:text-white transition-colors py-1" onclick="showMoreBlocks('${key}')">
                + ${template.options.length - 3} more...
              </button>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function createWorkspace() {
  return `
    <div class="glass-effect rounded-xl p-4 h-full">
      <h4 class="text-white font-semibold mb-4 flex items-center justify-between">
        <span class="flex items-center space-x-2">
          <span>🎯</span>
          <span>Workflow Canvas</span>
        </span>
        <button onclick="clearWorkspace()" class="text-xs text-gray-400 hover:text-red-400 transition-colors">
          Clear All
        </button>
      </h4>
      <div id="workspace" class="bg-gray-800/30 rounded-lg h-full border-2 border-dashed border-gray-600 relative overflow-hidden min-h-64 workspace-area">
        <div class="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none workspace-placeholder">
          <div class="text-center">
            <div class="text-2xl mb-2">🎯</div>
            <div class="text-sm">Drag blocks here to build your workflow</div>
            <div class="text-xs mt-1 text-gray-600">Start with a Trigger block</div>
          </div>
        </div>
        <svg class="absolute inset-0 pointer-events-none" id="connectionSvg" style="z-index: 1;">
          <!-- Connection lines will be drawn here -->
        </svg>
      </div>
    </div>
  `;
}

function initializeDragAndDrop() {
  const workspace = document.getElementById('workspace');
  const templates = document.querySelectorAll('.block-template');
  
  // Template drag start
  templates.forEach(template => {
    template.addEventListener('dragstart', (e) => {
      draggedBlock = {
        type: e.target.dataset.type,
        option: e.target.dataset.option,
        icon: e.target.dataset.icon,
        color: e.target.dataset.color
      };
      e.target.style.opacity = '0.5';
    });
    
    template.addEventListener('dragend', (e) => {
      e.target.style.opacity = '1';
    });
  });
  
  // Workspace drop handling
  workspace.addEventListener('dragover', (e) => {
    e.preventDefault();
    workspace.classList.add('border-blue-500', 'bg-blue-500/10');
  });
  
  workspace.addEventListener('dragleave', () => {
    workspace.classList.remove('border-blue-500', 'bg-blue-500/10');
  });
  
  workspace.addEventListener('drop', (e) => {
    e.preventDefault();
    workspace.classList.remove('border-blue-500', 'bg-blue-500/10');
    
    if (draggedBlock) {
      const rect = workspace.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      createWorkspaceBlock(draggedBlock, x, y);
      hideWorkspacePlaceholder();
      draggedBlock = null;
    }
  });
}

function createWorkspaceBlock(blockData, x, y) {
  const workspace = document.getElementById('workspace');
  blockCounter++;
  
  const block = document.createElement('div');
  block.className = `absolute bg-gradient-to-r ${blockData.color} p-3 rounded-lg shadow-lg cursor-move workspace-block`;
  block.style.left = `${Math.max(0, Math.min(x - 60, workspace.clientWidth - 120))}px`;
  block.style.top = `${Math.max(0, Math.min(y - 30, workspace.clientHeight - 60))}px`;
  block.style.width = '120px';
  block.style.zIndex = '2';
  block.dataset.blockId = `block-${blockCounter}`;
  block.dataset.blockType = blockData.type;
  
  block.innerHTML = `
    <div class="text-white font-medium text-xs mb-1">${blockData.icon} ${blockData.type}</div>
    <div class="text-white/80 text-xs leading-tight">${blockData.option}</div>
    <button class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors" onclick="removeBlock(this)">×</button>
    <div class="absolute -bottom-1 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 connection-point" data-direction="output"></div>
    <div class="absolute -top-1 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 connection-point" data-direction="input"></div>
  `;
  
  workspace.appendChild(block);
  
  // Make block draggable within workspace
  makeBlockDraggable(block);
  
  // Add click handler for block configuration
  block.addEventListener('dblclick', () => {
    configureBlock(block);
  });
}

function makeBlockDraggable(block) {
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  
  block.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    
    isDragging = true;
    const rect = block.getBoundingClientRect();
    const workspaceRect = document.getElementById('workspace').getBoundingClientRect();
    
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    
    block.style.zIndex = '10';
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });
  
  function handleMouseMove(e) {
    if (!isDragging) return;
    
    const workspace = document.getElementById('workspace');
    const workspaceRect = workspace.getBoundingClientRect();
    
    const newX = e.clientX - workspaceRect.left - dragOffset.x;
    const newY = e.clientY - workspaceRect.top - dragOffset.y;
    
    block.style.left = `${Math.max(0, Math.min(newX, workspace.clientWidth - block.clientWidth))}px`;
    block.style.top = `${Math.max(0, Math.min(newY, workspace.clientHeight - block.clientHeight))}px`;
    
    updateConnections();
  }
  
  function handleMouseUp() {
    isDragging = false;
    block.style.zIndex = '2';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
}

function removeBlock(button) {
  const block = button.parentElement;
  const blockId = block.dataset.blockId;
  
  // Remove connections involving this block
  connections = connections.filter(conn => 
    conn.from !== blockId && conn.to !== blockId
  );
  
  block.remove();
  updateConnections();
  
  // Show placeholder if no blocks left
  const remainingBlocks = document.querySelectorAll('.workspace-block');
  if (remainingBlocks.length === 0) {
    showWorkspacePlaceholder();
  }
}

function configureBlock(block) {
  const blockType = block.dataset.blockType;
  const template = blockTemplates[blockType];
  
  if (!template) return;
  
  // Simple configuration modal
  const options = template.options.map(option => `<option value="${option}">${option}</option>`).join('');
  const currentOption = block.querySelector('.text-xs').textContent;
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="glass-effect p-6 rounded-xl w-96">
      <h3 class="text-white font-semibold mb-4">Configure ${template.title} Block</h3>
      <select class="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600">
        ${options}
      </select>
      <div class="flex justify-end space-x-3 mt-4">
        <button class="px-4 py-2 text-gray-400 hover:text-white" onclick="this.closest('.fixed').remove()">Cancel</button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onclick="updateBlockConfig(this, '${block.dataset.blockId}')">Update</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Set current value
  modal.querySelector('select').value = currentOption;
}

function updateBlockConfig(button, blockId) {
  const modal = button.closest('.fixed');
  const select = modal.querySelector('select');
  const newValue = select.value;
  
  const block = document.querySelector(`[data-block-id="${blockId}"]`);
  if (block) {
    block.querySelector('.text-xs').textContent = newValue;
  }
  
  modal.remove();
}

function clearWorkspace() {
  const workspace = document.getElementById('workspace');
  const blocks = workspace.querySelectorAll('.workspace-block');
  
  blocks.forEach(block => block.remove());
  connections = [];
  updateConnections();
  showWorkspacePlaceholder();
}

function hideWorkspacePlaceholder() {
  const placeholder = document.querySelector('.workspace-placeholder');
  if (placeholder) {
    placeholder.style.display = 'none';
  }
}

function showWorkspacePlaceholder() {
  const placeholder = document.querySelector('.workspace-placeholder');
  if (placeholder) {
    placeholder.style.display = 'flex';
  }
}

function updateConnections() {
  const svg = document.getElementById('connectionSvg');
  if (!svg) return;
  
  svg.innerHTML = ''; // Clear existing connections
  
  connections.forEach(connection => {
    const fromBlock = document.querySelector(`[data-block-id="${connection.from}"]`);
    const toBlock = document.querySelector(`[data-block-id="${connection.to}"]`);
    
    if (fromBlock && toBlock) {
      drawConnection(svg, fromBlock, toBlock);
    }
  });
}

function drawConnection(svg, fromBlock, toBlock) {
  const fromRect = fromBlock.getBoundingClientRect();
  const toRect = toBlock.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();
  
  const fromX = fromRect.left + fromRect.width / 2 - svgRect.left;
  const fromY = fromRect.bottom - svgRect.top;
  const toX = toRect.left + toRect.width / 2 - svgRect.left;
  const toY = toRect.top - svgRect.top;
  
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', fromX);
  line.setAttribute('y1', fromY);
  line.setAttribute('x2', toX);
  line.setAttribute('y2', toY);
  line.setAttribute('stroke', '#3B82F6');
  line.setAttribute('stroke-width', '2');
  line.setAttribute('stroke-dasharray', '5,5');
  
  svg.appendChild(line);
  
  // Add arrow head
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const arrowLength = 10;
  
  const arrowX = toX - arrowLength * Math.cos(angle);
  const arrowY = toY - arrowLength * Math.sin(angle);
  
  const arrowPoints = [
    [toX, toY],
    [arrowX - 5 * Math.cos(angle - Math.PI/6), arrowY - 5 * Math.sin(angle - Math.PI/6)],
    [arrowX - 5 * Math.cos(angle + Math.PI/6), arrowY - 5 * Math.sin(angle + Math.PI/6)]
  ];
  
  arrow.setAttribute('points', arrowPoints.map(p => p.join(',')).join(' '));
  arrow.setAttribute('fill', '#3B82F6');
  
  svg.appendChild(arrow);
}

function showMoreBlocks(templateKey) {
  const template = blockTemplates[templateKey];
  if (!template) return;
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="glass-effect p-6 rounded-xl w-96 max-h-96 overflow-y-auto">
      <h3 class="text-white font-semibold mb-4">${template.title} Blocks</h3>
      <div class="space-y-2">
        ${template.options.map(option => `
          <div class="block-template bg-gradient-to-r ${template.color} p-3 rounded-lg shadow-lg cursor-grab hover:shadow-xl transition-all" 
               draggable="true" 
               data-type="${template.type}" 
               data-option="${option}"
               data-icon="${template.icon}"
               data-color="${template.color}">
            <div class="text-white font-medium text-sm mb-1">${template.icon} ${template.title}</div>
            <div class="text-white/80 text-xs">${option}</div>
          </div>
        `).join('')}
      </div>
      <button class="mt-4 px-4 py-2 text-gray-400 hover:text-white" onclick="this.closest('.fixed').remove()">Close</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Re-initialize drag and drop for new blocks
  const newTemplates = modal.querySelectorAll('.block-template');
  newTemplates.forEach(template => {
    template.addEventListener('dragstart', (e) => {
      draggedBlock = {
        type: e.target.dataset.type,
        option: e.target.dataset.option,
        icon: e.target.dataset.icon,
        color: e.target.dataset.color
      };
      e.target.style.opacity = '0.5';
      modal.remove(); // Close modal when dragging starts
    });
  });
}

// Generate workflow summary
function generateWorkflowSummary() {
  const blocks = document.querySelectorAll('.workspace-block');
  if (blocks.length === 0) return "No workflow created yet.";
  
  const workflow = Array.from(blocks).map(block => {
    const type = block.dataset.blockType;
    const option = block.querySelector('.text-xs').textContent;
    return `${type.charAt(0).toUpperCase() + type.slice(1)}: ${option}`;
  });
  
  return workflow.join(' → ');
}

// Export workflow configuration
function exportWorkflow() {
  const blocks = Array.from(document.querySelectorAll('.workspace-block')).map(block => ({
    id: block.dataset.blockId,
    type: block.dataset.blockType,
    option: block.querySelector('.text-xs').textContent,
    position: {
      x: parseInt(block.style.left),
      y: parseInt(block.style.top)
    }
  }));
  
  return {
    blocks,
    connections,
    summary: generateWorkflowSummary()
  };
}

// Initialize when tab is switched to blocks
document.addEventListener('DOMContentLoaded', () => {
  const tabBlocks = document.getElementById('tabBlocks');
  if (tabBlocks) {
    tabBlocks.addEventListener('click', () => {
      setTimeout(initializeBlockMode, 100); // Delay to ensure DOM is ready
    });
  }
});

// Auto-connect blocks when they're close to each other
function autoConnectBlocks() {
  const blocks = document.querySelectorAll('.workspace-block');
  const threshold = 50; // pixels
  
  blocks.forEach(block1 => {
    blocks.forEach(block2 => {
      if (block1 === block2) return;
      
      const rect1 = block1.getBoundingClientRect();
      const rect2 = block2.getBoundingClientRect();
      
      const distance = Math.sqrt(
        Math.pow(rect1.left - rect2.left, 2) + 
        Math.pow(rect1.top - rect2.top, 2)
      );
      
      if (distance < threshold) {
        const id1 = block1.dataset.blockId;
        const id2 = block2.dataset.blockId;
        
        // Check if connection already exists
        const exists = connections.some(conn => 
          (conn.from === id1 && conn.to === id2) || 
          (conn.from === id2 && conn.to === id1)
        );
        
        if (!exists && rect1.bottom < rect2.top) {
          connections.push({ from: id1, to: id2 });
          updateConnections();
        }
      }
    });
  });
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const blockMode = document.getElementById('blockMode');
  if (blockMode && !blockMode.classList.contains('hidden')) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Delete selected blocks (if any selection system is implemented)
      e.preventDefault();
    } else if (e.ctrlKey && e.key === 'z') {
      // Undo (if undo system is implemented)
      e.preventDefault();
    } else if (e.ctrlKey && e.key === 's') {
      // Save workflow
      e.preventDefault();
      const workflow = exportWorkflow();
      console.log('Workflow saved:', workflow);
    }
  }
});