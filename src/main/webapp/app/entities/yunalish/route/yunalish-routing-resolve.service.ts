import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IYunalish, Yunalish } from '../yunalish.model';
import { YunalishService } from '../service/yunalish.service';

@Injectable({ providedIn: 'root' })
export class YunalishRoutingResolveService implements Resolve<IYunalish> {
  constructor(protected service: YunalishService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IYunalish> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((yunalish: HttpResponse<Yunalish>) => {
          if (yunalish.body) {
            return of(yunalish.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Yunalish());
  }
}
