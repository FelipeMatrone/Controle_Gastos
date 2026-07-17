import { useEffect, useState } from 'react'
import DeleteButton from '../../components/DeleteButton'

interface Pessoa {
  id: number
  nome: string
  idade: number
  dataNascimento: string
  email: string | null
  telefone: string | null
}

function ListarPessoas() {
  // Guarda as pessoas recebidas da API.
  const [pessoas, setPessoas] = useState<Pessoa[]>([])

  // Controla as mensagens exibidas enquanto a requisicao acontece.
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // Executa a busca quando a pagina de listagem e aberta.
  useEffect(() => {
    async function buscarPessoas() {
      try {
        const resposta = await fetch(
          'http://localhost:5114/api/Pessoas',
        )

        if (!resposta.ok) {
          throw new Error('Nao foi possivel buscar as pessoas.')
        }

        // Converte a resposta da API para uma lista de pessoas.
        const dados: Pessoa[] = await resposta.json()
        setPessoas(dados)
      } catch (erro) {
        console.error(erro)
        setErro('Ocorreu um erro ao carregar as pessoas.')
      } finally {
        // Finaliza o carregamento tanto em caso de sucesso quanto de erro.
        setCarregando(false)
      }
    }

    buscarPessoas()
  }, [])

  // Exclui a pessoa pela API depois da confirmacao do usuario.
  async function excluirPessoa(id: number, nome: string) {
    const confirmouExclusao = window.confirm(
      `Deseja realmente excluir ${nome}?`,
    )

    if (!confirmouExclusao) {
      return
    }

    try {
      const resposta = await fetch(
        `http://localhost:5114/api/Pessoas/${id}`,
        {
          method: 'DELETE',
        },
      )

      if (!resposta.ok) {
        throw new Error('Nao foi possivel excluir a pessoa.')
      }

      // Atualiza a tela sem precisar buscar toda a lista novamente.
      setPessoas((listaAtual) =>
        listaAtual.filter((pessoa) => pessoa.id !== id),
      )
    } catch (erro) {
      console.error(erro)
      alert('Ocorreu um erro ao excluir a pessoa.')
    }
  }

  if (carregando) {
    return <p>Carregando pessoas...</p>
  }

  if (erro) {
    return <p>{erro}</p>
  }

  return (
    <section className="people-page">
      <header className="people-page__header">
        <span>CONSULTA</span>
        <h1>Pessoas cadastradas</h1>
        <p>Confira as pessoas cadastradas no sistema.</p>
      </header>

      {pessoas.length === 0 ? (
        <p>Nenhuma pessoa cadastrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th>Data de nascimento</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Acoes</th>
            </tr>
          </thead>

          <tbody>
            {pessoas.map((pessoa) => (
              <tr key={pessoa.id}>
                <td>{pessoa.nome}</td>
                <td>{pessoa.idade} anos</td>
                <td>{pessoa.dataNascimento}</td>
                <td>{pessoa.email || 'Não informado'}</td>
                <td>{pessoa.telefone || 'Não informado'}</td>
                <td>
                  <DeleteButton
                    onClick={() =>
                      excluirPessoa(pessoa.id, pessoa.nome)
                    }
                    ariaLabel={`Excluir ${pessoa.nome}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default ListarPessoas
