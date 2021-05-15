import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITalaba } from '../talaba.model';
import { TalabaService } from '../service/talaba.service';
import { TalabaDeleteDialogComponent } from '../delete/talaba-delete-dialog.component';

@Component({
  selector: 'jhi-talaba',
  templateUrl: './talaba.component.html',
})
export class TalabaComponent implements OnInit {
  talabas?: ITalaba[];
  isLoading = false;

  constructor(protected talabaService: TalabaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.talabaService.query().subscribe(
      (res: HttpResponse<ITalaba[]>) => {
        this.isLoading = false;
        this.talabas = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITalaba): number {
    return item.id!;
  }

  delete(talaba: ITalaba): void {
    const modalRef = this.modalService.open(TalabaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.talaba = talaba;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
