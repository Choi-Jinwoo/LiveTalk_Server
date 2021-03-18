abstract class Random {
  constructor(
    private readonly length: number,
  ) { }

  abstract rand(): string;
}

export class CharRandom extends Random {
  constructor(length: number) {
    super(length);
  }

  rand(): string {
    let code = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (let i = 0; i < length; i += 1) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
  }
}

export class NumberRandom extends Random {
  constructor(length: number) {
    super(length);
  }

  rand(): string {
    let code = '';
    const characters = '0123456789';
    var charactersLength = characters.length;

    for (let i = 0; i < length; i += 1) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
  }
}