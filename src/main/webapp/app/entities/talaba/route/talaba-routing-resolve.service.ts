import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITalaba, Talaba } from '../talaba.model';
import { TalabaService } from '../service/talaba.service';

@Injectable({ providedIn: 'root' })
export class TalabaRoutingResolveService implements Resolve<ITalaba> {
  constructor(protected service: TalabaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITalaba> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((talaba: HttpResponse<Talaba>) => {
          if (talaba.body) {
            return of(talaba.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Talaba());
  }
}
