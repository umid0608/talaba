import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGuruh, Guruh } from '../guruh.model';
import { GuruhService } from '../service/guruh.service';

@Injectable({ providedIn: 'root' })
export class GuruhRoutingResolveService implements Resolve<IGuruh> {
  constructor(protected service: GuruhService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGuruh> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((guruh: HttpResponse<Guruh>) => {
          if (guruh.body) {
            return of(guruh.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Guruh());
  }
}
