jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TalabaService } from '../service/talaba.service';
import { ITalaba, Talaba } from '../talaba.model';
import { IGuruh } from 'app/entities/guruh/guruh.model';
import { GuruhService } from 'app/entities/guruh/service/guruh.service';

import { TalabaUpdateComponent } from './talaba-update.component';

describe('Component Tests', () => {
  describe('Talaba Management Update Component', () => {
    let comp: TalabaUpdateComponent;
    let fixture: ComponentFixture<TalabaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let talabaService: TalabaService;
    let guruhService: GuruhService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TalabaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TalabaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TalabaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      talabaService = TestBed.inject(TalabaService);
      guruhService = TestBed.inject(GuruhService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Guruh query and add missing value', () => {
        const talaba: ITalaba = { id: 456 };
        const guruh: IGuruh = { id: 35800 };
        talaba.guruh = guruh;

        const guruhCollection: IGuruh[] = [{ id: 75607 }];
        spyOn(guruhService, 'query').and.returnValue(of(new HttpResponse({ body: guruhCollection })));
        const additionalGuruhs = [guruh];
        const expectedCollection: IGuruh[] = [...additionalGuruhs, ...guruhCollection];
        spyOn(guruhService, 'addGuruhToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ talaba });
        comp.ngOnInit();

        expect(guruhService.query).toHaveBeenCalled();
        expect(guruhService.addGuruhToCollectionIfMissing).toHaveBeenCalledWith(guruhCollection, ...additionalGuruhs);
        expect(comp.guruhsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const talaba: ITalaba = { id: 456 };
        const guruh: IGuruh = { id: 25842 };
        talaba.guruh = guruh;

        activatedRoute.data = of({ talaba });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(talaba));
        expect(comp.guruhsSharedCollection).toContain(guruh);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const talaba = { id: 123 };
        spyOn(talabaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ talaba });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: talaba }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(talabaService.update).toHaveBeenCalledWith(talaba);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const talaba = new Talaba();
        spyOn(talabaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ talaba });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: talaba }));
        saveSubject.complete();

        // THEN
        expect(talabaService.create).toHaveBeenCalledWith(talaba);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const talaba = { id: 123 };
        spyOn(talabaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ talaba });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(talabaService.update).toHaveBeenCalledWith(talaba);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackGuruhById', () => {
        it('Should return tracked Guruh primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackGuruhById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
