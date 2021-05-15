jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { YunalishService } from '../service/yunalish.service';
import { IYunalish, Yunalish } from '../yunalish.model';

import { YunalishUpdateComponent } from './yunalish-update.component';

describe('Component Tests', () => {
  describe('Yunalish Management Update Component', () => {
    let comp: YunalishUpdateComponent;
    let fixture: ComponentFixture<YunalishUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let yunalishService: YunalishService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [YunalishUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(YunalishUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(YunalishUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      yunalishService = TestBed.inject(YunalishService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const yunalish: IYunalish = { id: 456 };

        activatedRoute.data = of({ yunalish });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(yunalish));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const yunalish = { id: 123 };
        spyOn(yunalishService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ yunalish });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: yunalish }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(yunalishService.update).toHaveBeenCalledWith(yunalish);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const yunalish = new Yunalish();
        spyOn(yunalishService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ yunalish });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: yunalish }));
        saveSubject.complete();

        // THEN
        expect(yunalishService.create).toHaveBeenCalledWith(yunalish);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const yunalish = { id: 123 };
        spyOn(yunalishService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ yunalish });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(yunalishService.update).toHaveBeenCalledWith(yunalish);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
