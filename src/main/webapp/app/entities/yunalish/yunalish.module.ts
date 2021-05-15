import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { YunalishComponent } from './list/yunalish.component';
import { YunalishDetailComponent } from './detail/yunalish-detail.component';
import { YunalishUpdateComponent } from './update/yunalish-update.component';
import { YunalishDeleteDialogComponent } from './delete/yunalish-delete-dialog.component';
import { YunalishRoutingModule } from './route/yunalish-routing.module';

@NgModule({
  imports: [SharedModule, YunalishRoutingModule],
  declarations: [YunalishComponent, YunalishDetailComponent, YunalishUpdateComponent, YunalishDeleteDialogComponent],
  entryComponents: [YunalishDeleteDialogComponent],
})
export class YunalishModule {}
