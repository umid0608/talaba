import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITalaba, Talaba } from '../talaba.model';
import { TalabaService } from '../service/talaba.service';
import { IGuruh } from 'app/entities/guruh/guruh.model';
import { GuruhService } from 'app/entities/guruh/service/guruh.service';

@Component({
  selector: 'jhi-talaba-update',
  templateUrl: './talaba-update.component.html',
})
export class TalabaUpdateComponent implements OnInit {
  isSaving = false;

  guruhsSharedCollection: IGuruh[] = [];

  editForm = this.fb.group({
    id: [],
    ism: [null, [Validators.required]],
    familiya: [],
    sharif: [],
    tugilganKun: [],
    guruh: [null, Validators.required],
  });

  constructor(
    protected talabaService: TalabaService,
    protected guruhService: GuruhService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ talaba }) => {
      this.updateForm(talaba);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const talaba = this.createFromForm();
    if (talaba.id !== undefined) {
      this.subscribeToSaveResponse(this.talabaService.update(talaba));
    } else {
      this.subscribeToSaveResponse(this.talabaService.create(talaba));
    }
  }

  trackGuruhById(index: number, item: IGuruh): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITalaba>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(talaba: ITalaba): void {
    this.editForm.patchValue({
      id: talaba.id,
      ism: talaba.ism,
      familiya: talaba.familiya,
      sharif: talaba.sharif,
      tugilganKun: talaba.tugilganKun,
      guruh: talaba.guruh,
    });

    this.guruhsSharedCollection = this.guruhService.addGuruhToCollectionIfMissing(this.guruhsSharedCollection, talaba.guruh);
  }

  protected loadRelationshipsOptions(): void {
    this.guruhService
      .query()
      .pipe(map((res: HttpResponse<IGuruh[]>) => res.body ?? []))
      .pipe(map((guruhs: IGuruh[]) => this.guruhService.addGuruhToCollectionIfMissing(guruhs, this.editForm.get('guruh')!.value)))
      .subscribe((guruhs: IGuruh[]) => (this.guruhsSharedCollection = guruhs));
  }

  protected createFromForm(): ITalaba {
    return {
      ...new Talaba(),
      id: this.editForm.get(['id'])!.value,
      ism: this.editForm.get(['ism'])!.value,
      familiya: this.editForm.get(['familiya'])!.value,
      sharif: this.editForm.get(['sharif'])!.value,
      tugilganKun: this.editForm.get(['tugilganKun'])!.value,
      guruh: this.editForm.get(['guruh'])!.value,
    };
  }
}
