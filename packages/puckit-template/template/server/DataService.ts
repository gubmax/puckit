export class DataService {
  static async getData(): Promise<string> {
    return 'This text from the server appears before the bundle is loaded!'
  }
}
