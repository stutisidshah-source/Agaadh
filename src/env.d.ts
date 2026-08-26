/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOCK_ANALYSIS_DUR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
