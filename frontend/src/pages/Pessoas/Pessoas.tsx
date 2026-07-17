import { useState } from 'react'
import Button from '../../components/Button'

function Pessoas() {
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  function calcularIdade(data: string) {
    if (!data) {
      return ''
    }

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

  const idade = calcularIdade(dataNascimento)

  async function cadastrarPessoa(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const pessoa = {
      nome,
      dataNascimento,
      idade,
      email: email || null,
      telefone: telefone || null,
    }

    try {
      const resposta = await fetch('http://localhost:5114/api/Pessoas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pessoa),
      })

      if (!resposta.ok) {
        throw new Error('Nao foi possivel cadastrar a pessoa.')
      }

      alert('Pessoa cadastrada com sucesso!')

      setNome('')
      setDataNascimento('')
      setEmail('')
      setTelefone('')
    } catch (erro) {
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