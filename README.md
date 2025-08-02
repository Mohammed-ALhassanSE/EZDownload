# YT-DLP GUI - Electron App

A beautiful, anime-inspired GUI for yt-dlp with smooth animations and a modern interface.

## Features

- **Modern UI**: Sleek design with glassmorphism effects and smooth animations
- **Anime.js Animations**: Beautiful transitions and micro-interactions
- **Video Information**: Preview video details before downloading
- **Multiple Formats**: Support for various video and audio formats
- **Progress Tracking**: Real-time download progress with speed and ETA
- **Custom Output**: Choose your download location
- **Playlist Support**: Download entire playlists or select specific videos
- **Additional Options**: Subtitles, thumbnails, metadata, and more
- **Toast Notifications**: Beautiful popup notifications for user feedback
- **Auto-save Settings**: Your preferences are automatically saved

## Prerequisites

Before running this application, you need to have:

1. **Node.js** (v16 or higher)
2. **yt-dlp** installed on your system

### Installing yt-dlp

**Windows:**
```bash
# Using pip
pip install yt-dlp

# Using winget
winget install yt-dlp

# Using chocolatey
choco install yt-dlp
```

**macOS:**
```bash
# Using Homebrew
brew install yt-dlp

# Using pip
pip install yt-dlp
```

**Linux:**
```bash
# Using pip
pip install yt-dlp

# Ubuntu/Debian
sudo apt install yt-dlp

# Arch Linux
sudo pacman -S yt-dlp
```

## Installation

1. **Clone or create the project directory:**
```bash
mkdir ytdlp-gui-electron
cd ytdlp-gui-electron
```

2. **Create the project files:**
   - Copy all the provided files into your project directory
   - Make sure you have: `package.json`, `main.js`, `preload.js`, `index.html`, `styles.css`, `script.js`

3. **Install dependencies:**
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm start
# or
npm run dev
```

### Building for Distribution
```bash
npm run build
```

This will create distribution packages in the `dist` folder for your platform.

## Project Structure

```
ytdlp-gui-electron/
├── package.json          # Project configuration and dependencies
├── main.js               # Electron main process
├── preload.js            # Secure IPC bridge
├── index.html            # Main interface markup
├── styles.css            # Beautiful styling with animations
├── script.js             # Frontend functionality
└── README.md            # This file
```

## Features Walkthrough

### 🎨 **Beautiful Interface**
- Modern glassmorphism design with gradient backgrounds
- Smooth animations powered by Anime.js
- Responsive layout that works on different screen sizes
- Custom scrollbars and hover effects

### 📺 **Video Information**
- Get detailed video information before downloading
- Shows thumbnail, title, uploader, duration, and view count
- Supports both single videos and playlists

### ⚙️ **Download Options**
- Multiple quality options (4K to 240p)
- Various formats (MP4, WebM, MKV, MP3, M4A)
- Additional options: subtitles, thumbnails, metadata
- Custom output directory selection

### 📊 **Progress Tracking**
- Real-time progress bar with percentage
- Download speed and estimated time remaining
- Detailed output log with timestamps
- Toast notifications for status updates

### 🎯 **User Experience**
- Auto-save settings between sessions
- Clipboard integration for easy URL pasting
- Keyboard shortcuts and intuitive navigation
- Loading states and error handling

## Configuration

The app automatically saves your settings in a JSON file in your home directory. Settings include:

- Default download directory
- Preferred quality and format
- Checkbox preferences
- Window size and position

## Troubleshooting

### yt-dlp not found
If you get an error about yt-dlp not being found:
1. Make sure yt-dlp is installed: `yt-dlp --version`
2. Ensure it's in your system PATH
3. Try reinstalling yt-dlp

### Download fails
If downloads fail:
1. Check your internet connection
2. Verify the video URL is valid
3. Make sure you have write permissions to the output directory
4. Check the output log for detailed error messages

### Performance Issues
If the app feels slow:
1. Close other resource-intensive applications
2. Try downloading one video at a time
3. Check available disk space

## Customization

### Changing Colors
Edit the CSS variables in `styles.css` to customize the color scheme:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-color: #667eea;
    --success-color: #4caf50;
    --error-color: #f44336;
}
```

### Adding New Features
The modular structure makes it easy to add new features:
1. Add UI elements in `index.html`
2. Style them in `styles.css`
3. Add functionality in `script.js`
4. Handle backend logic in `main.js`

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **yt-dlp** - The powerful video downloader this GUI wraps around
- **Electron** - For making cross-platform desktop apps possible
- **Anime.js** - For the beautiful animations
- **Font Awesome** - For the icons
- **Inter Font** - For the beautiful typography