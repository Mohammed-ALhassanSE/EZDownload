// Application State
let isDownloading = false;
let currentProgress = 0;

// DOM Elements
const elements = {
    // Window controls
    minimizeBtn: document.getElementById('minimizeBtn'),
    maximizeBtn: document.getElementById('maximizeBtn'),
    closeBtn: document.getElementById('closeBtn'),
    
    // Navigation
    navItems: document.querySelectorAll('.nav-item'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Status
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    
    // URL input
    urlInput: document.getElementById('urlInput'),
    pasteBtn: document.getElementById('pasteBtn'),
    clearBtn: document.getElementById('clearBtn'),
    getInfoBtn: document.getElementById('getInfoBtn'),
    
    // Video info
    videoInfoCard: document.getElementById('videoInfoCard'),
    videoThumbnail: document.getElementById('videoThumbnail'),
    videoTitle: document.getElementById('videoTitle'),
    videoUploader: document.getElementById('videoUploader'),
    videoDuration: document.getElementById('videoDuration'),
    videoViews: document.getElementById('videoViews'),
    
    // Options
    outputDir: document.getElementById('outputDir'),
    browseBtn: document.getElementById('browseBtn'),
    openDirBtn: document.getElementById('openDirBtn'),
    qualitySelect: document.getElementById('qualitySelect'),
    formatSelect: document.getElementById('formatSelect'),
    playlistCheck: document.getElementById('playlistCheck'),
    subtitlesCheck: document.getElementById('subtitlesCheck'),
    thumbnailCheck: document.getElementById('thumbnailCheck'),
    metadataCheck: document.getElementById('metadataCheck'),
    descriptionCheck: document.getElementById('descriptionCheck'),
    
    // Download controls
    downloadBtn: document.getElementById('downloadBtn'),
    stopBtn: document.getElementById('stopBtn'),
    
    // Progress
    progressCard: document.getElementById('progressCard'),
    progressTitle: document.getElementById('progressTitle'),
    progressDetails: document.getElementById('progressDetails'),
    progressFill: document.getElementById('progressFill'),
    progressPercentage: document.getElementById('progressPercentage'),
    
    // Log
    logContainer: document.getElementById('logContainer'),
    clearLogBtn: document.getElementById('clearLogBtn'),
    
    // Toast and loading
    toastContainer: document.getElementById('toastContainer'),
    loadingOverlay: document.getElementById('loadingOverlay')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
    setupEventListeners();
    setupAnimations();
});

// Initialize App
async function initializeApp() {
    // Check yt-dlp availability
    await checkYtdlpStatus();
    
    // Set default output directory
    try {
        const defaultPath = await window.electronAPI.getDefaultPath();
        elements.outputDir.value = defaultPath;
    } catch (error) {
        console.error('Error getting default path:', error);
    }
    
    // Load settings
    await loadSettings();
}

// Setup Event Listeners
function setupEventListeners() {
    // Window controls
    elements.minimizeBtn.addEventListener('click', () => window.electronAPI.minimizeWindow());
    elements.maximizeBtn.addEventListener('click', () => window.electronAPI.maximizeWindow());
    elements.closeBtn.addEventListener('click', () => window.electronAPI.closeWindow());
    
    // Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => switchTab(item.dataset.tab));
    });
    
    // URL actions
    elements.pasteBtn.addEventListener('click', pasteFromClipboard);
    elements.clearBtn.addEventListener('click', clearUrls);
    elements.getInfoBtn.addEventListener('click', getVideoInfo);
    
    // Directory actions
    elements.browseBtn.addEventListener('click', browseDirectory);
    elements.openDirBtn.addEventListener('click', openDirectory);
    
    // Download controls
    elements.downloadBtn.addEventListener('click', startDownload);
    elements.stopBtn.addEventListener('click', stopDownload);
    
    // Log
    elements.clearLogBtn.addEventListener('click', clearLog);
    
    // Download event listeners
    window.electronAPI.onDownloadProgress(handleDownloadProgress);
    window.electronAPI.onDownloadOutput(handleDownloadOutput);
    window.electronAPI.onDownloadComplete(handleDownloadComplete);
    window.electronAPI.onDownloadError(handleDownloadError);
}

// Setup Animations
function setupAnimations() {
    // Animate cards on page load
    anime({
        targets: '.card',
        translateY: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 800,
        easing: 'easeOutCubic'
    });
    
    // Animate navigation items
    anime({
        targets: '.nav-item',
        translateX: [-30, 0],
        opacity: [0, 1],
        delay: anime.stagger(80),
        duration: 600,
        easing: 'easeOutCubic'
    });
}

// Tab Switching
function switchTab(tabName) {
    // Update navigation
    elements.navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === tabName) {
            item.classList.add('active');
        }
    });
    
    // Update content
    elements.tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabName + 'Tab') {
            content.classList.add('active');
        }
    });
    
    // Animate tab change
    anime({
        targets: `.tab-content.active .card`,
        translateY: [30, 0],
        opacity: [0, 1],
        delay: anime.stagger(50),
        duration: 500,
        easing: 'easeOutCubic'
    });
}

// Check yt-dlp Status
async function checkYtdlpStatus() {
    try {
        showLoading(true);
        const result = await window.electronAPI.checkYtdlp();
        
        if (result.success) {
            elements.statusDot.className = 'status-dot connected';
            elements.statusText.textContent = `yt-dlp ${result.version}`;
            showToast('Success', 'yt-dlp is ready!', 'success');
        } else {
            elements.statusDot.className = 'status-dot error';
            elements.statusText.textContent = 'yt-dlp not found';
            showToast('Error', 'yt-dlp not installed. Please install it first.', 'error');
        }
    } catch (error) {
        elements.statusDot.className = 'status-dot error';
        elements.statusText.textContent = 'Connection error';
        showToast('Error', 'Failed to check yt-dlp status', 'error');
    } finally {
        showLoading(false);
    }
}

// URL Actions
async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        if (text) {
            elements.urlInput.value = text;
            animateButton(elements.pasteBtn);
            showToast('Success', 'URL pasted from clipboard', 'success');
        }
    } catch (error) {
        showToast('Error', 'Could not access clipboard', 'error');
    }
}

function clearUrls() {
    elements.urlInput.value = '';
    elements.videoInfoCard.style.display = 'none';
    animateButton(elements.clearBtn);
    
    anime({
        targets: elements.videoInfoCard,
        opacity: [1, 0],
        height: [elements.videoInfoCard.offsetHeight, 0],
        duration: 300,
        easing: 'easeInCubic',
        complete: () => {
            elements.videoInfoCard.style.display = 'none';
        }
    });
}

// Get Video Info
async function getVideoInfo() {
    const url = elements.urlInput.value.trim();
    if (!url) {
        showToast('Warning', 'Please enter a video URL first', 'warning');
        return;
    }
    
    try {
        showLoading(true);
        animateButton(elements.getInfoBtn);
        addLog('Getting video information...');
        
        const info = await window.electronAPI.getVideoInfo(url);
        
        if (info.success) {
            displayVideoInfo(info);
            showToast('Success', 'Video information loaded', 'success');
        } else {
            throw new Error(info.error);
        }
    } catch (error) {
        addLog(`Error: ${error.message}`, 'error');
        showToast('Error', 'Failed to get video information', 'error');
    } finally {
        showLoading(false);
    }
}

// Display Video Info
function displayVideoInfo(info) {
    elements.videoTitle.textContent = info.title;
    elements.videoUploader.textContent = info.uploader;
    elements.videoDuration.textContent = formatDuration(info.duration);
    elements.videoViews.textContent = formatNumber(info.view_count);
    
    if (info.thumbnail) {
        elements.videoThumbnail.src = info.thumbnail;
        elements.videoThumbnail.style.display = 'block';
    }
    
    // Show card with animation
    elements.videoInfoCard.style.display = 'block';
    anime({
        targets: elements.videoInfoCard,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: 'easeOutCubic'
    });
}

// Directory Actions
async function browseDirectory() {
    try {
        const directory = await window.electronAPI.selectDirectory();
        if (directory) {
            elements.outputDir.value = directory;
            animateButton(elements.browseBtn);
            showToast('Success', 'Output directory selected', 'success');
        }
    } catch (error) {
        showToast('Error', 'Failed to select directory', 'error');
    }
}

async function openDirectory() {
    const path = elements.outputDir.value;
    if (!path) {
        showToast('Warning', 'No directory specified', 'warning');
        return;
    }
    
    try {
        await window.electronAPI.openDirectory(path);
        animateButton(elements.openDirBtn);
    } catch (error) {
        showToast('Error', 'Failed to open directory', 'error');
    }
}

// Download Management
async function startDownload() {
    const url = elements.urlInput.value.trim();
    if (!url) {
        showToast('Warning', 'Please enter a video URL', 'warning');
        return;
    }
    
    const outputDir = elements.outputDir.value.trim();
    if (!outputDir) {
        showToast('Warning', 'Please select an output directory', 'warning');
        return;
    }
    
    const options = {
        url: url,
        outputDir: outputDir,
        quality: elements.qualitySelect.value,
        format: elements.formatSelect.value,
        playlist: elements.playlistCheck.checked,
        subtitles: elements.subtitlesCheck.checked,
        thumbnail: elements.thumbnailCheck.checked,
        metadata: elements.metadataCheck.checked,
        description: elements.descriptionCheck.checked
    };
    
    try {
        showLoading(true);
        const result = await window.electronAPI.startDownload(options);
        
        if (result.success) {
            isDownloading = true;
            updateDownloadUI(true);
            elements.progressCard.style.display = 'block';
            
            anime({
                targets: elements.progressCard,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 500,
                easing: 'easeOutCubic'
            });
            
            addLog('Download started successfully');
            showToast('Success', 'Download started', 'success');
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        addLog(`Error: ${error.message}`, 'error');
        showToast('Error', 'Failed to start download', 'error');
    } finally {
        showLoading(false);
    }
}

async function stopDownload() {
    try {
        const result = await window.electronAPI.stopDownload();
        if (result.success) {
            isDownloading = false;
            updateDownloadUI(false);
            addLog('Download stopped by user');
            showToast('Info', 'Download stopped', 'info');
        }
    } catch (error) {
        showToast('Error', 'Failed to stop download', 'error');
    }
}

// Download Event Handlers
function handleDownloadProgress(data) {
    currentProgress = data.progress;
    
    elements.progressFill.style.width = `${data.progress}%`;
    elements.progressPercentage.textContent = `${Math.round(data.progress)}%`;
    elements.progressDetails.textContent = `${Math.round(data.progress)}% • ${data.speed} • ETA: ${data.eta}`;
    
    // Animate progress
    anime({
        targets: elements.progressFill,
        width: `${data.progress}%`,
        duration: 300,
        easing: 'easeOutCubic'
    });
    
    if (data.line) {
        addLog(data.line);
    }
}

function handleDownloadOutput(data) {
    addLog(data);
}

function handleDownloadComplete(data) {
    isDownloading = false;
    updateDownloadUI(false);
    
    if (data.code === 0) {
        elements.progressFill.style.width = '100%';
        elements.progressPercentage.textContent = '100%';
        elements.progressTitle.textContent = 'Download completed!';
        addLog('Download completed successfully!', 'success');
        showToast('Success', 'Download completed successfully!', 'success');
        
        // Celebrate animation
        anime({
            targets: elements.progressCard,
            scale: [1, 1.02, 1],
            duration: 600,
            easing: 'easeInOutCubic'
        });
    } else {
        addLog('Download failed', 'error');
        showToast('Error', 'Download failed', 'error');
    }
}

function handleDownloadError(error) {
    isDownloading = false;
    updateDownloadUI(false);
    addLog(`Download error: ${error}`, 'error');
    showToast('Error', 'Download error occurred', 'error');
}

// UI Updates
function updateDownloadUI(downloading) {
    if (downloading) {
        elements.downloadBtn.style.display = 'none';
        elements.stopBtn.style.display = 'inline-flex';
        elements.progressTitle.textContent = 'Downloading...';
    } else {
        elements.downloadBtn.style.display = 'inline-flex';
        elements.stopBtn.style.display = 'none';
    }
}

// Logging
function addLog(message, type = 'info') {
    const logMessage = document.createElement('div');
    logMessage.className = `log-message ${type}`;
    logMessage.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    
    elements.logContainer.appendChild(logMessage);
    elements.logContainer.scrollTop = elements.logContainer.scrollHeight;
    
    // Animate new log entry
    anime({
        targets: logMessage,
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 300,
        easing: 'easeOutCubic'
    });
}

function clearLog() {
    elements.logContainer.innerHTML = '<div class="log-message">Log cleared...</div>';
    animateButton(elements.clearLogBtn);
}

// Toast Notifications
function showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Animate in
    anime({
        targets: toast,
        translateX: [400, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutCubic'
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        anime({
            targets: toast,
            translateX: [0, 400],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInCubic',
            complete: () => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }
        });
    }, 4000);
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Loading Overlay
function showLoading(show) {
    if (show) {
        elements.loadingOverlay.style.display = 'flex';
        anime({
            targets: elements.loadingOverlay,
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutCubic'
        });
    } else {
        anime({
            targets: elements.loadingOverlay,
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInCubic',
            complete: () => {
                elements.loadingOverlay.style.display = 'none';
            }
        });
    }
}

// Utility Functions
function animateButton(button) {
    anime({
        targets: button,
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeInOutCubic'
    });
}

function formatDuration(seconds) {
    if (!seconds) return 'Unknown';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

function formatNumber(num) {
    if (!num) return '0';
    return num.toLocaleString();
}

// Settings Management
async function loadSettings() {
    try {
        const settings = await window.electronAPI.loadSettings();
        
        if (settings.outputDir) {
            elements.outputDir.value = settings.outputDir;
        }
        if (settings.quality) {
            elements.qualitySelect.value = settings.quality;
        }
        if (settings.format) {
            elements.formatSelect.value = settings.format;
        }
        
        // Load checkbox states
        if (settings.playlist !== undefined) {
            elements.playlistCheck.checked = settings.playlist;
        }
        if (settings.subtitles !== undefined) {
            elements.subtitlesCheck.checked = settings.subtitles;
        }
        if (settings.thumbnail !== undefined) {
            elements.thumbnailCheck.checked = settings.thumbnail;
        }
        if (settings.metadata !== undefined) {
            elements.metadataCheck.checked = settings.metadata;
        }
        if (settings.description !== undefined) {
            elements.descriptionCheck.checked = settings.description;
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

async function saveSettings() {
    const settings = {
        outputDir: elements.outputDir.value,
        quality: elements.qualitySelect.value,
        format: elements.formatSelect.value,
        playlist: elements.playlistCheck.checked,
        subtitles: elements.subtitlesCheck.checked,
        thumbnail: elements.thumbnailCheck.checked,
        metadata: elements.metadataCheck.checked,
        description: elements.descriptionCheck.checked
    };
    
    try {
        await window.electronAPI.saveSettings(settings);
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

// Auto-save settings when options change
document.addEventListener('change', (e) => {
    if (e.target.matches('#outputDir, #qualitySelect, #formatSelect, input[type="checkbox"]')) {
        saveSettings();
    }
});