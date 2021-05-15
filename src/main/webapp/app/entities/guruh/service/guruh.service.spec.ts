import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGuruh, Guruh } from '../guruh.model';

import { GuruhService } from './guruh.service';

describe('Service Tests', () => {
  describe('Guruh Service', () => {
    let service: GuruhService;
    let httpMock: HttpTestingController;
    let elemDefault: IGuruh;
    let expectedResult: IGuruh | IGuruh[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(GuruhService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nom: 'AAAAAAA',
        yil: 0,
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

      it('should create a Guruh', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Guruh()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Guruh', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            yil: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Guruh', () => {
        const patchObject = Object.assign(
          {
            nom: 'BBBBBB',
            yil: 1,
          },
          new Guruh()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Guruh', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            yil: 1,
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

      it('should delete a Guruh', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addGuruhToCollectionIfMissing', () => {
        it('should add a Guruh to an empty array', () => {
          const guruh: IGuruh = { id: 123 };
          expectedResult = service.addGuruhToCollectionIfMissing([], guruh);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(guruh);
        });

        it('should not add a Guruh to an array that contains it', () => {
          const guruh: IGuruh = { id: 123 };
          const guruhCollection: IGuruh[] = [
            {
              ...guruh,
            },
            { id: 456 },
          ];
          expectedResult = service.addGuruhToCollectionIfMissing(guruhCollection, guruh);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Guruh to an array that doesn't contain it", () => {
          const guruh: IGuruh = { id: 123 };
          const guruhCollection: IGuruh[] = [{ id: 456 }];
          expectedResult = service.addGuruhToCollectionIfMissing(guruhCollection, guruh);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(guruh);
        });

        it('should add only unique Guruh to an array', () => {
          const guruhArray: IGuruh[] = [{ id: 123 }, { id: 456 }, { id: 8492 }];
          const guruhCollection: IGuruh[] = [{ id: 123 }];
          expectedResult = service.addGuruhToCollectionIfMissing(guruhCollection, ...guruhArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const guruh: IGuruh = { id: 123 };
          const guruh2: IGuruh = { id: 456 };
          expectedResult = service.addGuruhToCollectionIfMissing([], guruh, guruh2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(guruh);
          expect(expectedResult).toContain(guruh2);
        });

        it('should accept null and undefined values', () => {
          const guruh: IGuruh = { id: 123 };
          expectedResult = service.addGuruhToCollectionIfMissing([], null, guruh, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(guruh);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
