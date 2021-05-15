import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { YunalishDetailComponent } from './yunalish-detail.component';

describe('Component Tests', () => {
  describe('Yunalish Management Detail Component', () => {
    let comp: YunalishDetailComponent;
    let fixture: ComponentFixture<YunalishDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [YunalishDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ yunalish: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(YunalishDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(YunalishDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load yunalish on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.yunalish).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
