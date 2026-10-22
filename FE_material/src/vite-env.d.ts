/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASENAME: string;
  // Thêm các biến môi trường khác ở đây
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
