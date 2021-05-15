import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TalabaComponent } from './list/talaba.component';
import { TalabaDetailComponent } from './detail/talaba-detail.component';
import { TalabaUpdateComponent } from './update/talaba-update.component';
import { TalabaDeleteDialogComponent } from './delete/talaba-delete-dialog.component';
import { TalabaRoutingModule } from './route/talaba-routing.module';

@NgModule({
  imports: [SharedModule, TalabaRoutingModule],
  declarations: [TalabaComponent, TalabaDetailComponent, TalabaUpdateComponent, TalabaDeleteDialogComponent],
  entryComponents: [TalabaDeleteDialogComponent],
})
export class TalabaModule {}
