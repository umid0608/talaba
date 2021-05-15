import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TalabaDetailComponent } from './talaba-detail.component';

describe('Component Tests', () => {
  describe('Talaba Management Detail Component', () => {
    let comp: TalabaDetailComponent;
    let fixture: ComponentFixture<TalabaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TalabaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ talaba: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TalabaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TalabaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load talaba on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.talaba).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
