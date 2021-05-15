import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IYunalish, getYunalishIdentifier } from '../yunalish.model';

export type EntityResponseType = HttpResponse<IYunalish>;
export type EntityArrayResponseType = HttpResponse<IYunalish[]>;

@Injectable({ providedIn: 'root' })
export class YunalishService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/yunalishes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(yunalish: IYunalish): Observable<EntityResponseType> {
    return this.http.post<IYunalish>(this.resourceUrl, yunalish, { observe: 'response' });
  }

  update(yunalish: IYunalish): Observable<EntityResponseType> {
    return this.http.put<IYunalish>(`${this.resourceUrl}/${getYunalishIdentifier(yunalish) as number}`, yunalish, { observe: 'response' });
  }

  partialUpdate(yunalish: IYunalish): Observable<EntityResponseType> {
    return this.http.patch<IYunalish>(`${this.resourceUrl}/${getYunalishIdentifier(yunalish) as number}`, yunalish, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IYunalish>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IYunalish[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addYunalishToCollectionIfMissing(yunalishCollection: IYunalish[], ...yunalishesToCheck: (IYunalish | null | undefined)[]): IYunalish[] {
    const yunalishes: IYunalish[] = yunalishesToCheck.filter(isPresent);
    if (yunalishes.length > 0) {
      const yunalishCollectionIdentifiers = yunalishCollection.map(yunalishItem => getYunalishIdentifier(yunalishItem)!);
      const yunalishesToAdd = yunalishes.filter(yunalishItem => {
        const yunalishIdentifier = getYunalishIdentifier(yunalishItem);
        if (yunalishIdentifier == null || yunalishCollectionIdentifiers.includes(yunalishIdentifier)) {
          return false;
        }
        yunalishCollectionIdentifiers.push(yunalishIdentifier);
        return true;
      });
      return [...yunalishesToAdd, ...yunalishCollection];
    }
    return yunalishCollection;
  }
}
