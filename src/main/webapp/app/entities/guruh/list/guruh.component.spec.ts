import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GuruhService } from '../service/guruh.service';

import { GuruhComponent } from './guruh.component';

describe('Component Tests', () => {
  describe('Guruh Management Component', () => {
    let comp: GuruhComponent;
    let fixture: ComponentFixture<GuruhComponent>;
    let service: GuruhService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GuruhComponent],
      })
        .overrideTemplate(GuruhComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GuruhComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(GuruhService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.guruhs?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
