interface DeleteButtonProps {
  onClick: () => void
  ariaLabel: string
}

// Botao global de exclusao que pode ser usado em qualquer lista do sistema.
// A pagina que usa o componente decide qual item sera excluido.
function DeleteButton({ onClick, ariaLabel }: DeleteButtonProps) {
  return (
    <button
      className="delete-button"
      type="button"
      onClick={onClick}
      title="Excluir"
      aria-label={ariaLabel}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 7H20" />
        <path d="M9 7V4H15V7" />
        <path d="M6 7L7 20H17L18 7" />
        <path d="M10 11V16" />
        <path d="M14 11V16" />
      </svg>
    </button>
  )
}

export default DeleteButton
