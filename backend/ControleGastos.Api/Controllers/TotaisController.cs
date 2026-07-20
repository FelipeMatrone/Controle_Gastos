using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

// Calcula os totais de receitas, despesas e saldos do sistema.
[ApiController]
[Route("api/[controller]")]
public class TotaisController : ControllerBase
{
    private readonly AppDbContext _context;

    public TotaisController(AppDbContext context)
    {
        _context = context;
    }

    // Retorna os totais de cada pessoa e o total geral.
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        // Busca os dados antes de realizar os calculos.
        var pessoas = await _context.Pessoas
            .OrderBy(pessoa => pessoa.Nome)
            .ToListAsync();

        var transacoes = await _context.Transacoes
            .ToListAsync();

        // Calcula receitas, despesas e saldo de cada pessoa.
        var totaisPorPessoa = pessoas.Select(pessoa =>
        {
            var transacoesDaPessoa = transacoes
                .Where(transacao =>
                    transacao.PessoaId == pessoa.Id
                );

            var totalReceitas = transacoesDaPessoa
                .Where(transacao =>
                    transacao.Tipo == TipoTransacao.Receita
                )
                .Sum(transacao => transacao.Valor);

            var totalDespesas = transacoesDaPessoa
                .Where(transacao =>
                    transacao.Tipo == TipoTransacao.Despesa
                )
                .Sum(transacao => transacao.Valor);

            return new
            {
                PessoaId = pessoa.Id,
                pessoa.Nome,
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                Saldo = totalReceitas - totalDespesas
            };
        }).ToList();

        // Soma os valores de todas as pessoas.
        var totalGeralReceitas = totaisPorPessoa
            .Sum(total => total.TotalReceitas);

        var totalGeralDespesas = totaisPorPessoa
            .Sum(total => total.TotalDespesas);

        var resultado = new
        {
            Pessoas = totaisPorPessoa,

            TotalGeral = new
            {
                TotalReceitas = totalGeralReceitas,
                TotalDespesas = totalGeralDespesas,
                SaldoLiquido =
                    totalGeralReceitas - totalGeralDespesas
            }
        };

        return Ok(resultado);
    }
}