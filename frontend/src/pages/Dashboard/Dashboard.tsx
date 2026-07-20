import { useEffect, useState } from 'react'
import Button from '../../components/Button'

interface Pessoa {
  id: number
  nome: string
  idade: number
}

interface PessoaDaTransacao {
  id: number
  nome: string
}

interface Transacao {
  id: number
  descricao: string
  valor: number
  tipo: number
  pessoa: PessoaDaTransacao | null
}

interface TotalPessoa {
  pessoaId: number
  nome: string
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

interface TotalGeral {
  totalReceitas: number
  totalDespesas: number
  saldoLiquido: number
}

interface RespostaTotais {
  pessoas: TotalPessoa[]
  totalGeral: TotalGeral
}

interface DashboardProps {
  onCadastrarPessoa: () => void
}

function Dashboard({ onCadastrarPessoa }: DashboardProps) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [totais, setTotais] = useState<RespostaTotais | null>(null)

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // Busca os dados necessarios para montar o resumo inicial.
  useEffect(() => {
    async function carregarDashboard() {
      try {
        const respostaPessoas = await fetch(
          'http://localhost:5114/api/Pessoas',
        )

        const respostaTransacoes = await fetch(
          'http://localhost:5114/api/Transacoes',
        )

        const respostaTotais = await fetch(
          'http://localhost:5114/api/Totais',
        )

        if (
          !respostaPessoas.ok ||
          !respostaTransacoes.ok ||
          !respostaTotais.ok
        ) {
          throw new Error(
            'Nao foi possivel carregar os dados do dashboard.',
          )
        }

        const dadosPessoas: Pessoa[] =
          await respostaPessoas.json()

        const dadosTransacoes: Transacao[] =
          await respostaTransacoes.json()

        const dadosTotais: RespostaTotais =
          await respostaTotais.json()

        setPessoas(dadosPessoas)
        setTransacoes(dadosTransacoes)
        setTotais(dadosTotais)
      } catch (erro) {
        console.error(erro)
        setErro('Ocorreu um erro ao carregar o dashboard.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDashboard()
  }, [])

  function formatarValor(valor: number) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  // O maior Id representa a pessoa cadastrada mais recentemente.
  const ultimaPessoa = pessoas.reduce<Pessoa | null>(
    (maisRecente, pessoa) => {
      if (!maisRecente || pessoa.id > maisRecente.id) {
        return pessoa
      }

      return maisRecente
    },
    null,
  )

  // A API ja retorna as transacoes da mais nova para a mais antiga.
  const ultimaTransacao = transacoes[0]

  if (carregando) {
    return <p>Carregando dashboard...</p>
  }

  if (erro) {
    return <p>{erro}</p>
  }

  if (!totais) {
    return <p>Não foi possível encontrar os dados do dashboard.</p>
  }

  const cards = [
    {
      title: 'Pessoas cadastradas',
      value: pessoas.length.toString(),
    },
    {
      title: 'Total de receitas',
      value: formatarValor(totais.totalGeral.totalReceitas),
    },
    {
      title: 'Total de despesas',
      value: formatarValor(totais.totalGeral.totalDespesas),
    },
    {
      title: 'Saldo geral',
      value: formatarValor(totais.totalGeral.saldoLiquido),
    },
  ]

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

          <strong>
            {ultimaPessoa
              ? `${ultimaPessoa.nome} - ${ultimaPessoa.idade} anos`
              : 'Nenhuma pessoa cadastrada'}
          </strong>
        </div>

        <div className="recent-card">
          <span>Última movimentação</span>

          <strong>
            {ultimaTransacao
              ? `${ultimaTransacao.descricao} - ${formatarValor(
                  ultimaTransacao.valor,
                )}`
              : 'Nenhuma movimentação cadastrada'}
          </strong>

          {ultimaTransacao?.pessoa && (
            <small>{ultimaTransacao.pessoa.nome}</small>
          )}
        </div>
      </div>

      <section className="table-container">
        <h2>Pessoas e totais</h2>
        <p>Resumo financeiro de cada pessoa cadastrada.</p>

        {totais.pessoas.length === 0 ? (
          <p className="empty-table">
            Nenhuma pessoa cadastrada.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Receitas</th>
                <th>Despesas</th>
                <th>Saldo</th>
              </tr>
            </thead>

            <tbody>
              {totais.pessoas.map((pessoa) => (
                <tr key={pessoa.pessoaId}>
                  <td>{pessoa.nome}</td>

                  <td className="value-income">
                    {formatarValor(pessoa.totalReceitas)}
                  </td>

                  <td className="value-expense">
                    {formatarValor(pessoa.totalDespesas)}
                  </td>

                  <td
                    className={
                      pessoa.saldo < 0
                        ? 'value-expense'
                        : 'value-balance'
                    }
                  >
                    {formatarValor(pessoa.saldo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  )
}

export default Dashboard