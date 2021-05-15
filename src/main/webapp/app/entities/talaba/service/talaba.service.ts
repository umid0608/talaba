import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITalaba, getTalabaIdentifier } from '../talaba.model';

export type EntityResponseType = HttpResponse<ITalaba>;
export type EntityArrayResponseType = HttpResponse<ITalaba[]>;

@Injectable({ providedIn: 'root' })
export class TalabaService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/talabas');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(talaba: ITalaba): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(talaba);
    return this.http
      .post<ITalaba>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(talaba: ITalaba): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(talaba);
    return this.http
      .put<ITalaba>(`${this.resourceUrl}/${getTalabaIdentifier(talaba) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(talaba: ITalaba): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(talaba);
    return this.http
      .patch<ITalaba>(`${this.resourceUrl}/${getTalabaIdentifier(talaba) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITalaba>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITalaba[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTalabaToCollectionIfMissing(talabaCollection: ITalaba[], ...talabasToCheck: (ITalaba | null | undefined)[]): ITalaba[] {
    const talabas: ITalaba[] = talabasToCheck.filter(isPresent);
    if (talabas.length > 0) {
      const talabaCollectionIdentifiers = talabaCollection.map(talabaItem => getTalabaIdentifier(talabaItem)!);
      const talabasToAdd = talabas.filter(talabaItem => {
        const talabaIdentifier = getTalabaIdentifier(talabaItem);
        if (talabaIdentifier == null || talabaCollectionIdentifiers.includes(talabaIdentifier)) {
          return false;
        }
        talabaCollectionIdentifiers.push(talabaIdentifier);
        return true;
      });
      return [...talabasToAdd, ...talabaCollection];
    }
    return talabaCollection;
  }

  protected convertDateFromClient(talaba: ITalaba): ITalaba {
    return Object.assign({}, talaba, {
      tugilganKun: talaba.tugilganKun?.isValid() ? talaba.tugilganKun.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.tugilganKun = res.body.tugilganKun ? dayjs(res.body.tugilganKun) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((talaba: ITalaba) => {
        talaba.tugilganKun = talaba.tugilganKun ? dayjs(talaba.tugilganKun) : undefined;
      });
    }
    return res;
  }
}
