# 🛡️ PhishGuard Terminal

An advanced phishing URL detection tool with a cyberpunk hacker terminal interface. Features real-time threat analysis, Matrix-style animations, and comprehensive security scanning.

![PhishGuard Terminal](https://img.shields.io/badge/Security-Terminal-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🎯 Features

### 🔍 Advanced URL Analysis
- **URL Length Detection** - Identifies suspiciously long URLs
- **HTTPS Verification** - Checks for SSL/TLS encryption
- **IP Address Detection** - Flags direct IP addresses in URLs
- **Subdomain Analysis** - Detects excessive subdomain chaining
- **Keyword Scanning** - Identifies phishing-related keywords
- **Homograph Attack Detection** - Detects lookalike character substitutions
- **URL Shortener Detection** - Identifies obfuscated shortened links

### 💻 Hacker Terminal Interface
- **Matrix Rain Effect** - Animated falling characters background
- **CRT Scanlines** - Authentic retro terminal aesthetics
- **Live Terminal Output** - Real-time scanning process visualization
- **Command-Line Input** - Terminal-style URL entry
- **Progress Tracking** - Visual scan progress indicators

### 📊 Security Dashboard
- **Total Scans Counter** - Track all analyzed URLs
- **Threats Blocked** - Monitor detected phishing attempts
- **Safe URLs Percentage** - Security success rate
- **Average Scan Time** - Performance metrics

### 🗃️ Data Persistence
- **Scan History** - Last 5 scans with timestamps
- **Activity Log** - Color-coded threat levels
- **Threat Database Stats** - Real-time security metrics
- **Local Storage** - All data persists between sessions

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/phishguard-terminal.git
cd phishguard-terminal
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

## 🛠️ Tech Stack

- **React 18.3** - UI framework
- **Vite 8.0** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **LocalStorage API** - Data persistence

## 📁 Project Structure
```
phishguard/
├── src/
│   ├── App.jsx          # Main application component
│   ├── index.css        # Global styles with Tailwind
│   └── main.jsx         # Application entry point
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## 🎮 Usage

### Scanning a URL

1. Enter a URL in the terminal input field
2. Click `[EXECUTE_SCAN]` or press Enter
3. Watch the terminal animation as it analyzes
4. View detailed threat report with risk score

### Quick Test Vectors

Use the built-in test URLs:
- **safe.sh** - Known safe website (Google)
- **phish.sh** - Simulated phishing URL
- **ip.sh** - Direct IP address URL

### Understanding Risk Scores

- **0-29 (Green)** - `CLEAN_SIGNATURE` - Low risk, appears safe
- **30-59 (Yellow)** - `SUSPICIOUS_PATTERN` - Medium risk, proceed with caution
- **60-100 (Red)** - `CRITICAL_THREAT` - High risk, likely phishing

## 🔐 Detection Algorithms

### URL Length Analysis
- Short URLs (<54 chars): Normal
- Medium URLs (54-75 chars): Suspicious
- Long URLs (>75 chars): High risk

### Pattern Matching
- Phishing keywords: login, verify, account, update, secure, banking, confirm
- URL shorteners: bit.ly, tinyurl, goo.gl, t.co, ow.ly
- Special characters: Excessive use of @, -, _

### Security Checks
- HTTPS protocol validation
- Direct IP address detection
- Subdomain count analysis
- Homograph attack vectors (Cyrillic characters)

## 🎨 Customization

### Changing Colors
Edit the terminal theme in `src/App.jsx`:
```jsx
// Current: Green terminal theme
className="text-green-400"

// Change to blue:
className="text-blue-400"
```

### Adjusting Risk Thresholds
Modify scoring in the `analyzeURL` function:
```javascript
if (riskScore >= 60) {
  status = 'CRITICAL_THREAT';  // Adjust threshold here
}
```

### Adding New Detection Rules
Add custom patterns in `analyzeURL`:
```javascript
// Example: Detect specific domain
if (inputUrl.includes('suspicious-domain.com')) {
  factors.push({ 
    name: 'BLACKLISTED_DOMAIN', 
    risk: 'high', 
    points: 40 
  });
  riskScore += 40;
}
```

## 📦 Build for Production
```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

Output will be in the `dist/` folder.

## 🌐 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag and drop 'dist' folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Deploy 'dist' folder to gh-pages branch
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Matrix rain may impact performance on low-end devices
- LocalStorage has 5-10MB limit depending on browser
- Scanning animation duration is fixed at 1.5 seconds

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Inspired by hacker terminal aesthetics
- Matrix rain effect concept from The Matrix (1999)
- Icons by [Lucide](https://lucide.dev/)
- Built with [Vite](https://vitejs.dev/)

## 📸 Screenshots

### Main Terminal Interface
![Main Interface](screenshots/main.png)

### Scanning Process
![Scanning](screenshots/scanning.png)

### Threat Detection
![Threat Report](screenshots/threat.png)

---

**⚠️ Disclaimer**: This tool is for educational purposes. It provides heuristic analysis and should not be the sole method for determining URL safety. Always exercise caution when clicking unfamiliar links.

**Made with 💀 by PhishGuard Team**