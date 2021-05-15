import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGuruh, getGuruhIdentifier } from '../guruh.model';

export type EntityResponseType = HttpResponse<IGuruh>;
export type EntityArrayResponseType = HttpResponse<IGuruh[]>;

@Injectable({ providedIn: 'root' })
export class GuruhService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/guruhs');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(guruh: IGuruh): Observable<EntityResponseType> {
    return this.http.post<IGuruh>(this.resourceUrl, guruh, { observe: 'response' });
  }

  update(guruh: IGuruh): Observable<EntityResponseType> {
    return this.http.put<IGuruh>(`${this.resourceUrl}/${getGuruhIdentifier(guruh) as number}`, guruh, { observe: 'response' });
  }

  partialUpdate(guruh: IGuruh): Observable<EntityResponseType> {
    return this.http.patch<IGuruh>(`${this.resourceUrl}/${getGuruhIdentifier(guruh) as number}`, guruh, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGuruh>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGuruh[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGuruhToCollectionIfMissing(guruhCollection: IGuruh[], ...guruhsToCheck: (IGuruh | null | undefined)[]): IGuruh[] {
    const guruhs: IGuruh[] = guruhsToCheck.filter(isPresent);
    if (guruhs.length > 0) {
      const guruhCollectionIdentifiers = guruhCollection.map(guruhItem => getGuruhIdentifier(guruhItem)!);
      const guruhsToAdd = guruhs.filter(guruhItem => {
        const guruhIdentifier = getGuruhIdentifier(guruhItem);
        if (guruhIdentifier == null || guruhCollectionIdentifiers.includes(guruhIdentifier)) {
          return false;
        }
        guruhCollectionIdentifiers.push(guruhIdentifier);
        return true;
      });
      return [...guruhsToAdd, ...guruhCollection];
    }
    return guruhCollection;
  }
}
