import { useState, useCallback } from 'react'

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    const newToast = { id, message, type, isVisible: true }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }, [])

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return { toasts, showToast, hideToast }
}

export default useToast