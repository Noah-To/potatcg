function ActionButton({ onClick, disabled, variant = 'primary', type = 'button', children }) {
  return (
    <button
      type={type}
      className={`action-button action-button--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default ActionButton
