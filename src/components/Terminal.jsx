import { useEffect, useRef, useState } from 'react'
import './Terminal.css'

function Terminal({ workspace, onClose }) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [position, setPosition] = useState(() => {
    // Center the terminal on screen
    const centerX = (window.innerWidth - 750) / 2
    const centerY = (window.innerHeight - 550) / 2
    return { x: Math.max(0, centerX), y: Math.max(50, centerY) }
  })
  const [size, setSize] = useState({ width: 750, height: 550 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const terminalRef = useRef(null)
  const inputRef = useRef(null)
  const headerRef = useRef(null)

  const commands = {
    help: () => [
      'Available commands:',
      '  help      - Show this help message',
      '  about     - About me',
      '  projects  - View my projects',
      '  skills    - List my skills',
      '  contact   - Get in touch',
      '  clear     - Clear terminal',
      '  neofetch  - System info',
      '  exit      - Close terminal',
    ],
    about: () => {
      return [
        { type: 'about', content: 'info' }
      ]
    },
    projects: () => {
      return [
        { type: 'projects', content: 'list' }
      ]
    },
    skills: () => {
      return [
        { type: 'skills', content: 'list' }
      ]
    },
    contact: () => {
      return [
        { type: 'contact', content: 'info' }
      ]
    },
    clear: () => {
      setHistory([])
      return []
    },
    exit: () => {
      if (onClose) {
        onClose()
      }
      return []
    },
    neofetch: () => {
      // Return special format for neofetch with image
      return [
        { type: 'neofetch', content: 'profile' }
      ]
    },
  }

  useEffect(() => {
    const welcomeMessage = [
      'Welcome to Hyprland Portfolio Terminal',
      'Type "help" for available commands',
      '',
    ]
    setHistory(welcomeMessage.map(line => ({ type: 'output', content: line })))
  }, [workspace])

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    
    // Commands that should clear the screen before showing output
    const clearCommands = ['help', 'projects', 'neofetch', 'skills', 'about', 'contact']
    
    if (clearCommands.includes(trimmedCmd)) {
      // Clear history and show only the new command
      setHistory([{ type: 'input', content: `$ ${cmd}` }])
    } else {
      setHistory(prev => [...prev, { type: 'input', content: `$ ${cmd}` }])
    }

    if (trimmedCmd === '') return

    if (commands[trimmedCmd]) {
      const output = commands[trimmedCmd]()
      if (output.length > 0) {
        // Check if output already has type property (like neofetch)
        if (output[0].type) {
          setHistory(prev => [...prev, ...output])
        } else {
          setHistory(prev => [...prev, ...output.map(line => ({ type: 'output', content: line }))])
        }
      }
    } else {
      setHistory(prev => [...prev, { type: 'error', content: `Command not found: ${trimmedCmd}` }])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      handleCommand(input)
      setCommandHistory(prev => [...prev, input])
      setHistoryIndex(-1)
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setInput('')
        } else {
          setHistoryIndex(newIndex)
          setInput(commandHistory[newIndex])
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const availableCommands = Object.keys(commands)
      const matches = availableCommands.filter(cmd => cmd.startsWith(input.toLowerCase()))
      
      if (matches.length === 1) {
        setInput(matches[0])
      } else if (matches.length > 1) {
        // Show available matches
        const matchList = matches.join('  ')
        setHistory(prev => [...prev, { type: 'output', content: matchList }])
      }
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleMouseDown = (e) => {
    if (e.target.closest('.terminal-header')) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    }
    if (isResizing) {
      const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x))
      const newHeight = Math.max(300, resizeStart.height + (e.clientY - resizeStart.y))
      setSize({ width: newWidth, height: newHeight })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  const handleResizeStart = (e) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    })
  }

  const handleClose = (e) => {
    e.stopPropagation()
    if (onClose) {
      onClose()
    }
  }

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragOffset, resizeStart])

  return (
    <div 
      className="terminal-window" 
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <div 
        className="terminal-header"
        ref={headerRef}
        onMouseDown={handleMouseDown}
      >
        <div className="terminal-buttons">
          <span className="btn close" onClick={handleClose}></span>
          <span className="btn minimize"></span>
          <span className="btn maximize"></span>
        </div>
        <div className="terminal-title">user@portfolio:~/{workspace}</div>
      </div>
      <div 
        className="resize-handle"
        onMouseDown={handleResizeStart}
      ></div>
      <div className="terminal-body" ref={terminalRef}>
        {history.map((line, i) => (
          line.type === 'about' ? (
            <div key={i} className="about-container">
              <div className="about-header">👋 About Me</div>
              <div className="about-content">
                <div className="about-card">
                  <div className="about-text">
                    <p>Hi! I'm <span className="highlight">Nithin</span>, a passionate <span className="highlight">Java Developer </span> from Tiruppur, India.</p>
                    <p>I love creating unique and innovative web experiences that blend functionality with beautiful design. This portfolio is inspired by the minimalist aesthetic of Arch Linux and Hyprland window manager.</p>
                    <p>I specialize in building modern web applications using React, Node.js, and exploring machine learning technologies. Always eager to learn new technologies and take on challenging projects.</p>
                  </div>
                  <div className="about-stats">
                    <div className="stat-item">
                      <div className="stat-value">5+</div>
                      <div className="stat-label">Projects</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">10+</div>
                      <div className="stat-label">Technologies</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">∞</div>
                      <div className="stat-label">Learning</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : line.type === 'contact' ? (
            <div key={i} className="contact-container">
              <div className="contact-header">📬 Get In Touch</div>
              <div className="contact-grid">
                <a href="mailto:nithinx002@gmail.com" className="contact-card">
                  <div className="contact-icon">📧</div>
                  <div className="contact-info">
                    <div className="contact-label">Email</div>
                    <div className="contact-value">nithinx002@gmail.com</div>
                  </div>
                </a>
                
                <a href="https://github.com/nithinx02" target="_blank" rel="noopener noreferrer" className="contact-card">
                  <div className="contact-icon">
                    <img src="/github-logo.svg" alt="GitHub" style={{width: '32px', height: '32px', filter: 'invert(1)'}} />
                  </div>
                  <div className="contact-info">
                    <div className="contact-label">GitHub</div>
                    <div className="contact-value">@nithinx02</div>
                  </div>
                </a>
                
                <a href="https://www.linkedin.com/in/nithin-devigner/" target="_blank" rel="noopener noreferrer" className="contact-card">
                  <div className="contact-icon">
                    <img src="/linkedin-logo.svg" alt="LinkedIn" style={{width: '32px', height: '32px'}} />
                  </div>
                  <div className="contact-info">
                    <div className="contact-label">LinkedIn</div>
                    <div className="contact-value">nithin-devigner</div>
                  </div>
                </a>
                
                <div className="contact-card">
                  <div className="contact-icon">📍</div>
                  <div className="contact-info">
                    <div className="contact-label">Location</div>
                    <div className="contact-value">Tiruppur, India</div>
                  </div>
                </div>
              </div>
            </div>
          ) : line.type === 'skills' ? (
            <div key={i} className="skills-container">
              <div className="skills-header">💻 Technical Skills</div>
              <div className="skills-grid">
                <div className="skill-category">
                  <div className="category-title">▸ Frontend</div>
                  <div className="skill-tags">
                    <span className="skill-tag">React.js</span>
                    <span className="skill-tag">JavaScript</span>
                    <span className="skill-tag">TypeScript</span>
                    <span className="skill-tag">HTML5</span>
                    <span className="skill-tag">CSS3</span>
                    <span className="skill-tag">Vite</span>
                  </div>
                </div>
                
                <div className="skill-category">
                  <div className="category-title">▸ Backend</div>
                  <div className="skill-tags">
                    <span className="skill-tag">Node.js</span>
                    <span className="skill-tag">Express</span>
                    <span className="skill-tag">Python</span>
                  </div>
                </div>
                
                <div className="skill-category">
                  <div className="category-title">▸ Tools & Others</div>
                  <div className="skill-tags">
                    <span className="skill-tag">Git</span>
                    <span className="skill-tag">Docker</span>
                    <span className="skill-tag">Linux</span>
                    <span className="skill-tag">Arch</span>
                    <span className="skill-tag">Hyprland</span>
                  </div>
                </div>
                
                <div className="skill-category">
                  <div className="category-title">▸ Machine Learning</div>
                  <div className="skill-tags">
                    <span className="skill-tag">Python</span>
                    <span className="skill-tag">AI/ML</span>
                    <span className="skill-tag">Data Science</span>
                  </div>
                </div>
              </div>
            </div>
          ) : line.type === 'projects' ? (
            <div key={i} className="projects-container">
              <div className="projects-header">📂 My Projects</div>
              <div className="projects-grid">
                {/* 
                  TO ADD YOUR PROJECTS:
                  1. Go to https://github.com/nithinx02
                  2. Copy your repository names
                  3. Replace the project cards below with your actual projects
                  
                  Template:
                  <div className="project-card">
                    <div className="project-title">🎨 Project Name</div>
                    <div className="project-desc">Your project description</div>
                    <div className="project-tech">Tech Stack Here</div>
                    <a href="https://github.com/nithinx02/repo-name" target="_blank" rel="noopener noreferrer" className="project-link">View on GitHub →</a>
                  </div>
                */}
                
                <div className="project-card">
                  <div className="project-title">🎨 Hyprland Portfolio</div>
                  <div className="project-desc">A modern portfolio website inspired by Arch Linux + Hyprland aesthetic with interactive terminal</div>
                  <div className="project-tech">React.js • Vite • CSS</div>
                  <a href="https://github.com/nithinx02" target="_blank" rel="noopener noreferrer" className="project-link">View on GitHub →</a>
                </div>
                
                <div className="project-card">
                  <div className="project-title">♻️ Eco-Waste</div>
                  <div className="project-desc">A waste management application built with modern web technologies</div>
                  <div className="project-tech">TypeScript • JavaScript • CSS</div>
                  <a href="https://github.com/nithinx02/eco-waste" target="_blank" rel="noopener noreferrer" className="project-link">View on GitHub →</a>
                </div>
                
                <div className="project-card">
                  <div className="project-title">🧠 Brain Tumor Prediction</div>
                  <div className="project-desc">Machine learning model for brain tumor detection and prediction using medical imaging</div>
                  <div className="project-tech">Python • Machine Learning • AI</div>
                  <a href="https://github.com/nithinx02/Brain-Tumor-prediction" target="_blank" rel="noopener noreferrer" className="project-link">View on GitHub →</a>
                </div>
                
                <div className="project-card">
                  <div className="project-title">🌿 Herb Vista</div>
                  <div className="project-desc">A web application for exploring and learning about medicinal herbs and plants</div>
                  <div className="project-tech">HTML • CSS • JavaScript</div>
                  <a href="https://github.com/nithinx02/herb-vista" target="_blank" rel="noopener noreferrer" className="project-link">View on GitHub →</a>
                </div>
                
                <div className="project-card">
                  <div className="project-title">💰 Money Crafter</div>
                  <div className="project-desc">A financial management and budgeting application to track expenses and manage money</div>
                  <div className="project-tech">SCSS • JavaScript • HTML • CSS</div>
                  <a href="https://github.com/nithinx02/Money-Crafter" target="_blank" rel="noopener noreferrer" className="project-link">View on GitHub →</a>
                </div>
              </div>
            </div>
          ) : line.type === 'neofetch' ? (
            <div key={i} className="neofetch-container">
              <div className="neofetch-left">
                <img src="/profile.jpg" alt="Nithin" className="profile-image" />
                <div className="profile-name">Nithin</div>
                <div className="profile-role">Full Stack Developer</div>
              </div>
              <div className="neofetch-right">
                <div className="neofetch-header">nithin@portfolio</div>
                
                <div className="neofetch-section">
                  <div className="neofetch-info">
                    <div className="info-row">
                      <span className="info-label">📍 Location</span>
                      <span className="info-value">Tiruppur, India</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">📧 Email</span>
                      <span className="info-value">nithinx002@gmail.com</span>
                    </div>
                  </div>
                </div>

                <div className="neofetch-section">
                  <div className="neofetch-section-title">Skills</div>
                  <div className="skill-item">React.js, JavaScript, TypeScript</div>
                  <div className="skill-item">Node.js, Express</div>
                  <div className="skill-item">Linux, Arch, Hyprland</div>
                  <div className="skill-item">Git, Docker</div>
                </div>

                <div className="neofetch-section">
                  <div className="neofetch-section-title">Links</div>
                  <a href="https://github.com/nithinx02" target="_blank" rel="noopener noreferrer" className="link-item">
                    GitHub: github.com/nithinx02
                  </a>
                  <a href="https://www.linkedin.com/in/nithin-devigner/" target="_blank" rel="noopener noreferrer" className="link-item">
                    LinkedIn: linkedin.com/in/nithin-devigner
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div key={i} className={`terminal-line ${line.type}`}>
              {line.content}
            </div>
          )
        ))}
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="prompt">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            autoFocus
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  )
}

export default Terminal
