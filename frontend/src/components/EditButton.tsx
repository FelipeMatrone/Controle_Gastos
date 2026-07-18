interface EditButtonProps {
  onClick: () => void
  ariaLabel: string
}

// Botao global de edicao que pode ser usado em qualquer lista do sistema.
function EditButton({ onClick, ariaLabel }: EditButtonProps) {
  return (
    <button
      className="edit-button"
      type="button"
      onClick={onClick}
      title="Editar"
      aria-label={ariaLabel}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 20L8 19L19 8L16 5L5 16L4 20Z" />
        <path d="M14 7L17 10" />
      </svg>
    </button>
  )
}

export default EditButton
