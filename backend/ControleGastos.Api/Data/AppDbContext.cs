using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Data;

// Faz a comunicacao entre as classes do sistema e o banco de dados.
// Cada DbSet representa uma tabela que sera criada no SQLite.
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // Representa a tabela de pessoas dentro do banco.
    public DbSet<Pessoa> Pessoas { get; set; }

    // Representa a tabela de transacoes dentro do banco.
    public DbSet<Transacao> Transacoes { get; set; }

    // Configura o relacionamento entre transacoes e pessoas.
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Transacao>()
            .HasOne(transacao => transacao.Pessoa)
            .WithMany()
            .HasForeignKey(transacao => transacao.PessoaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}