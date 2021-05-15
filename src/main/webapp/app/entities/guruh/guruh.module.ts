import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { GuruhComponent } from './list/guruh.component';
import { GuruhDetailComponent } from './detail/guruh-detail.component';
import { GuruhUpdateComponent } from './update/guruh-update.component';
import { GuruhDeleteDialogComponent } from './delete/guruh-delete-dialog.component';
import { GuruhRoutingModule } from './route/guruh-routing.module';

@NgModule({
  imports: [SharedModule, GuruhRoutingModule],
  declarations: [GuruhComponent, GuruhDetailComponent, GuruhUpdateComponent, GuruhDeleteDialogComponent],
  entryComponents: [GuruhDeleteDialogComponent],
})
export class GuruhModule {}
