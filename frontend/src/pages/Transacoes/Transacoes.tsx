import { useEffect, useState } from 'react'
import Button from '../../components/Button'

interface Pessoa {
  id: number
  nome: string
  idade: number
}

interface Transacao {
  id: number
  descricao: string
  valor: number
  tipo: number
  pessoaId: number
  pessoa: Pessoa | null
}

function Transacoes() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [transacoes, setTransacoes] = useState<Transacao[]>([])

  const [pessoaSelecionada, setPessoaSelecionada] =
    useState<Pessoa | null>(null)

  const [pessoaMarcada, setPessoaMarcada] =
    useState<Pessoa | null>(null)

  const [modalAberto, setModalAberto] = useState(false)
  const [pesquisa, setPesquisa] = useState('')

  const [tipo, setTipo] = useState(0)
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // Busca as pessoas e as transacoes quando a pagina for aberta.
  useEffect(() => {
    async function carregarDados() {
      try {
        const respostaPessoas = await fetch(
          'http://localhost:5114/api/Pessoas',
        )

        const respostaTransacoes = await fetch(
          'http://localhost:5114/api/Transacoes',
        )

        if (!respostaPessoas.ok || !respostaTransacoes.ok) {
          throw new Error('Nao foi possivel carregar os dados.')
        }

        const dadosPessoas: Pessoa[] =
          await respostaPessoas.json()

        const dadosTransacoes: Transacao[] =
          await respostaTransacoes.json()

        setPessoas(dadosPessoas)
        setTransacoes(dadosTransacoes)
      } catch (erro) {
        console.error(erro)
        setErro('Ocorreu um erro ao carregar os dados.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  const pessoasFiltradas = pessoas.filter((pessoa) =>
    pessoa.nome.toLowerCase().includes(pesquisa.toLowerCase()),
  )

  const pessoaMenorDeIdade =
    pessoaSelecionada !== null &&
    pessoaSelecionada.idade < 18

  function abrirModal() {
    setPessoaMarcada(pessoaSelecionada)
    setPesquisa('')
    setModalAberto(true)
  }

  function fecharModal() {
    setPessoaMarcada(null)
    setPesquisa('')
    setModalAberto(false)
  }

  function selecionarPessoa() {
    if (!pessoaMarcada) {
      alert('Selecione uma pessoa.')
      return
    }

    setPessoaSelecionada(pessoaMarcada)

    // Se a pessoa for menor, o tipo volta automaticamente para despesa.
    if (pessoaMarcada.idade < 18) {
      setTipo(0)
    }

    setModalAberto(false)
    setPesquisa('')
  }

  // Envia a nova transacao para a API.
  async function cadastrarTransacao(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!pessoaSelecionada) {
      alert('Selecione uma pessoa.')
      return
    }

    const novaTransacao = {
      descricao,
      valor: Number(valor),
      tipo,
      pessoaId: pessoaSelecionada.id,
    }

    try {
      const resposta = await fetch(
        'http://localhost:5114/api/Transacoes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novaTransacao),
        },
      )

      if (!resposta.ok) {
        throw new Error('Nao foi possivel cadastrar a transacao.')
      }

      const transacaoCadastrada: Transacao =
        await resposta.json()

      // O POST nao precisa retornar toda a pessoa.
      // Por isso adicionamos a pessoa selecionada na lista da tela.
      setTransacoes((listaAtual) => [
        {
          ...transacaoCadastrada,
          pessoa: pessoaSelecionada,
        },
        ...listaAtual,
      ])

      setDescricao('')
      setValor('')
      setTipo(0)

      alert('Transação cadastrada com sucesso!')
    } catch (erro) {
      console.error(erro)
      alert('Ocorreu um erro ao cadastrar a transação.')
    }
  }

  function formatarValor(valor: number) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  if (carregando) {
    return <p>Carregando transações...</p>
  }

  if (erro) {
    return <p>{erro}</p>
  }

  return (
    <section className="transactions-page">
      <header className="transactions-page__header">
        <span>TRANSAÇÕES</span>
        <h1>Controle de transações</h1>
        <p>Cadastre e consulte as receitas e despesas.</p>
      </header>

      <form
        className="transaction-form"
        onSubmit={cadastrarTransacao}
      >
        <div className="transaction-field transaction-field--full">
          <label htmlFor="pessoa">Pessoa</label>

          <div className="person-search">
            <input
              id="pessoa"
              type="text"
              value={
                pessoaSelecionada
                  ? `${pessoaSelecionada.nome} - ${pessoaSelecionada.idade} anos`
                  : ''
              }
              placeholder="Selecione uma pessoa"
              readOnly
              required
            />

            <button
              type="button"
              onClick={abrirModal}
              title="Pesquisar pessoa"
              aria-label="Pesquisar pessoa"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M16 16L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <fieldset className="transaction-type">
          <legend>Tipo da transação</legend>

          <label>
            <input
              type="radio"
              name="tipo"
              value={0}
              checked={tipo === 0}
              onChange={() => setTipo(0)}
            />
            Despesa
          </label>

          <label
            className={
              pessoaMenorDeIdade
                ? 'transaction-type__disabled'
                : ''
            }
          >
            <input
              type="radio"
              name="tipo"
              value={1}
              checked={tipo === 1}
              onChange={() => setTipo(1)}
              disabled={pessoaMenorDeIdade}
            />
            Receita
          </label>
        </fieldset>

        {pessoaMenorDeIdade && (
          <p className="minor-warning">
            Pessoas menores de 18 anos podem cadastrar somente
            despesas.
          </p>
        )}

        <div className="transaction-field">
          <label htmlFor="descricao">Descrição</label>
          <input
            id="descricao"
            type="text"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            placeholder="Ex.: Conta de energia"
            maxLength={200}
            required
          />
        </div>

        <div className="transaction-field">
          <label htmlFor="valor">Valor</label>
          <input
            id="valor"
            type="number"
            value={valor}
            onChange={(event) => setValor(event.target.value)}
            placeholder="0,00"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="transaction-form__actions">
          <Button
            text="Cadastrar transação"
            type="submit"
          />
        </div>
      </form>

      <div className="transactions-list">
        <h2>Transações cadastradas</h2>

        {transacoes.length === 0 ? (
          <p>Nenhuma transação cadastrada.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th>Pessoa</th>
              </tr>
            </thead>

            <tbody>
              {transacoes.map((transacao) => (
                <tr key={transacao.id}>
                  <td>{transacao.descricao}</td>
                  <td>{formatarValor(transacao.valor)}</td>
                  <td>
                    <span
                      className={
                        transacao.tipo === 0
                          ? 'transaction-badge transaction-badge--expense'
                          : 'transaction-badge transaction-badge--income'
                      }
                    >
                      {transacao.tipo === 0
                        ? 'Despesa'
                        : 'Receita'}
                    </span>
                  </td>
                  <td>
                    {transacao.pessoa?.nome || 'Pessoa não encontrada'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="person-modal">
            <header className="person-modal__header">
              <div>
                <h2>Selecionar pessoa</h2>
                <p>Pesquise e escolha uma pessoa cadastrada.</p>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                aria-label="Fechar modal"
              >
                ×
              </button>
            </header>

            <input
              className="person-modal__search"
              type="text"
              value={pesquisa}
              onChange={(event) => setPesquisa(event.target.value)}
              placeholder="Pesquisar pelo nome"
              autoFocus
            />

            <div className="person-modal__list">
              {pessoasFiltradas.length === 0 ? (
                <p>Nenhuma pessoa encontrada.</p>
              ) : (
                pessoasFiltradas.map((pessoa) => (
                  <label
                    className="person-option"
                    key={pessoa.id}
                  >
                    <input
                      type="radio"
                      name="pessoa"
                      checked={pessoaMarcada?.id === pessoa.id}
                      onChange={() => setPessoaMarcada(pessoa)}
                    />

                    <span>{pessoa.nome}</span>
                    <small>{pessoa.idade} anos</small>
                  </label>
                ))
              )}
            </div>

            <div className="person-modal__actions">
              <button
                className="button button--red"
                type="button"
                onClick={fecharModal}
              >
                Cancelar
              </button>

              <button
                className="button button--green"
                type="button"
                onClick={selecionarPessoa}
              >
                Selecionar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Transacoes