/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public https URL of a form service (e.g. a Formspree endpoint). Optional; see lib/contact.ts. */
  readonly VITE_CONTACT_ENDPOINT?: string
  /** Public address of the deployed site, used for absolute social-sharing URLs. Optional. */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
