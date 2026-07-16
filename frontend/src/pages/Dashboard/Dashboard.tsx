import Button from '../../components/Button'

const cards = [
  {
    title: 'Pessoas cadastradas',
    value: '0',
  },
  {
    title: 'Total de receitas',
    value: 'R$ 0,00',
  },
  {
    title: 'Total de despesas',
    value: 'R$ 0,00',
  },
  {
    title: 'Saldo geral',
    value: 'R$ 0,00',
  },
]
interface DashboardProps {
  onCadastrarPessoa: () => void
}

function Dashboard({ onCadastrarPessoa }: DashboardProps) {
  return (
    <section className="dashboard">
      <header className="dashboard-header">
        <div>
          <span>VISÃO GERAL</span>
          <h1>Resumo financeiro</h1>
          <p>Acompanhe os gastos das pessoas cadastradas.</p>
        </div>

        <Button
  text="Cadastrar pessoa"
  onClick={onCadastrarPessoa}
/>
      </header>

      <div className="cards">
        {cards.map((card) => (
          <div className="card" key={card.title}>
            <span>{card.title}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>

      <div className="recent-items">
        <div className="recent-card">
          <span>Última pessoa cadastrada</span>
          <strong>Nenhuma pessoa cadastrada</strong>
        </div>

        <div className="recent-card">
          <span>Última movimentação</span>
          <strong>Nenhuma movimentação cadastrada</strong>
        </div>
      </div>

      <section className="table-container">
        <h2>Pessoas e totais</h2>
        <p>Resumo financeiro de cada pessoa cadastrada.</p>

        <table>
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Idade</th>
              <th>Última movimentação</th>
              <th>Receitas</th>
              <th>Despesas</th>
              <th>Saldo</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={6} className="empty-table">
                Nenhuma pessoa cadastrada.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  )
}

export default Dashboard