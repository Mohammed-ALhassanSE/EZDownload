# YT-DLP GUI

<div align="center">

**A beautiful, modern desktop application for yt-dlp with smooth animations and an intuitive interface**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-latest-47848F?logo=electron)](https://www.electronjs.org/)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Screenshots](#screenshots) • [Contributing](#contributing)

</div>

---

## ✨ Features

### 🎨 Modern Interface
- **Glassmorphism Design** - Elegant UI with frosted glass effects and gradient backgrounds
- **Smooth Animations** - Powered by Anime.js for delightful micro-interactions
- **Responsive Layout** - Adapts beautifully to different window sizes
- **Custom Styling** - Polished scrollbars, hover effects, and transitions

### 📥 Download Capabilities
- **Multiple Formats** - MP4, WebM, MKV, MP3, M4A, and more
- **Quality Options** - From 4K down to 240p, choose your preferred resolution
- **Playlist Support** - Download entire playlists or cherry-pick specific videos
- **Smart Defaults** - Automatically selects the best available quality

### 🎯 User Experience
- **Video Preview** - View thumbnail, title, uploader, duration, and view count before downloading
- **Real-time Progress** - Live progress bar with download speed and ETA
- **Toast Notifications** - Beautiful pop-up feedback for all actions
- **Auto-save Settings** - Your preferences persist between sessions
- **Custom Output** - Choose exactly where your downloads go

### ⚙️ Advanced Options
- **Subtitle Downloads** - Automatically fetch available subtitles
- **Thumbnail Extraction** - Save video thumbnails separately
- **Metadata Embedding** - Include video information in file metadata
- **Detailed Logging** - Timestamped output log for troubleshooting

---

## 🚀 Quick Start

### Prerequisites

You'll need these installed on your system:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **yt-dlp** - The powerful video downloader this app uses

### Installing yt-dlp

<details>
<summary><b>Windows</b></summary>

```bash
# Using pip (recommended)
pip install yt-dlp

# Using winget
winget install yt-dlp

# Using Chocolatey
choco install yt-dlp
```
</details>

<details>
<summary><b>macOS</b></summary>

```bash
# Using Homebrew (recommended)
brew install yt-dlp

# Using pip
pip install yt-dlp
```
</details>

<details>
<summary><b>Linux</b></summary>

```bash
# Using pip (recommended)
pip install yt-dlp

# Ubuntu/Debian
sudo apt install yt-dlp

# Arch Linux
sudo pacman -S yt-dlp

# Fedora
sudo dnf install yt-dlp
```
</details>

Verify installation:
```bash
yt-dlp --version
```

---

## 📦 Installation

1. **Clone or download the repository:**

```bash
git clone https://github.com/Mohammed-ALhassanSE/EZDownload.git
cd ytdlp-gui-electron
```

Or download and extract the ZIP file.

2. **Install dependencies:**

```bash
npm install
```

3. **Run the application:**

```bash
npm start
```

---

## 🎮 Usage

### Basic Download
1. Paste a video URL into the input field
2. Click **Get Info** to preview the video
3. Select your preferred quality and format
4. Click **Download** and watch the magic happen

### Advanced Options
- **Choose Output Location** - Click the folder icon to select your download directory
- **Download Subtitles** - Enable the subtitles checkbox before downloading
- **Save Thumbnails** - Keep video thumbnails alongside your downloads
- **Embed Metadata** - Include video information in the file properties

### Playlist Downloads
1. Paste a playlist URL
2. Preview all videos in the playlist
3. Download the entire playlist or select individual videos

---

## 🏗️ Project Structure

```
ytdlp-gui-electron/
├── main.js               # Electron main process (backend logic)
├── preload.js            # Secure IPC bridge between renderer and main
├── index.html            # Application interface markup
├── styles.css            # Styling with animations and effects
├── script.js             # Frontend functionality and UI logic
├── package.json          # Dependencies and project configuration
└── README.md             # Documentation (you are here!)
```

---

## 🔧 Development

### Run in Development Mode

```bash
npm start
# or
npm run dev
```

The app will launch with hot-reload enabled for quick iterations.

### Build for Distribution

```bash
npm run build
```

This creates platform-specific distributables in the `dist/` folder:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage` or `.deb` package

---

## 🎨 Customization

### Changing the Color Scheme

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-color: #667eea;
    --success-color: #4caf50;
    --error-color: #f44336;
    --warning-color: #ff9800;
}
```

### Adding Features

The modular architecture makes it easy to extend:

1. **UI Changes** - Modify `index.html` and `styles.css`
2. **Frontend Logic** - Add functionality in `script.js`
3. **Backend Logic** - Handle IPC and system operations in `main.js`
4. **Secure Communication** - Update `preload.js` for new IPC channels

---

## 🐛 Troubleshooting

### yt-dlp Not Found

**Problem:** Error message about yt-dlp not being found

**Solutions:**
- Verify installation: `yt-dlp --version`
- Ensure yt-dlp is in your system PATH
- Restart your terminal/command prompt after installation
- Try reinstalling: `pip install --upgrade yt-dlp`

### Download Failures

**Problem:** Downloads fail or error out

**Check:**
- ✅ Internet connection is stable
- ✅ Video URL is valid and accessible
- ✅ You have write permissions for the output directory
- ✅ Sufficient disk space is available
- ✅ Review the output log for specific error messages

### Performance Issues

**Problem:** Application feels sluggish

**Try:**
- Close resource-intensive applications
- Download one video at a time for large files
- Check available disk space
- Restart the application
- Update to the latest version of yt-dlp

### Common Error Messages

| Error | Solution |
|-------|----------|
| `ERROR: Unable to extract video data` | Video may be private, deleted, or region-locked |
| `HTTP Error 403` | May require cookies/authentication (not currently supported) |
| `Postprocessing: ffmpeg not found` | Install ffmpeg for format conversion features |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs
- Use the issue tracker to report bugs
- Include your OS, Node.js version, and yt-dlp version
- Provide steps to reproduce the issue
- Share relevant error messages or logs

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature and its use case
- Explain how it would benefit users

### Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Test your changes thoroughly
- Update documentation as needed
- Keep commits focused and well-described

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

This project wouldn't be possible without these amazing tools:

- **[yt-dlp](https://github.com/yt-dlp/yt-dlp)** - The powerful command-line video downloader
- **[Electron](https://www.electronjs.org/)** - Framework for building cross-platform desktop apps
- **[Anime.js](https://animejs.com/)** - Lightweight JavaScript animation library
- **[Font Awesome](https://fontawesome.com/)** - Icon library for beautiful UI elements
- **[Inter Font](https://rsms.me/inter/)** - Modern and readable typeface

---

## 📞 Support

If you encounter issues or have questions:

- 📖 Check the [Troubleshooting](#troubleshooting) section
- 🐛 [Open an issue](../../issues) on GitHub
- 💬 Start a [discussion](../../discussions) for questions and ideas

---

<div align="center">

**Made with ❤️ for the yt-dlp community**

[⬆ Back to Top](#yt-dlp-gui)

</div>
