export class Page {

  constructor(
    private readonly skip: number,
    private readonly take: number,
  ) { }

  get offset() {
    return this.take * this.skip;
  }

  get limit() {
    return this.take;
  }
}