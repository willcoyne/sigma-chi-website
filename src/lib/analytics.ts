// Privacy-respecting, opt-in analytics scaffold.
//
// This intentionally does nothing unless the site is explicitly configured to
// use it. To enable real analytics, set VITE_PLAUSIBLE_DOMAIN (e.g. in a
// `.env.local` file or your host's environment variable settings) to the
// domain registered with Plausible (https://plausible.io) - a free account
// covers small sites. No script is loaded and no third-party request is made
// until that variable is set, so by default (no Plausible account yet) this
// module is a true no-op.
export function initAnalytics(): void {
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN

  if (!domain) {
    return
  }

  const script = document.createElement('script')
  script.defer = true
  script.dataset.domain = domain
  script.src = 'https://plausible.io/js/script.js'
  document.head.appendChild(script)
}
