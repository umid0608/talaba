import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IYunalish } from '../yunalish.model';

@Component({
  selector: 'jhi-yunalish-detail',
  templateUrl: './yunalish-detail.component.html',
})
export class YunalishDetailComponent implements OnInit {
  yunalish: IYunalish | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ yunalish }) => {
      this.yunalish = yunalish;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
