jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITalaba, Talaba } from '../talaba.model';
import { TalabaService } from '../service/talaba.service';

import { TalabaRoutingResolveService } from './talaba-routing-resolve.service';

describe('Service Tests', () => {
  describe('Talaba routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TalabaRoutingResolveService;
    let service: TalabaService;
    let resultTalaba: ITalaba | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TalabaRoutingResolveService);
      service = TestBed.inject(TalabaService);
      resultTalaba = undefined;
    });

    describe('resolve', () => {
      it('should return ITalaba returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTalaba = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTalaba).toEqual({ id: 123 });
      });

      it('should return new ITalaba if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTalaba = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTalaba).toEqual(new Talaba());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTalaba = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTalaba).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
