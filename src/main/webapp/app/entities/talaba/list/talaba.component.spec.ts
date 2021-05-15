import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TalabaService } from '../service/talaba.service';

import { TalabaComponent } from './talaba.component';

describe('Component Tests', () => {
  describe('Talaba Management Component', () => {
    let comp: TalabaComponent;
    let fixture: ComponentFixture<TalabaComponent>;
    let service: TalabaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TalabaComponent],
      })
        .overrideTemplate(TalabaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TalabaComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TalabaService);

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
      expect(comp.talabas?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
