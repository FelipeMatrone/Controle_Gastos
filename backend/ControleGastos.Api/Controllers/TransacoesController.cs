using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

// Recebe as requisicoes relacionadas ao cadastro de transacoes.
[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

    // Cadastra uma nova receita ou despesa.
    [HttpPost]
    public async Task<ActionResult<Transacao>> Cadastrar(
        Transacao transacao
    )
    {
        // Confirma que a pessoa informada realmente existe.
        var pessoa = await _context.Pessoas.FindAsync(
            transacao.PessoaId
        );

        if (pessoa == null)
        {
            return BadRequest("A pessoa informada nao existe.");
        }

        // Pessoas menores de idade podem cadastrar somente despesas.
        if (
            pessoa.Idade < 18 &&
            transacao.Tipo == TipoTransacao.Receita
        )
        {
            return BadRequest(
                "Pessoas menores de 18 anos nao podem ter receitas."
            );
        }

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        return Created(
            $"/api/transacoes/{transacao.Id}",
            transacao
        );
    }

    // Lista as transacoes e inclui os dados da pessoa relacionada.
    [HttpGet]
    public async Task<ActionResult<List<Transacao>>> Listar()
    {
        var transacoes = await _context.Transacoes
            .Include(transacao => transacao.Pessoa)
            .OrderByDescending(transacao => transacao.Id)
            .ToListAsync();

        return Ok(transacoes);
    }
}