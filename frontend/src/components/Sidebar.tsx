import { useState } from 'react'

interface SidebarProps {
  paginaAtual: string
  mudarPagina: (pagina: string) => void
}

function Sidebar({
  paginaAtual,
  mudarPagina,
}: SidebarProps) {
  const [menuPessoasAberto, setMenuPessoasAberto] = useState(false)

  function alternarMenuPessoas() {
    setMenuPessoasAberto(!menuPessoasAberto)
  }

  return (
    <aside className="sidebar">
      <h2>Controle de Gastos</h2>

      <nav>
        <button
          className={paginaAtual === 'dashboard' ? 'active' : ''}
          type="button"
          onClick={() => mudarPagina('dashboard')}
        >
          Visão geral
        </button>

        <button
          className={
            paginaAtual === 'cadastrar-pessoa' ||
            paginaAtual === 'listar-pessoas'
              ? 'active'
              : ''
          }
          type="button"
          onClick={alternarMenuPessoas}
        >
          <span>Pessoas</span>

          <span className="menu-arrow">
            {menuPessoasAberto ? '▲' : '▼'}
          </span>
        </button>

        {menuPessoasAberto && (
          <div className="submenu">
            <button
              className={
                paginaAtual === 'cadastrar-pessoa'
                  ? 'submenu-active'
                  : ''
              }
              type="button"
              onClick={() => mudarPagina('cadastrar-pessoa')}
            >
              Cadastrar pessoa
            </button>

            <button
              className={
                paginaAtual === 'listar-pessoas'
                  ? 'submenu-active'
                  : ''
              }
              type="button"
              onClick={() => mudarPagina('listar-pessoas')}
            >
              Listar pessoas
            </button>
          </div>
        )}
        <button
  className={paginaAtual === 'transacoes' ? 'active' : ''}
  type="button"
  onClick={() => mudarPagina('transacoes')}
>
  Transações
</button>

        <button
  className={paginaAtual === 'totais' ? 'active' : ''}
  type="button"
  onClick={() => mudarPagina('totais')}
>
  Totais
</button>
      </nav>
    </aside>
  )
}

export default Sidebar