declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    SECRET_KEY: string;
    BASE_URL_ADMIN: string
    BASE_URL_AMBASSADOR: string
    STRIPE_SECRET_KEY: string
    CHECKOUT_URL: string
  }
}