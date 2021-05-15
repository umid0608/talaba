import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGuruh } from '../guruh.model';
import { GuruhService } from '../service/guruh.service';
import { GuruhDeleteDialogComponent } from '../delete/guruh-delete-dialog.component';

@Component({
  selector: 'jhi-guruh',
  templateUrl: './guruh.component.html',
})
export class GuruhComponent implements OnInit {
  guruhs?: IGuruh[];
  isLoading = false;

  constructor(protected guruhService: GuruhService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.guruhService.query().subscribe(
      (res: HttpResponse<IGuruh[]>) => {
        this.isLoading = false;
        this.guruhs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IGuruh): number {
    return item.id!;
  }

  delete(guruh: IGuruh): void {
    const modalRef = this.modalService.open(GuruhDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.guruh = guruh;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
