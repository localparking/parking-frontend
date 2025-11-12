const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

let isInitialized = false
let scriptAppended = false

function isBrowser() {
  return typeof window !== 'undefined'
}

function appendGaScript() {
  if (scriptAppended || !isBrowser() || !GA_MEASUREMENT_ID) {
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)
  scriptAppended = true
}

export function initializeGA() {
  if (!isBrowser() || !GA_MEASUREMENT_ID || isInitialized) {
    return
  }

  appendGaScript()

  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer?.push(args)
    }

  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
  })

  isInitialized = true
}

function normalizePath(path: string) {
  if (path.startsWith('http')) {
    try {
      const url = new URL(path)
      return `${url.pathname}${url.search}${url.hash}`
    } catch (error) {
      console.warn('[GA] Failed to parse URL for page path', error)
    }
  }
  return path
}

export function trackPageView(path: string) {
  if (!isBrowser() || !GA_MEASUREMENT_ID || !window.gtag) {
    return
  }

  const pagePath = normalizePath(path)
  const pageLocation = path.startsWith('http')
    ? path
    : `${window.location.origin}${pagePath}`

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: pagePath,
    page_location: pageLocation,
  })
}
