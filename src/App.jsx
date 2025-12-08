import { useState } from 'react'
import Waybar from './components/Waybar'
import Terminal from './components/Terminal'
import WindowManager from './components/WindowManager'
import './App.css'

function App() {
  const [activeWorkspace, setActiveWorkspace] = useState(1)
  const [showTerminal, setShowTerminal] = useState(true)

  return (
    <div className="hyprland-container">
      <Waybar 
        activeWorkspace={activeWorkspace} 
        setActiveWorkspace={setActiveWorkspace}
        showTerminal={showTerminal}
        setShowTerminal={setShowTerminal}
      />
      <WindowManager 
        activeWorkspace={activeWorkspace} 
        showTerminal={showTerminal}
        onTerminalClose={() => setShowTerminal(false)}
      />
    </div>
  )
}

export default App
