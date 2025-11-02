// Toast notification system
const toast = {
  show: (message, type = "info") => {
    const toastContainer = document.getElementById("toast-container")
    if (!toastContainer) return

    const toastEl = document.createElement("div")
    toastEl.className = `toast toast-${type} animate-slide-in`
    toastEl.innerHTML = `
            <div class="flex items-center gap-2">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-auto">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `

    toastContainer.appendChild(toastEl)

    setTimeout(() => {
      toastEl.classList.add("animate-slide-out")
      setTimeout(() => toastEl.remove(), 300)
    }, 3000)
  },
  success: function (message) {
    this.show(message, "success")
  },
  error: function (message) {
    this.show(message, "error")
  },
  info: function (message) {
    this.show(message, "info")
  },
}

// Modal utilities
const modal = {
  open: (modalId) => {
    const modalEl = document.getElementById(modalId)
    if (modalEl) {
      modalEl.classList.remove("hidden")
      document.body.style.overflow = "hidden"
    }
  },
  close: (modalId) => {
    const modalEl = document.getElementById(modalId)
    if (modalEl) {
      modalEl.classList.add("hidden")
      document.body.style.overflow = ""
    }
  },
}

// Debounce utility
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Format date utilities
function formatRelativeDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Şimdi"
  if (diffMins < 60) return `${diffMins} dakika önce`
  if (diffHours < 24) return `${diffHours} saat önce`
  if (diffDays < 7) return `${diffDays} gün önce`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`
  return `${Math.floor(diffDays / 365)} yıl önce`
}
