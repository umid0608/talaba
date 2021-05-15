import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IYunalish } from '../yunalish.model';
import { YunalishService } from '../service/yunalish.service';

@Component({
  templateUrl: './yunalish-delete-dialog.component.html',
})
export class YunalishDeleteDialogComponent {
  yunalish?: IYunalish;

  constructor(protected yunalishService: YunalishService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.yunalishService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
