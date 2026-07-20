import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard/Dashboard'
import Pessoas from './pages/Pessoas/Pessoas'
import ListarPessoas from './pages/Pessoas/ListarPessoas'
import Transacoes from './pages/Transacoes/Transacoes'
import Totais from './pages/Totais/Totais'

function App() {
  // Guarda qual pagina deve aparecer na area principal.
  const [paginaAtual, setPaginaAtual] = useState('dashboard')

  // Escolhe o componente de acordo com a opcao selecionada no menu.
  function mostrarPagina() {
    if (paginaAtual === 'cadastrar-pessoa') {
      return <Pessoas />
    }

    if (paginaAtual === 'listar-pessoas') {
      return <ListarPessoas />
    }

    if (paginaAtual === 'transacoes') {
      return <Transacoes />
   }

     if (paginaAtual === 'totais') {
      return <Totais />
   }
    // O Dashboard e exibido quando nenhuma das opcoes acima estiver ativa.
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