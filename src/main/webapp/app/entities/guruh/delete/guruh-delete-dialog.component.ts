import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGuruh } from '../guruh.model';
import { GuruhService } from '../service/guruh.service';

@Component({
  templateUrl: './guruh-delete-dialog.component.html',
})
export class GuruhDeleteDialogComponent {
  guruh?: IGuruh;

  constructor(protected guruhService: GuruhService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.guruhService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
