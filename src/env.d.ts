/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_KEY: string
    // Agrega aquí otras variables de entorno si las necesitas
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}