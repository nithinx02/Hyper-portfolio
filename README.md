# 🎨 Hyprland Portfolio

A modern, interactive portfolio website inspired by Arch Linux and Hyprland's aesthetic. Features a fully functional terminal interface with a sleek OLED black theme.

![Portfolio Preview](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

### 🖥️ Interactive Terminal
- **Draggable & Resizable** - Move and resize the terminal window like a real Hyprland floating window
- **Command History** - Navigate through previous commands using arrow keys (↑/↓)
- **Tab Completion** - Auto-complete commands by pressing Tab
- **Custom Commands** - Built-in commands for navigation and information display

### 🎯 Available Commands
```bash
help      # Show all available commands
neofetch  # Display profile information with photo
projects  # View project showcase
skills    # List technical skills
about     # About me
contact   # Contact information
clear     # Clear terminal screen
```

### 🌟 Waybar Integration
- **Glass Effect** - Transparent, blurred waybar with modern aesthetics
- **Social Links** - Quick access to LinkedIn, GitHub, and Gmail
- **System Info** - Battery, volume, location, and time display
- **Terminal Toggle** - Click to show/hide terminal

### 🎨 Design Features
- **OLED Black Theme** - Pure black background for OLED displays
- **Catppuccin Colors** - Beautiful color palette inspired by Catppuccin
- **Smooth Animations** - Polished transitions and hover effects
- **Responsive Layout** - Adapts to different screen sizes
- **Glassmorphism** - Modern frosted glass effects throughout

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/nithinx02/Hyper-portfolio.git
cd Hyper-portfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Add your profile image**
- Place your profile photo in `public/profile.jpg`

4. **Run development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 📁 Project Structure

```
Hyper-portfolio/
├── public/
│   ├── profile.jpg          # Your profile image
│   ├── wallpaper.jpg        # Background wallpaper
│   ├── github-logo.svg      # GitHub icon
│   ├── linkedin-logo.svg    # LinkedIn icon
│   ├── gmail-logo.svg       # Gmail icon
│   └── terminal-icon.svg    # Terminal icon
├── src/
│   ├── components/
│   │   ├── Terminal.jsx     # Terminal component
│   │   ├── Terminal.css     # Terminal styles
│   │   ├── Waybar.jsx       # Top bar component
│   │   ├── Waybar.css       # Waybar styles
│   │   ├── WindowManager.jsx
│   │   └── WindowManager.css
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Customization

### Update Personal Information

**Edit Terminal Commands** (`src/components/Terminal.jsx`):
```javascript
// Update neofetch information
Name: Your Name
Role: Your Role
Location: Your Location
Email: your@email.com
```

**Update Projects** (`src/components/Terminal.jsx`):
```javascript
// Add your projects in the projects section
<div className="project-card">
  <div className="project-title">🎨 Project Name</div>
  <div className="project-desc">Description</div>
  <div className="project-tech">Tech Stack</div>
  <a href="github-link">View on GitHub →</a>
</div>
```

**Update Social Links** (`src/components/Waybar.jsx`):
```javascript
// Update your social media links
LinkedIn: your-linkedin-url
GitHub: your-github-url
Gmail: your-email
```

### Change Colors

Edit `src/index.css` to customize the color scheme:
```css
:root {
  --bg-primary: #000000;
  --accent-blue: #89b4fa;
  --accent-purple: #cba6f7;
  --accent-green: #a6e3a1;
}
```

## 🛠️ Tech Stack

- **React 18.3.1** - UI framework
- **Vite 5.4.10** - Build tool
- **CSS3** - Styling with custom properties
- **JavaScript ES6+** - Modern JavaScript

## 📦 Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

## 🌐 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### Deploy to GitHub Pages
```bash
npm run build
# Push the dist folder to gh-pages branch
```

## 📸 Screenshots

### Terminal Interface
The interactive terminal with neofetch command displaying profile information.

### Projects Showcase
Grid layout showcasing all projects with descriptions and links.

### Waybar
Modern top bar with social links and system information.

## 🎯 Features Roadmap

- [ ] Add more terminal commands
- [ ] Implement theme switcher
- [ ] Add blog section
- [ ] Integrate with GitHub API for live project data
- [ ] Add animations for terminal text
- [ ] Mobile optimization

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Nithin**
- GitHub: [@nithinx02](https://github.com/nithinx02)
- LinkedIn: [nithin-devigner](https://linkedin.com/in/nithin-devigner)
- Email: nithinx002@gmail.com

## 🙏 Acknowledgments

- Inspired by [Hyprland](https://hyprland.org/) window manager
- Color scheme from [Catppuccin](https://github.com/catppuccin/catppuccin)
- Icons from various open-source projects

## ⭐ Show your support

Give a ⭐️ if you like this project!

---

Made with ❤️ by Nithin
