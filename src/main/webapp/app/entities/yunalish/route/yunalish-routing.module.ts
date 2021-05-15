import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { YunalishComponent } from '../list/yunalish.component';
import { YunalishDetailComponent } from '../detail/yunalish-detail.component';
import { YunalishUpdateComponent } from '../update/yunalish-update.component';
import { YunalishRoutingResolveService } from './yunalish-routing-resolve.service';

const yunalishRoute: Routes = [
  {
    path: '',
    component: YunalishComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: YunalishDetailComponent,
    resolve: {
      yunalish: YunalishRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: YunalishUpdateComponent,
    resolve: {
      yunalish: YunalishRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: YunalishUpdateComponent,
    resolve: {
      yunalish: YunalishRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(yunalishRoute)],
  exports: [RouterModule],
})
export class YunalishRoutingModule {}
