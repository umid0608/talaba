import { IYunalish } from 'app/entities/yunalish/yunalish.model';

export interface IGuruh {
  id?: number;
  nom?: string;
  yil?: number;
  yunalish?: IYunalish;
}

export class Guruh implements IGuruh {
  constructor(public id?: number, public nom?: string, public yil?: number, public yunalish?: IYunalish) {}
}

export function getGuruhIdentifier(guruh: IGuruh): number | undefined {
  return guruh.id;
}
