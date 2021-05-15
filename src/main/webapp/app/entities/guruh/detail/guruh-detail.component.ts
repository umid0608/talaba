import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGuruh } from '../guruh.model';

@Component({
  selector: 'jhi-guruh-detail',
  templateUrl: './guruh-detail.component.html',
})
export class GuruhDetailComponent implements OnInit {
  guruh: IGuruh | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ guruh }) => {
      this.guruh = guruh;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
