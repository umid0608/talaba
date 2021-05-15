export interface IYunalish {
  id?: number;
  nom?: string | null;
  kod?: string | null;
}

export class Yunalish implements IYunalish {
  constructor(public id?: number, public nom?: string | null, public kod?: string | null) {}
}

export function getYunalishIdentifier(yunalish: IYunalish): number | undefined {
  return yunalish.id;
}
