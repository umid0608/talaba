import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GuruhComponent } from '../list/guruh.component';
import { GuruhDetailComponent } from '../detail/guruh-detail.component';
import { GuruhUpdateComponent } from '../update/guruh-update.component';
import { GuruhRoutingResolveService } from './guruh-routing-resolve.service';

const guruhRoute: Routes = [
  {
    path: '',
    component: GuruhComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GuruhDetailComponent,
    resolve: {
      guruh: GuruhRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GuruhUpdateComponent,
    resolve: {
      guruh: GuruhRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GuruhUpdateComponent,
    resolve: {
      guruh: GuruhRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(guruhRoute)],
  exports: [RouterModule],
})
export class GuruhRoutingModule {}
