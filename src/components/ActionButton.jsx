function Button({ onClick, disabled, variant = 'primary', type = 'button', children }) {
  return (
    <button
      type={type}
      className={`button button--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
