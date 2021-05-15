import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITalaba } from '../talaba.model';
import { TalabaService } from '../service/talaba.service';

@Component({
  templateUrl: './talaba-delete-dialog.component.html',
})
export class TalabaDeleteDialogComponent {
  talaba?: ITalaba;

  constructor(protected talabaService: TalabaService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.talabaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
