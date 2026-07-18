import { useEffect, useState } from 'react'
import DeleteButton from '../../components/DeleteButton'
import EditButton from '../../components/EditButton'

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

  // Guarda a pessoa selecionada enquanto o formulario de edicao esta aberto.
  const [pessoaEmEdicao, setPessoaEmEdicao] = useState<Pessoa | null>(null)

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

  // Calcula novamente a idade quando a data de nascimento for alterada.
  function calcularIdade(data: string) {
    const nascimento = new Date(`${data}T00:00:00`)
    const hoje = new Date()
    let idade = hoje.getFullYear() - nascimento.getFullYear()

    const aindaNaoFezAniversario =
      hoje.getMonth() < nascimento.getMonth() ||
      (
        hoje.getMonth() === nascimento.getMonth() &&
        hoje.getDate() < nascimento.getDate()
      )

    if (aindaNaoFezAniversario) {
      idade--
    }

    return idade
  }

  // Envia para a API os novos dados da pessoa selecionada.
  async function salvarEdicao(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!pessoaEmEdicao) {
      return
    }

    try {
      const resposta = await fetch(
        `http://localhost:5114/api/Pessoas/${pessoaEmEdicao.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pessoaEmEdicao),
        },
      )

      if (!resposta.ok) {
        throw new Error('Nao foi possivel editar a pessoa.')
      }

      const pessoaAtualizada: Pessoa = await resposta.json()

      // Troca somente a pessoa editada dentro da lista atual.
      setPessoas((listaAtual) =>
        listaAtual.map((pessoa) =>
          pessoa.id === pessoaAtualizada.id
            ? pessoaAtualizada
            : pessoa,
        ),
      )

      setPessoaEmEdicao(null)
      alert('Pessoa atualizada com sucesso!')
    } catch (erro) {
      console.error(erro)
      alert('Ocorreu um erro ao editar a pessoa.')
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

      {pessoaEmEdicao && (
        <form className="edit-person-form" onSubmit={salvarEdicao}>
          <h2>Editar pessoa</h2>

          <div className="form-field form-field--full">
            <label htmlFor="edit-nome">Nome</label>
            <input
              id="edit-nome"
              type="text"
              value={pessoaEmEdicao.nome}
              onChange={(event) =>
                setPessoaEmEdicao({
                  ...pessoaEmEdicao,
                  nome: event.target.value,
                })
              }
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="edit-dataNascimento">
              Data de nascimento
            </label>
            <input
              id="edit-dataNascimento"
              type="date"
              value={pessoaEmEdicao.dataNascimento}
              max={new Date().toISOString().split('T')[0]}
              onChange={(event) => {
                const novaData = event.target.value

                setPessoaEmEdicao({
                  ...pessoaEmEdicao,
                  dataNascimento: novaData,
                  idade: calcularIdade(novaData),
                })
              }}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="edit-idade">Idade</label>
            <input
              id="edit-idade"
              type="text"
              value={`${pessoaEmEdicao.idade} anos`}
              readOnly
            />
          </div>

          <div className="form-field">
            <label htmlFor="edit-email">E-mail</label>
            <input
              id="edit-email"
              type="email"
              value={pessoaEmEdicao.email || ''}
              onChange={(event) =>
                setPessoaEmEdicao({
                  ...pessoaEmEdicao,
                  email: event.target.value || null,
                })
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="edit-telefone">Telefone</label>
            <input
              id="edit-telefone"
              type="tel"
              value={pessoaEmEdicao.telefone || ''}
              onChange={(event) =>
                setPessoaEmEdicao({
                  ...pessoaEmEdicao,
                  telefone: event.target.value || null,
                })
              }
            />
          </div>

          <div className="edit-person-form__actions">
            <button
              className="button edit-cancel-button"
              type="button"
              onClick={() => setPessoaEmEdicao(null)}
            >
              Cancelar
            </button>

            <button className="button button--green" type="submit">
              Salvar alteracoes
            </button>
          </div>
        </form>
      )}

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
                  <div className="people-table-actions">
                    <EditButton
                      onClick={() => setPessoaEmEdicao({ ...pessoa })}
                      ariaLabel={`Editar ${pessoa.nome}`}
                    />

                  <DeleteButton
                    onClick={() =>
                      excluirPessoa(pessoa.id, pessoa.nome)
                    }
                    ariaLabel={`Excluir ${pessoa.nome}`}
                  />
                  </div>
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
