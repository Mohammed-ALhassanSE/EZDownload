const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');

let mainWindow;
let downloadProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    titleBarStyle: 'hidden',
    show: false
  });

  mainWindow.loadFile('index.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (downloadProcess) {
      downloadProcess.kill();
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Window controls
ipcMain.handle('window-minimize', () => {
  mainWindow.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('window-close', () => {
  mainWindow.close();
});

// Directory selection
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Open directory
ipcMain.handle('open-directory', async (event, path) => {
  try {
    await shell.openPath(path);
    return true;
  } catch (error) {
    console.error('Error opening directory:', error);
    return false;
  }
});

// Get video info
ipcMain.handle('get-video-info', async (event, url) => {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn('yt-dlp', ['--dump-json', '--no-download', url]);
    let data = '';
    let error = '';

    ytdlp.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    ytdlp.stderr.on('data', (chunk) => {
      error += chunk.toString();
    });

    ytdlp.on('close', (code) => {
      if (code === 0 && data.trim()) {
        try {
          const lines = data.trim().split('\n');
          const info = JSON.parse(lines[0]);
          resolve({
            success: true,
            title: info.title || 'Unknown',
            duration: info.duration || 0,
            uploader: info.uploader || 'Unknown',
            view_count: info.view_count || 0,
            upload_date: info.upload_date || 'Unknown',
            thumbnail: info.thumbnail || null
          });
        } catch (parseError) {
          reject({ success: false, error: 'Failed to parse video info' });
        }
      } else {
        reject({ success: false, error: error || 'Failed to get video info' });
      }
    });

    ytdlp.on('error', (err) => {
      reject({ success: false, error: err.message });
    });
  });
});

// Get playlist info
ipcMain.handle('get-playlist-info', async (event, url) => {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn('yt-dlp', ['--dump-json', '--flat-playlist', url]);
    let data = '';
    let error = '';

    ytdlp.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    ytdlp.stderr.on('data', (chunk) => {
      error += chunk.toString();
    });

    ytdlp.on('close', (code) => {
      if (code === 0 && data.trim()) {
        try {
          const lines = data.trim().split('\n');
          const entries = [];
          let playlistTitle = 'Unknown Playlist';

          for (const line of lines) {
            if (line.trim()) {
              const entry = JSON.parse(line);
              if (entry._type === 'playlist') {
                playlistTitle = entry.title;
              } else {
                entries.push({
                  title: entry.title || 'Unknown',
                  duration: entry.duration || 0,
                  uploader: entry.uploader || 'Unknown'
                });
              }
            }
          }

          resolve({
            success: true,
            title: playlistTitle,
            entries: entries
          });
        } catch (parseError) {
          reject({ success: false, error: 'Failed to parse playlist info' });
        }
      } else {
        reject({ success: false, error: error || 'Failed to get playlist info' });
      }
    });
  });
});

// Start download
ipcMain.handle('start-download', async (event, options) => {
  return new Promise((resolve, reject) => {
    if (downloadProcess) {
      downloadProcess.kill();
    }

    const args = ['--newline', '--no-colors'];
    
    // Output template
    if (options.outputDir) {
      const template = path.join(options.outputDir, '%(title)s.%(ext)s');
      args.push('-o', template);
    }

    // Quality and format
    if (options.format === 'mp3') {
      args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
    } else if (options.format === 'm4a') {
      args.push('-x', '--audio-format', 'm4a');
    } else {
      const formatString = options.quality === 'best' 
        ? `best[ext=${options.format}]/best`
        : `best[height<=${options.quality.replace('p', '')}][ext=${options.format}]/best[height<=${options.quality.replace('p', '')}]/best[ext=${options.format}]/best`;
      args.push('-f', formatString);
    }

    // Additional options
    if (options.playlist) args.push('--yes-playlist');
    else args.push('--no-playlist');
    
    if (options.subtitles) args.push('--write-auto-subs', '--sub-lang', 'en');
    if (options.thumbnail) args.push('--write-thumbnail');
    if (options.metadata) args.push('--embed-metadata');
    if (options.description) args.push('--write-description');
    
    args.push('--continue', '--no-overwrites');
    args.push(options.url);

    downloadProcess = spawn('yt-dlp', args);
    let hasStarted = false;

    downloadProcess.stdout.on('data', (data) => {
      const output = data.toString();
      const lines = output.split('\n');
      
      for (const line of lines) {
        if (line.trim()) {
          if (!hasStarted) {
            hasStarted = true;
            resolve({ success: true });
          }
          
          // Parse progress
          if (line.includes('[download]') && line.includes('%')) {
            const progressMatch = line.match(/(\d+\.?\d*)%/);
            const speedMatch = line.match(/at\s+([^\s]+)/);
            const etaMatch = line.match(/ETA\s+([^\s]+)/);
            
            mainWindow.webContents.send('download-progress', {
              progress: progressMatch ? parseFloat(progressMatch[1]) : 0,
              speed: speedMatch ? speedMatch[1] : '',
              eta: etaMatch ? etaMatch[1] : '',
              line: line
            });
          } else {
            mainWindow.webContents.send('download-output', line);
          }
        }
      }
    });

    downloadProcess.stderr.on('data', (data) => {
      mainWindow.webContents.send('download-output', `Error: ${data.toString()}`);
    });

    downloadProcess.on('close', (code) => {
      downloadProcess = null;
      mainWindow.webContents.send('download-complete', { code });
      if (!hasStarted) {
        reject({ success: false, error: 'Download failed to start' });
      }
    });

    downloadProcess.on('error', (error) => {
      downloadProcess = null;
      if (!hasStarted) {
        reject({ success: false, error: error.message });
      }
      mainWindow.webContents.send('download-error', error.message);
    });

    // Timeout for initial response
    setTimeout(() => {
      if (!hasStarted) {
        if (downloadProcess) {
          downloadProcess.kill();
        }
        reject({ success: false, error: 'Download timeout' });
      }
    }, 10000);
  });
});

// Stop download
ipcMain.handle('stop-download', async () => {
  if (downloadProcess) {
    downloadProcess.kill();
    downloadProcess = null;
    return { success: true };
  }
  return { success: false };
});

// Check yt-dlp
ipcMain.handle('check-ytdlp', async () => {
  return new Promise((resolve) => {
    const ytdlp = spawn('yt-dlp', ['--version']);
    let version = '';

    ytdlp.stdout.on('data', (data) => {
      version += data.toString().trim();
    });

    ytdlp.on('close', (code) => {
      if (code === 0 && version) {
        resolve({ success: true, version });
      } else {
        resolve({ success: false, error: 'yt-dlp not found' });
      }
    });

    ytdlp.on('error', () => {
      resolve({ success: false, error: 'yt-dlp not installed' });
    });
  });
});

// Get default download path
ipcMain.handle('get-default-path', () => {
  return path.join(os.homedir(), 'Downloads', 'yt-dlp');
});

// Settings management
const settingsPath = path.join(os.homedir(), '.ytdlp-gui-settings.json');

ipcMain.handle('load-settings', () => {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return {};
});

ipcMain.handle('save-settings', (event, settings) => {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving settings:', error);
    return { success: false, error: error.message };
  }
});