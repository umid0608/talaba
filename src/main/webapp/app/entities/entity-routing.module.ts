import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'talaba',
        data: { pageTitle: 'talabaApp.talaba.home.title' },
        loadChildren: () => import('./talaba/talaba.module').then(m => m.TalabaModule),
      },
      {
        path: 'guruh',
        data: { pageTitle: 'talabaApp.guruh.home.title' },
        loadChildren: () => import('./guruh/guruh.module').then(m => m.GuruhModule),
      },
      {
        path: 'yunalish',
        data: { pageTitle: 'talabaApp.yunalish.home.title' },
        loadChildren: () => import('./yunalish/yunalish.module').then(m => m.YunalishModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
