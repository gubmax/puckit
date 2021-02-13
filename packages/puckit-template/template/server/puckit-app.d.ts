/// <reference types="@puckit/scripts" />

declare module NodeJS {
  interface Global {
    fetch: any;
  }

  interface Module {
    hot: any;
  }
}
