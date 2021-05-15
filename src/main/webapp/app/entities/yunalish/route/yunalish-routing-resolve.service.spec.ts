jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IYunalish, Yunalish } from '../yunalish.model';
import { YunalishService } from '../service/yunalish.service';

import { YunalishRoutingResolveService } from './yunalish-routing-resolve.service';

describe('Service Tests', () => {
  describe('Yunalish routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: YunalishRoutingResolveService;
    let service: YunalishService;
    let resultYunalish: IYunalish | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(YunalishRoutingResolveService);
      service = TestBed.inject(YunalishService);
      resultYunalish = undefined;
    });

    describe('resolve', () => {
      it('should return IYunalish returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultYunalish = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultYunalish).toEqual({ id: 123 });
      });

      it('should return new IYunalish if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultYunalish = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultYunalish).toEqual(new Yunalish());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultYunalish = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultYunalish).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
