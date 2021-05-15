import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IYunalish, Yunalish } from '../yunalish.model';
import { YunalishService } from '../service/yunalish.service';

@Component({
  selector: 'jhi-yunalish-update',
  templateUrl: './yunalish-update.component.html',
})
export class YunalishUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nom: [],
    kod: [],
  });

  constructor(protected yunalishService: YunalishService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ yunalish }) => {
      this.updateForm(yunalish);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const yunalish = this.createFromForm();
    if (yunalish.id !== undefined) {
      this.subscribeToSaveResponse(this.yunalishService.update(yunalish));
    } else {
      this.subscribeToSaveResponse(this.yunalishService.create(yunalish));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IYunalish>>): void {
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

  protected updateForm(yunalish: IYunalish): void {
    this.editForm.patchValue({
      id: yunalish.id,
      nom: yunalish.nom,
      kod: yunalish.kod,
    });
  }

  protected createFromForm(): IYunalish {
    return {
      ...new Yunalish(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      kod: this.editForm.get(['kod'])!.value,
    };
  }
}
