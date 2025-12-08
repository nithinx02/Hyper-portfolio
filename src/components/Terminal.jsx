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
    ],
    about: () => [
      'Hi! I\'m a developer passionate about creating unique experiences.',
      'This portfolio is inspired by Arch Linux + Hyprland aesthetic.',
    ],
    projects: () => {
      return [
        { type: 'projects', content: 'list' }
      ]
    },
    skills: () => [
      'Technical Skills:',
      '  • React.js, JavaScript, TypeScript',
      '  • Node.js, Express',
      '  • Linux, Arch, Hyprland',
      '  • Git, Docker',
    ],
    contact: () => [
      'Get in touch:',
      '  Email: your@email.com',
      '  GitHub: github.com/yourusername',
      '  LinkedIn: linkedin.com/in/yourprofile',
    ],
    clear: () => {
      setHistory([])
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
          line.type === 'projects' ? (
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
                <div>
                  <div className="neofetch-header">nithin@portfolio</div>
                  <div className="neofetch-divider"></div>
                </div>
                
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
