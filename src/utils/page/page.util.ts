export class Page {

  constructor(
    private readonly page: number,
    private readonly take: number,
  ) { }

  get offset() {
    return this.take * this.page;
  }

  get limit() {
    return this.take;
  }
}