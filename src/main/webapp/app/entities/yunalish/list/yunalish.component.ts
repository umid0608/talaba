import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IYunalish } from '../yunalish.model';
import { YunalishService } from '../service/yunalish.service';
import { YunalishDeleteDialogComponent } from '../delete/yunalish-delete-dialog.component';

@Component({
  selector: 'jhi-yunalish',
  templateUrl: './yunalish.component.html',
})
export class YunalishComponent implements OnInit {
  yunalishes?: IYunalish[];
  isLoading = false;

  constructor(protected yunalishService: YunalishService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.yunalishService.query().subscribe(
      (res: HttpResponse<IYunalish[]>) => {
        this.isLoading = false;
        this.yunalishes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IYunalish): number {
    return item.id!;
  }

  delete(yunalish: IYunalish): void {
    const modalRef = this.modalService.open(YunalishDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.yunalish = yunalish;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
