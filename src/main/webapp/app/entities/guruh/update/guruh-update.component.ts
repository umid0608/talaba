import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IGuruh, Guruh } from '../guruh.model';
import { GuruhService } from '../service/guruh.service';
import { IYunalish } from 'app/entities/yunalish/yunalish.model';
import { YunalishService } from 'app/entities/yunalish/service/yunalish.service';

@Component({
  selector: 'jhi-guruh-update',
  templateUrl: './guruh-update.component.html',
})
export class GuruhUpdateComponent implements OnInit {
  isSaving = false;

  yunalishesSharedCollection: IYunalish[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    yil: [null, [Validators.required]],
    yunalish: [null, Validators.required],
  });

  constructor(
    protected guruhService: GuruhService,
    protected yunalishService: YunalishService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ guruh }) => {
      this.updateForm(guruh);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const guruh = this.createFromForm();
    if (guruh.id !== undefined) {
      this.subscribeToSaveResponse(this.guruhService.update(guruh));
    } else {
      this.subscribeToSaveResponse(this.guruhService.create(guruh));
    }
  }

  trackYunalishById(index: number, item: IYunalish): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGuruh>>): void {
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

  protected updateForm(guruh: IGuruh): void {
    this.editForm.patchValue({
      id: guruh.id,
      nom: guruh.nom,
      yil: guruh.yil,
      yunalish: guruh.yunalish,
    });

    this.yunalishesSharedCollection = this.yunalishService.addYunalishToCollectionIfMissing(
      this.yunalishesSharedCollection,
      guruh.yunalish
    );
  }

  protected loadRelationshipsOptions(): void {
    this.yunalishService
      .query()
      .pipe(map((res: HttpResponse<IYunalish[]>) => res.body ?? []))
      .pipe(
        map((yunalishes: IYunalish[]) =>
          this.yunalishService.addYunalishToCollectionIfMissing(yunalishes, this.editForm.get('yunalish')!.value)
        )
      )
      .subscribe((yunalishes: IYunalish[]) => (this.yunalishesSharedCollection = yunalishes));
  }

  protected createFromForm(): IGuruh {
    return {
      ...new Guruh(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      yil: this.editForm.get(['yil'])!.value,
      yunalish: this.editForm.get(['yunalish'])!.value,
    };
  }
}
