import Terminal from './Terminal'
import './WindowManager.css'

function WindowManager({ activeWorkspace, showTerminal, onTerminalClose }) {
  const renderWorkspace = () => {
    switch (activeWorkspace) {
      case 1:
        return <Terminal workspace="home" onClose={onTerminalClose} />
      case 2:
        return <Terminal workspace="projects" onClose={onTerminalClose} />
      case 3:
        return <Terminal workspace="skills" onClose={onTerminalClose} />
      case 4:
        return <Terminal workspace="contact" onClose={onTerminalClose} />
      default:
        return <Terminal workspace="home" onClose={onTerminalClose} />
    }
  }

  return (
    <div className="window-manager">
      <div className="workspace-content">
        {showTerminal && renderWorkspace()}
      </div>
    </div>
  )
}

export default WindowManager
