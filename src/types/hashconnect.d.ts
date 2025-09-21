declare module 'hashconnect' {
  export class HashConnect {
    constructor();
    init(): Promise<any>;
    connect(): Promise<any>;
  }
}
