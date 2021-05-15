import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITalaba } from '../talaba.model';

@Component({
  selector: 'jhi-talaba-detail',
  templateUrl: './talaba-detail.component.html',
})
export class TalabaDetailComponent implements OnInit {
  talaba: ITalaba | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ talaba }) => {
      this.talaba = talaba;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
