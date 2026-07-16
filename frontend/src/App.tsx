import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard/Dashboard'
import Pessoas from './pages/Pessoas/Pessoas'

function App() {
  const [paginaAtual, setPaginaAtual] = useState('dashboard')

  function mostrarPagina() {
    if (paginaAtual === 'cadastrar-pessoa') {
      return <Pessoas />
    }

    return (
      <Dashboard
        onCadastrarPessoa={() => setPaginaAtual('cadastrar-pessoa')}
      />
    )
  }

  return (
    <div className="app">
      <Sidebar
        paginaAtual={paginaAtual}
        mudarPagina={setPaginaAtual}
      />

      <main className="main-content">
        {mostrarPagina()}
      </main>
    </div>
  )
}

export default App