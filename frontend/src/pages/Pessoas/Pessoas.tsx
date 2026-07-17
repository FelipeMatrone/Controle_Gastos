import { useState } from 'react'
import Button from '../../components/Button'

function Pessoas() {
  // Cada estado guarda o valor atual de um campo do formulario.
  // Quando o usuario digita, a funcao set correspondente atualiza o valor.
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  // Calcula a idade usando a data de nascimento informada.
  // A funcao retorna vazio enquanto nenhuma data estiver selecionada.
  function calcularIdade(data: string) {
    if (!data) {
      return ''
    }

    // O horario e adicionado para evitar diferencas causadas pelo fuso horario.
    const nascimento = new Date(`${data}T00:00:00`)
    const hoje = new Date()

    let idade = hoje.getFullYear() - nascimento.getFullYear()

    // Verifica se o aniversario da pessoa ainda nao aconteceu neste ano.
    const aindaNaoFezAniversario =
      hoje.getMonth() < nascimento.getMonth() ||
      (
        hoje.getMonth() === nascimento.getMonth() &&
        hoje.getDate() < nascimento.getDate()
      )

    // Se o aniversario ainda nao aconteceu, retira um ano da idade.
    if (aindaNaoFezAniversario) {
      idade--
    }

    return idade
  }

  // A idade e recalculada sempre que a data de nascimento mudar.
  const idade = calcularIdade(dataNascimento)

  // Envia os dados do formulario para a API.
  async function cadastrarPessoa(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    // Impede que o navegador recarregue a pagina ao enviar o formulario.
    event.preventDefault()

    // Monta o objeto no mesmo formato esperado pelo backend.
    // Campos opcionais vazios sao enviados como null.
    const pessoa = {
      nome,
      dataNascimento,
      idade,
      email: email || null,
      telefone: telefone || null,
    }

    try {
      // Envia a pessoa para o endpoint de cadastro da API.
      const resposta = await fetch('http://localhost:5114/api/Pessoas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pessoa),
      })

      // O fetch nao gera erro automaticamente quando a API retorna
      // respostas como 400 ou 500, por isso verificamos o status.
      if (!resposta.ok) {
        throw new Error('Nao foi possivel cadastrar a pessoa.')
      }

      alert('Pessoa cadastrada com sucesso!')

      // Limpa os campos somente depois que a API confirma o cadastro.
      setNome('')
      setDataNascimento('')
      setEmail('')
      setTelefone('')
    } catch (erro) {
      // Este bloco tambem trata casos em que a API estiver desligada.
      console.error(erro)
      alert('Ocorreu um erro ao cadastrar a pessoa.')
    }
  }

  return (
    <section className="people-page">
      <header className="people-page__header">
        <span>CADASTRO</span>
        <h1>Cadastro de pessoa</h1>
        <p>Preencha os dados para cadastrar uma nova pessoa.</p>
      </header>

      {/* Ao enviar o formulario, a funcao cadastrarPessoa e executada. */}
      <form className="people-form" onSubmit={cadastrarPessoa}>
        <div className="form-field form-field--full">
          <label htmlFor="nome">
            Nome <span className="required">*</span>
          </label>

          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Digite o nome completo"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="dataNascimento">
            Data de nascimento <span className="required">*</span>
          </label>

          <input
            id="dataNascimento"
            type="date"
            value={dataNascimento}
            onChange={(event) => setDataNascimento(event.target.value)}
            // Impede que o usuario escolha uma data futura.
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="idade">Idade</label>

          <input
            id="idade"
            type="text"
            value={idade === '' ? '' : `${idade} anos`}
            placeholder="Calculada automaticamente"
            // A idade nao pode ser digitada porque vem da data de nascimento.
            readOnly
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">E-mail</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="exemplo@email.com"
          />
        </div>

        <div className="form-field">
          <label htmlFor="telefone">Telefone</label>

          <input
            id="telefone"
            type="tel"
            value={telefone}
            onChange={(event) => setTelefone(event.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="form-actions">
          <Button
            text="Cadastrar pessoa"
            type="submit"
          />
        </div>
      </form>
    </section>
  )
}

export default Pessoas