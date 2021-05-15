import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GuruhDetailComponent } from './guruh-detail.component';

describe('Component Tests', () => {
  describe('Guruh Management Detail Component', () => {
    let comp: GuruhDetailComponent;
    let fixture: ComponentFixture<GuruhDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [GuruhDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ guruh: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(GuruhDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GuruhDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load guruh on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.guruh).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
