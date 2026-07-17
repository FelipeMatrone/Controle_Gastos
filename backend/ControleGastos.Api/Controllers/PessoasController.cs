using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;


// Recebe as requisicoes relacionadas ao cadastro de pessoas.
// Aqui ficam as operacoes de criar, listar e excluir.

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly AppDbContext _context;

    public PessoasController(AppDbContext context)
    {
        _context = context;
    }


    // Salva uma nova pessoa no banco.
    // O Id nao precisa ser enviado, pois sera criado automaticamente.

    [HttpPost]
    public async Task<ActionResult<Pessoa>> Cadastrar(Pessoa pessoa)
    {
        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        return Created($"/api/pessoas/{pessoa.Id}", pessoa);
    }

    // Busca todas as pessoas cadastradas.
    // A lista e ordenada pelo nome para facilitar a consulta.

    [HttpGet]
    public async Task<ActionResult<List<Pessoa>>> Listar()
    {
        var pessoas = await _context.Pessoas
            .OrderBy(pessoa => pessoa.Nome)
            .ToListAsync();

        return Ok(pessoas);
    }


    // Exclui uma pessoa usando o Id informado na URL.

    [HttpDelete("{id}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);

        if (pessoa == null)
        {
            return NotFound("Pessoa nao encontrada.");
        }

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Atualiza os dados de uma pessoa que ja existe.
    // O Id recebido pela URL indica qual pessoa sera alterada.

    [HttpPut("{id}")]
    public async Task<IActionResult> Editar(int id, Pessoa pessoaAtualizada)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);

        if (pessoa == null)
        {
            return NotFound("Pessoa nao encontrada.");
        }

        // Copia para o registro atual os novos dados recebidos.
        pessoa.Nome = pessoaAtualizada.Nome;
        pessoa.Idade = pessoaAtualizada.Idade;
        pessoa.DataNascimento = pessoaAtualizada.DataNascimento;
        pessoa.Email = pessoaAtualizada.Email;
        pessoa.Telefone = pessoaAtualizada.Telefone;

        await _context.SaveChangesAsync();

        return Ok(pessoa);
    }

}