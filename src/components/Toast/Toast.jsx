import React, { useEffect, useMemo } from 'react'
import './Toast.css'

const Toast = ({ message, type = 'info', isVisible, onClose }) => {
  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [isVisible, onClose])

  const toastIcon = useMemo(() => {
    switch (type) {
      case 'success': return '✓'
      case 'remove': return '✖'
      case 'info': return 'ℹ'
      default: return 'ℹ'
    }
  }, [type])

  if (!isVisible) return null

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-visible' : ''}`}>
      <div className="toast-content">
        <span className="toast-icon">{toastIcon}</span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  )
}

export default Toast