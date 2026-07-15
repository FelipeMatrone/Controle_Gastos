
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard/Dashboard'

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  )
}

export default App