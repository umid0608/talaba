jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IGuruh, Guruh } from '../guruh.model';
import { GuruhService } from '../service/guruh.service';

import { GuruhRoutingResolveService } from './guruh-routing-resolve.service';

describe('Service Tests', () => {
  describe('Guruh routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: GuruhRoutingResolveService;
    let service: GuruhService;
    let resultGuruh: IGuruh | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(GuruhRoutingResolveService);
      service = TestBed.inject(GuruhService);
      resultGuruh = undefined;
    });

    describe('resolve', () => {
      it('should return IGuruh returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGuruh = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultGuruh).toEqual({ id: 123 });
      });

      it('should return new IGuruh if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGuruh = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultGuruh).toEqual(new Guruh());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGuruh = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultGuruh).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
