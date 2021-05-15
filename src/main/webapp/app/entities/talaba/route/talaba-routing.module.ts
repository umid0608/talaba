import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TalabaComponent } from '../list/talaba.component';
import { TalabaDetailComponent } from '../detail/talaba-detail.component';
import { TalabaUpdateComponent } from '../update/talaba-update.component';
import { TalabaRoutingResolveService } from './talaba-routing-resolve.service';

const talabaRoute: Routes = [
  {
    path: '',
    component: TalabaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TalabaDetailComponent,
    resolve: {
      talaba: TalabaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TalabaUpdateComponent,
    resolve: {
      talaba: TalabaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TalabaUpdateComponent,
    resolve: {
      talaba: TalabaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(talabaRoute)],
  exports: [RouterModule],
})
export class TalabaRoutingModule {}
