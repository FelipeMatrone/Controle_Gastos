using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Models;

// Guarda uma receita ou despesa relacionada a uma pessoa.
public class Transacao
{
    // O banco cria o identificador automaticamente.
    public int Id { get; set; }

    [Required(ErrorMessage = "A descricao e obrigatoria.")]
    [MaxLength(200, ErrorMessage = "A descricao deve ter no maximo 200 caracteres.")]
    public string Descricao { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
    public decimal Valor { get; set; }

    public TipoTransacao Tipo { get; set; }

    // Guarda o identificador da pessoa relacionada.
    public int PessoaId { get; set; }

    // Permite acessar os dados da pessoa relacionada.
    public Pessoa? Pessoa { get; set; }
}