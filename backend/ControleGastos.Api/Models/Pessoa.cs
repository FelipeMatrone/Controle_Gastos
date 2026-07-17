using System.ComponentModel.DataAnnotations;
namespace ControleGastos.Api.Models;

// Guarda os dados basicos de uma pessoa cadastrada no sistema.
// Essa pessoa podera ter receitas e despesas relacionadas a ela.
public class Pessoa
{
    // O Entity Framework entende que a propriedade Id é a chave da tabela.
    // O valor sera criado automaticamente pelo banco ao salvar uma pessoa.
    public int Id { get; set; }

    [Required(ErrorMessage = "O nome é obrigatório.")]
    [MaxLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    [Range(0, 130, ErrorMessage = "A idade deve estar entre 0 e 130 anos.")]
    public int Idade { get; set; }
}