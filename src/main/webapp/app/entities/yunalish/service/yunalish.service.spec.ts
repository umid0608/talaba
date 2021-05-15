import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IYunalish, Yunalish } from '../yunalish.model';

import { YunalishService } from './yunalish.service';

describe('Service Tests', () => {
  describe('Yunalish Service', () => {
    let service: YunalishService;
    let httpMock: HttpTestingController;
    let elemDefault: IYunalish;
    let expectedResult: IYunalish | IYunalish[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(YunalishService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nom: 'AAAAAAA',
        kod: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Yunalish', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Yunalish()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Yunalish', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            kod: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Yunalish', () => {
        const patchObject = Object.assign(
          {
            kod: 'BBBBBB',
          },
          new Yunalish()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Yunalish', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            kod: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Yunalish', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addYunalishToCollectionIfMissing', () => {
        it('should add a Yunalish to an empty array', () => {
          const yunalish: IYunalish = { id: 123 };
          expectedResult = service.addYunalishToCollectionIfMissing([], yunalish);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(yunalish);
        });

        it('should not add a Yunalish to an array that contains it', () => {
          const yunalish: IYunalish = { id: 123 };
          const yunalishCollection: IYunalish[] = [
            {
              ...yunalish,
            },
            { id: 456 },
          ];
          expectedResult = service.addYunalishToCollectionIfMissing(yunalishCollection, yunalish);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Yunalish to an array that doesn't contain it", () => {
          const yunalish: IYunalish = { id: 123 };
          const yunalishCollection: IYunalish[] = [{ id: 456 }];
          expectedResult = service.addYunalishToCollectionIfMissing(yunalishCollection, yunalish);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(yunalish);
        });

        it('should add only unique Yunalish to an array', () => {
          const yunalishArray: IYunalish[] = [{ id: 123 }, { id: 456 }, { id: 31285 }];
          const yunalishCollection: IYunalish[] = [{ id: 123 }];
          expectedResult = service.addYunalishToCollectionIfMissing(yunalishCollection, ...yunalishArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const yunalish: IYunalish = { id: 123 };
          const yunalish2: IYunalish = { id: 456 };
          expectedResult = service.addYunalishToCollectionIfMissing([], yunalish, yunalish2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(yunalish);
          expect(expectedResult).toContain(yunalish2);
        });

        it('should accept null and undefined values', () => {
          const yunalish: IYunalish = { id: 123 };
          expectedResult = service.addYunalishToCollectionIfMissing([], null, yunalish, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(yunalish);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
