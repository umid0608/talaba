jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TalabaService } from '../service/talaba.service';

import { TalabaDeleteDialogComponent } from './talaba-delete-dialog.component';

describe('Component Tests', () => {
  describe('Talaba Management Delete Component', () => {
    let comp: TalabaDeleteDialogComponent;
    let fixture: ComponentFixture<TalabaDeleteDialogComponent>;
    let service: TalabaService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TalabaDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(TalabaDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TalabaDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TalabaService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
