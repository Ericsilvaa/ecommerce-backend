declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    SECRET_KEY: string;
    BASE_URL_ADMIN: string
    BASE_URL_AMBASSADOR: string
  }
}