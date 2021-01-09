/// <reference types="modern-app-scripts" />

declare global {
  namespace NodeJS {
    interface Global {
      fetch: any
    }
  }
}
