import { useEffect, useState } from 'react'

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

function Totais() {
  const [dados, setDados] = useState<RespostaTotais | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // Busca os totais calculados pela API quando a pagina for aberta.
  useEffect(() => {
    async function buscarTotais() {
      try {
        const resposta = await fetch(
          'http://localhost:5114/api/Totais',
        )

        if (!resposta.ok) {
          throw new Error('Nao foi possivel buscar os totais.')
        }

        const resultado: RespostaTotais = await resposta.json()
        setDados(resultado)
      } catch (erro) {
        console.error(erro)
        setErro('Ocorreu um erro ao carregar os totais.')
      } finally {
        setCarregando(false)
      }
    }

    buscarTotais()
  }, [])

  function formatarValor(valor: number) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  if (carregando) {
    return <p>Carregando totais...</p>
  }

  if (erro) {
    return <p>{erro}</p>
  }

  if (!dados) {
    return <p>Não foi possível encontrar os totais.</p>
  }

  return (
    <section className="totals-page">
      <header className="totals-page__header">
        <span>CONSULTA</span>
        <h1>Totais por pessoa</h1>
        <p>
          Confira as receitas, despesas e o saldo de cada pessoa.
        </p>
      </header>

      <div className="totals-cards">
        <article className="total-card total-card--income">
          <span>Receitas gerais</span>
          <strong>
            {formatarValor(dados.totalGeral.totalReceitas)}
          </strong>
        </article>

        <article className="total-card total-card--expense">
          <span>Despesas gerais</span>
          <strong>
            {formatarValor(dados.totalGeral.totalDespesas)}
          </strong>
        </article>

        <article className="total-card total-card--balance">
          <span>Saldo líquido</span>
          <strong>
            {formatarValor(dados.totalGeral.saldoLiquido)}
          </strong>
        </article>
      </div>

      <div className="totals-table">
        <h2>Resumo das pessoas</h2>

        {dados.pessoas.length === 0 ? (
          <p>Nenhuma pessoa cadastrada.</p>
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
              {dados.pessoas.map((pessoa) => (
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

            <tfoot>
              <tr>
                <td>Total geral</td>

                <td>
                  {formatarValor(
                    dados.totalGeral.totalReceitas,
                  )}
                </td>

                <td>
                  {formatarValor(
                    dados.totalGeral.totalDespesas,
                  )}
                </td>

                <td>
                  {formatarValor(
                    dados.totalGeral.saldoLiquido,
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </section>
  )
}

export default Totais