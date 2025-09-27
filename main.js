// NAMASTE-FHIR Main JavaScript File
// Handles all interactive functionality and animations

// Global variables
let networkChart = null;
let mappingData = [];
let currentMapping = null;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    initializeAnimations();
    initializeNetworkVisualization();
    initializeSearchFunctionality();
    initializeScrollEffects();
    loadMappingData();
    initializeP5Background();
}

// Initialize animations
function initializeAnimations() {
    // Typed.js for hero text
    if (document.getElementById('typed-hero')) {
        new Typed('#typed-hero', {
            strings: [
                'NAMASTE-FHIR',
        'Bridging Traditional & Modern Medicine',
                'FHIR R4 Compliant Mapping'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    // Animate statistics counters
    animateCounters();

    // Initialize fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Animate statistics counters
function animateCounters() {
    const counters = [
        { id: 'total-mappings', target: 34826 },
        { id: 'validated-mappings', target: 24629 },
        { id: 'pending-mappings', target: 10197 },
        { id: 'validation-rate', target: 70.7, suffix: '%' }
    ];

    counters.forEach(counter => {
        const element = document.getElementById(counter.id);
        if (element) {
            anime({
                targets: { count: 0 },
                count: counter.target,
                duration: 2000,
                easing: 'easeOutExpo',
                update: function(anim) {
                    const value = Math.floor(anim.animatables[0].target.count);
                    element.textContent = value.toLocaleString() + (counter.suffix || '');
                }
            });
        }
    });
}

// Initialize network visualization
function initializeNetworkVisualization() {
    const chartElement = document.getElementById('network-chart');
    if (!chartElement) return;

    networkChart = echarts.init(chartElement);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                if (params.dataType === 'node') {
                    return `<strong>${params.data.name}</strong><br/>
                            Type: ${params.data.category}<br/>
                            Status: ${params.data.status || 'Unknown'}`;
                } else {
                    return `Mapping: ${params.data.source} → ${params.data.target}`;
                }
            }
        },
        legend: {
            data: ['NAMASTE', 'ICD-11-TM2', 'Validated', 'Pending'],
            bottom: 10,
            textStyle: {
                color: '#666'
            }
        },
        series: [{
            type: 'graph',
            layout: 'force',
            animation: true,
            roam: true,
            focusNodeAdjacency: true,
            force: {
                repulsion: 1000,
                gravity: 0.1,
                edgeLength: 200,
                layoutAnimation: true
            },
            data: generateNetworkNodes(),
            links: generateNetworkLinks(),
            categories: [
                { name: 'NAMASTE', itemStyle: { color: '#2C5F5D' } },
                { name: 'ICD-11-TM2', itemStyle: { color: '#E67E22' } },
                { name: 'Validated', itemStyle: { color: '#27ae60' } },
                { name: 'Pending', itemStyle: { color: '#f1c40f' } }
            ],
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 2,
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            lineStyle: {
                color: 'source',
                curveness: 0.3,
                opacity: 0.7
            },
            emphasis: {
                focus: 'adjacency',
                lineStyle: {
                    width: 10
                }
            }
        }]
    };

    networkChart.setOption(option);

    // Handle node clicks
    networkChart.on('click', function(params) {
        if (params.dataType === 'node') {
            showMappingDetails(params.data);
        }
    });

    // Make chart responsive
    window.addEventListener('resize', function() {
        networkChart.resize();
    });
}

// Generate network nodes
function generateNetworkNodes() {
    const nodes = [
        // NAMASTE nodes
        { id: 'AAE-16', name: 'Sandhigatavata', category: 0, status: 'validated', symbolSize: 50 },
        { id: 'A.A.', name: 'Vatavyadhi', category: 0, status: 'validated', symbolSize: 45 },
        { id: 'A.K.', name: 'Kasa', category: 0, status: 'pending', symbolSize: 40 },
        { id: 'A.AM', name: 'Arsha', category: 0, status: 'validated', symbolSize: 42 },
        { id: 'A.MK', name: 'Madhumcha', category: 0, status: 'validated', symbolSize: 48 },
        
        // ICD-11-TM2 nodes
        { id: 'TM2-1234', name: 'Osteoarthritis', category: 1, status: 'validated', symbolSize: 50 },
        { id: 'TM2-5678', name: 'Vata disorders', category: 1, status: 'validated', symbolSize: 45 },
        { id: 'TM2-9012', name: 'Acute cough', category: 1, status: 'pending', symbolSize: 40 },
        { id: 'TM2-3456', name: 'Hemorrhoids', category: 1, status: 'validated', symbolSize: 42 },
        { id: 'TM2-7890', name: 'Diabetes mellitus', category: 1, status: 'validated', symbolSize: 48 }
    ];
    
    return nodes;
}

// Generate network links
function generateNetworkLinks() {
    const links = [
        { source: 'AAE-16', target: 'TM2-1234', value: 0.95 },
        { source: 'A.A.', target: 'TM2-5678', value: 0.89 },
        { source: 'A.K.', target: 'TM2-9012', value: 0.78 },
        { source: 'A.AM', target: 'TM2-3456', value: 0.92 },
        { source: 'A.MK', target: 'TM2-7890', value: 0.96 }
    ];
    
    return links;
}

// Initialize search functionality
function initializeSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        if (query.length > 2) {
            performSearch(query);
        } else {
            hideSearchResults();
        }
    });
}

// Perform search
function performSearch(query = null) {
    const searchTerm = query || document.getElementById('search-input').value.toLowerCase();
    if (!searchTerm) return;

    // Sample search results
    const sampleResults = [
        { 
            code: 'AAE-16', 
            term: 'Sandhigatavata (osteoarthritis)',
            icd11: 'TM2-1234',
            status: 'validated',
            confidence: 0.95
        },
        { 
            code: 'A.A.', 
            term: 'Vatavyadhi (disorders due to Vata)',
            icd11: 'TM2-5678',
            status: 'validated',
            confidence: 0.89
        },
        { 
            code: 'A.K.', 
            term: 'Kasa (cough/tussis)',
            icd11: 'TM2-9012',
            status: 'pending',
            confidence: 0.78
        }
    ];

    const filteredResults = sampleResults.filter(result => 
        result.term.toLowerCase().includes(searchTerm) ||
        result.code.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(filteredResults);
}

// Display search results
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    const resultsList = document.getElementById('results-list');
    
    if (!resultsContainer || !resultsList) return;

    if (results.length === 0) {
        resultsList.innerHTML = '<p class="text-gray-500 text-sm">No results found</p>';
    } else {
        resultsList.innerHTML = results.map(result => `
            <div class="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" 
                 onclick="selectSearchResult('${result.code}')">
                <div class="font-medium text-sm">${result.code} - ${result.term}</div>
                <div class="text-xs text-gray-600 mt-1">
                    ICD-11: ${result.icd11} • 
                    <span class="validation-badge ${result.status}">${result.status}</span>
                </div>
            </div>
        `).join('');
    }

    resultsContainer.classList.remove('hidden');
    
    // Animate results appearance
    anime({
        targets: resultsContainer,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 300,
        easing: 'easeOutQuad'
    });
}

// Hide search results
function hideSearchResults() {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
        resultsContainer.classList.add('hidden');
    }
}

// Select search result
function selectSearchResult(code) {
    // Find the node in the network visualization
    if (networkChart) {
        const option = networkChart.getOption();
        const nodes = option.series[0].data;
        const selectedNode = nodes.find(node => node.id === code);
        
        if (selectedNode) {
            showMappingDetails(selectedNode);
            
            // Highlight the node in the network
            networkChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                name: code
            });
        }
    }
    
    hideSearchResults();
}

// Show mapping details
function showMappingDetails(nodeData) {
    const detailsContainer = document.getElementById('mapping-details');
    if (!detailsContainer) return;

    // Find mapping details
    const mappingDetails = {
        'AAE-16': {
            namaste: { code: 'AAE-16', term: 'Sandhigatavata (osteoarthritis)' },
            icd11: { code: 'TM2-1234', term: 'Osteoarthritis' },
            status: 'validated',
            confidence: 0.95,
            lastUpdated: '2024-01-15',
            justification: 'Direct correlation based on clinical symptoms and pathophysiology'
        },
        'A.A.': {
            namaste: { code: 'A.A.', term: 'Vatavyadhi (disorders due to Vata)' },
            icd11: { code: 'TM2-5678', term: 'Vata disorders' },
            status: 'validated',
            confidence: 0.89,
            lastUpdated: '2024-01-10',
            justification: 'Comprehensive mapping covering multiple Vata-related conditions'
        }
    };

    const details = mappingDetails[nodeData.id] || {
        namaste: { code: nodeData.id, term: nodeData.name },
        icd11: { code: 'TM2-XXXX', term: 'Pending mapping' },
        status: 'pending',
        confidence: 0.0,
        lastUpdated: 'N/A',
        justification: 'Mapping under review'
    };

    detailsContainer.innerHTML = `
        <div class="space-y-4">
            <div class="p-4 bg-gray-50 rounded-lg">
                <h4 class="font-semibold text-sm text-gray-700 mb-2">NAMASTE Term</h4>
                <div class="font-mono text-sm text-primary">${details.namaste.code}</div>
                <div class="text-sm text-gray-800">${details.namaste.term}</div>
            </div>
            
            <div class="p-4 bg-gray-50 rounded-lg">
                <h4 class="font-semibold text-sm text-gray-700 mb-2">ICD-11-TM2 Term</h4>
                <div class="font-mono text-sm text-secondary">${details.icd11.code}</div>
                <div class="text-sm text-gray-800">${details.icd11.term}</div>
            </div>
            
            <div class="p-4 bg-gray-50 rounded-lg">
                <h4 class="font-semibold text-sm text-gray-700 mb-2">Validation Status</h4>
                <div class="flex items-center justify-between">
                    <span class="validation-badge ${details.status}">${details.status}</span>
                    <span class="text-sm text-gray-600">${(details.confidence * 100).toFixed(0)}% confidence</span>
                </div>
            </div>
            
            <div class="p-4 bg-gray-50 rounded-lg">
                <h4 class="font-semibold text-sm text-gray-700 mb-2">Justification</h4>
                <p class="text-sm text-gray-800">${details.justification}</p>
                <div class="text-xs text-gray-500 mt-2">Last updated: ${details.lastUpdated}</div>
            </div>
            
            <div class="flex space-x-2">
                <button class="btn-primary flex-1 text-sm py-2" onclick="validateMapping('${nodeData.id}')">
                    Validate
                </button>
                <button class="bg-gray-200 text-gray-700 flex-1 text-sm py-2 rounded-lg hover:bg-gray-300 transition-colors" onclick="exportMapping('${nodeData.id}')">
                    Export
                </button>
            </div>
        </div>
    `;

    // Animate details appearance
    anime({
        targets: detailsContainer,
        opacity: [0, 1],
        translateX: [20, 0],
        duration: 400,
        easing: 'easeOutQuad'
    });
}

// Validate mapping
function validateMapping(mappingId) {
    // Show success message
    showNotification('Mapping validation initiated for ' + mappingId, 'success');
    
    // In a real application, this would send a request to the validation API
    console.log('Validating mapping:', mappingId);
}

// Export mapping
function exportMapping(mappingId) {
    // Show success message
    showNotification('Export prepared for mapping ' + mappingId, 'info');
    
    // In a real application, this would trigger a download
    console.log('Exporting mapping:', mappingId);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    anime({
        targets: notification,
        opacity: [0, 1],
        translateX: [100, 0],
        duration: 300,
        easing: 'easeOutQuad'
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        anime({
            targets: notification,
            opacity: [1, 0],
            translateX: [0, 100],
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 3000);
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Smooth scroll to mapping interface
    window.scrollToMapping = function() {
        const element = document.getElementById('mapping-interface');
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
}

// Load mapping data
function loadMappingData() {
    // In a real application, this would load data from the server
    // For now, we'll use sample data
    mappingData = [
        {
            namaste_code: 'AAE-16',
            namaste_term: 'Sandhigatavata (osteoarthritis)',
            icd11_code: 'TM2-1234',
            icd11_term: 'Osteoarthritis',
            status: 'validated',
            confidence: 0.95
        },
        {
            namaste_code: 'A.A.',
            namaste_term: 'Vatavyadhi (disorders due to Vata)',
            icd11_code: 'TM2-5678',
            icd11_term: 'Vata disorders',
            status: 'validated',
            confidence: 0.89
        },
        {
            namaste_code: 'A.K.',
            namaste_term: 'Kasa (cough/tussis)',
            icd11_code: 'TM2-9012',
            icd11_term: 'Acute cough',
            status: 'pending',
            confidence: 0.78
        }
    ];
}

// Initialize P5.js background
function initializeP5Background() {
    new p5(function(p) {
        let particles = [];
        
        p.setup = function() {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('p5-background');
            
            // Create particles
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    size: p.random(2, 6)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = p.width;
                if (particle.x > p.width) particle.x = 0;
                if (particle.y < 0) particle.y = p.height;
                if (particle.y > p.height) particle.y = 0;
                
                // Draw particle
                p.fill(44, 95, 93, 50);
                p.noStroke();
                p.ellipse(particle.x, particle.y, particle.size);
            });
            
            // Draw connections
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(other => {
                    const distance = p.dist(particle.x, particle.y, other.x, other.y);
                    if (distance < 100) {
                        p.stroke(44, 95, 93, 30);
                        p.strokeWeight(1);
                        p.line(particle.x, particle.y, other.x, other.y);
                    }
                });
            });
        };
        
        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    });
}

// Utility functions
function formatNumber(num) {
    return num.toLocaleString();
}

function getStatusColor(status) {
    const colors = {
        'validated': '#27ae60',
        'pending': '#f1c40f',
        'conflict': '#e74c3c'
    };
    return colors[status] || '#7f8c8d';
}

// Export functions for global access
window.performSearch = performSearch;
window.selectSearchResult = selectSearchResult;
window.validateMapping = validateMapping;
window.exportMapping = exportMapping;
window.scrollToMapping = window.scrollToMapping;