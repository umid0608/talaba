import * as dayjs from 'dayjs';
import { IGuruh } from 'app/entities/guruh/guruh.model';

export interface ITalaba {
  id?: number;
  ism?: string;
  familiya?: string | null;
  sharif?: string | null;
  tugilganKun?: dayjs.Dayjs | null;
  guruh?: IGuruh;
}

export class Talaba implements ITalaba {
  constructor(
    public id?: number,
    public ism?: string,
    public familiya?: string | null,
    public sharif?: string | null,
    public tugilganKun?: dayjs.Dayjs | null,
    public guruh?: IGuruh
  ) {}
}

export function getTalabaIdentifier(talaba: ITalaba): number | undefined {
  return talaba.id;
}
