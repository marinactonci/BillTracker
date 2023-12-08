interface ImportMetaEnv {
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
