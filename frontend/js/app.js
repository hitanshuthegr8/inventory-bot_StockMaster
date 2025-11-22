// ============================================
// Inventory Bot Frontend - Main JavaScript
// ============================================

// Configuration
const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
    query: `${API_BASE_URL}/api/query`,
    health: `${API_BASE_URL}/health`
};

// State
let isSubmitting = false;

// DOM Elements
const queryForm = document.getElementById('queryForm');
const questionInput = document.getElementById('question');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsSection = document.getElementById('results');
const errorSection = document.getElementById('error');
const connectionStatus = document.getElementById('connectionStatus');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkConnection();
    // Check connection every 30 seconds
    setInterval(checkConnection, 30000);
});

// Event Listeners
function setupEventListeners() {
    // Form submission
    queryForm.addEventListener('submit', handleSubmit);

    // Clear button
    clearBtn.addEventListener('click', clearForm);

    // Example chips
    document.querySelectorAll('.example-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const question = chip.getAttribute('data-question');
            questionInput.value = question;
            questionInput.focus();
        });
    });

    // Close results
    document.getElementById('closeResults')?.addEventListener('click', () => {
        resultsSection.style.display = 'none';
    });

    // Close error
    document.getElementById('closeError')?.addEventListener('click', () => {
        errorSection.style.display = 'none';
    });

    // Toggle SQL
    document.getElementById('toggleSQL')?.addEventListener('click', toggleSQL);
}

// Handle Form Submission
async function handleSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) return;

    const question = questionInput.value.trim();
    if (!question) {
        showError('Please enter a question.');
        return;
    }

    hideError();
    hideResults();
    setLoading(true);

    try {
        const response = await fetch(API_ENDPOINTS.query, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        if (data.success) {
            displayResults(data);
        } else {
            throw new Error(data.error || 'Query failed');
        }
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to connect to backend. Make sure the server is running on port 3000.');
    } finally {
        setLoading(false);
    }
}

// Display Results
function displayResults(data) {
    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Display question
    document.getElementById('displayQuestion').textContent = data.question || '';

    // Display answer
    const answerText = document.getElementById('answerText');
    answerText.textContent = data.answer || 'No answer provided.';

    // Display summary
    const summaryText = document.getElementById('summaryText');
    if (data.summary) {
        summaryText.textContent = data.summary;
        summaryText.style.display = 'block';
    } else {
        summaryText.style.display = 'none';
    }

    // Display SQL
    const sqlQuery = document.getElementById('sqlQuery');
    if (data.sql) {
        sqlQuery.textContent = data.sql;
    }

    // Display data table
    const dataTable = document.getElementById('dataTable');
    if (data.data && data.data.length > 0) {
        displayTable(data.data);
        dataTable.style.display = 'block';
    } else {
        dataTable.style.display = 'none';
    }

    // Display meta information
    if (data.meta) {
        document.getElementById('duration').textContent = data.meta.duration || 'N/A';
        const timestamp = data.meta.timestamp 
            ? new Date(data.meta.timestamp).toLocaleString()
            : 'N/A';
        document.getElementById('timestamp').textContent = timestamp;
    }

    // Reset SQL toggle
    const sqlQueryEl = document.getElementById('sqlQuery');
    const toggleIcon = document.querySelector('.toggle-icon');
    sqlQueryEl.style.display = 'none';
    toggleIcon.classList.remove('open');
}

// Display Data Table
function displayTable(data) {
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');
    const rowCount = document.getElementById('rowCount');

    // Clear existing content
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    if (data.length === 0) {
        rowCount.textContent = 'No rows found.';
        return;
    }

    // Get column names from first row
    const columns = Object.keys(data[0]);

    // Create header
    const headerRow = document.createElement('tr');
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = formatColumnName(column);
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Create rows
    data.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(column => {
            const td = document.createElement('td');
            const value = row[column];
            td.textContent = formatCellValue(value, column);
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    // Update row count
    rowCount.textContent = `${data.length} row${data.length !== 1 ? 's' : ''} found.`;
}

// Format Column Name
function formatColumnName(column) {
    return column
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

// Format Cell Value
function formatCellValue(value, columnName) {
    if (value === null || value === undefined) return 'N/A';
    
    const colLower = columnName.toLowerCase();
    
    // Format currency
    if (colLower.includes('value') || colLower.includes('cost') || colLower.includes('price')) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    }
    
    // Format numbers
    if (typeof value === 'number') {
        return new Intl.NumberFormat('en-US').format(value);
    }
    
    // Format dates
    if (value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
    
    return String(value);
}

// Toggle SQL Display
function toggleSQL() {
    const sqlQuery = document.getElementById('sqlQuery');
    const toggleIcon = document.querySelector('.toggle-icon');
    
    if (sqlQuery.style.display === 'none') {
        sqlQuery.style.display = 'block';
        toggleIcon.classList.add('open');
    } else {
        sqlQuery.style.display = 'none';
        toggleIcon.classList.remove('open');
    }
}

// Show Error
function showError(message) {
    errorSection.style.display = 'block';
    document.getElementById('errorMessage').textContent = message;
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Hide Error
function hideError() {
    errorSection.style.display = 'none';
}

// Hide Results
function hideResults() {
    resultsSection.style.display = 'none';
}

// Clear Form
function clearForm() {
    questionInput.value = '';
    hideResults();
    hideError();
    questionInput.focus();
}

// Set Loading State
function setLoading(loading) {
    isSubmitting = loading;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    if (loading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        questionInput.disabled = true;
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        questionInput.disabled = false;
    }
}

// Check Backend Connection
async function checkConnection() {
    try {
        statusIndicator.className = 'status-indicator connecting';
        statusText.textContent = 'Connecting...';
        
        const response = await fetch(API_ENDPOINTS.health, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            statusIndicator.className = 'status-indicator connected';
            statusText.textContent = 'Connected';
        } else {
            throw new Error('Backend not responding');
        }
    } catch (error) {
        statusIndicator.className = 'status-indicator disconnected';
        statusText.textContent = 'Disconnected';
    }
}

