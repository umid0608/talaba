jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { GuruhService } from '../service/guruh.service';
import { IGuruh, Guruh } from '../guruh.model';
import { IYunalish } from 'app/entities/yunalish/yunalish.model';
import { YunalishService } from 'app/entities/yunalish/service/yunalish.service';

import { GuruhUpdateComponent } from './guruh-update.component';

describe('Component Tests', () => {
  describe('Guruh Management Update Component', () => {
    let comp: GuruhUpdateComponent;
    let fixture: ComponentFixture<GuruhUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let guruhService: GuruhService;
    let yunalishService: YunalishService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GuruhUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(GuruhUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GuruhUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      guruhService = TestBed.inject(GuruhService);
      yunalishService = TestBed.inject(YunalishService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Yunalish query and add missing value', () => {
        const guruh: IGuruh = { id: 456 };
        const yunalish: IYunalish = { id: 63785 };
        guruh.yunalish = yunalish;

        const yunalishCollection: IYunalish[] = [{ id: 58417 }];
        spyOn(yunalishService, 'query').and.returnValue(of(new HttpResponse({ body: yunalishCollection })));
        const additionalYunalishes = [yunalish];
        const expectedCollection: IYunalish[] = [...additionalYunalishes, ...yunalishCollection];
        spyOn(yunalishService, 'addYunalishToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ guruh });
        comp.ngOnInit();

        expect(yunalishService.query).toHaveBeenCalled();
        expect(yunalishService.addYunalishToCollectionIfMissing).toHaveBeenCalledWith(yunalishCollection, ...additionalYunalishes);
        expect(comp.yunalishesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const guruh: IGuruh = { id: 456 };
        const yunalish: IYunalish = { id: 2315 };
        guruh.yunalish = yunalish;

        activatedRoute.data = of({ guruh });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(guruh));
        expect(comp.yunalishesSharedCollection).toContain(yunalish);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const guruh = { id: 123 };
        spyOn(guruhService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ guruh });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: guruh }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(guruhService.update).toHaveBeenCalledWith(guruh);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const guruh = new Guruh();
        spyOn(guruhService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ guruh });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: guruh }));
        saveSubject.complete();

        // THEN
        expect(guruhService.create).toHaveBeenCalledWith(guruh);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const guruh = { id: 123 };
        spyOn(guruhService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ guruh });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(guruhService.update).toHaveBeenCalledWith(guruh);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackYunalishById', () => {
        it('Should return tracked Yunalish primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackYunalishById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
