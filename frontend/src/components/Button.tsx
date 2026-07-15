interface ButtonProps {
  text: string
  type?: 'button' | 'submit'
  color?: 'green' | 'red'
  onClick?: () => void
}

function Button({
  text,
  type = 'button',
  color = 'green',
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`button button--${color}`}
      type={type}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Button