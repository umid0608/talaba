import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ITalaba, Talaba } from '../talaba.model';

import { TalabaService } from './talaba.service';

describe('Service Tests', () => {
  describe('Talaba Service', () => {
    let service: TalabaService;
    let httpMock: HttpTestingController;
    let elemDefault: ITalaba;
    let expectedResult: ITalaba | ITalaba[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TalabaService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        ism: 'AAAAAAA',
        familiya: 'AAAAAAA',
        sharif: 'AAAAAAA',
        tugilganKun: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            tugilganKun: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Talaba', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            tugilganKun: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            tugilganKun: currentDate,
          },
          returnedFromService
        );

        service.create(new Talaba()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Talaba', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            ism: 'BBBBBB',
            familiya: 'BBBBBB',
            sharif: 'BBBBBB',
            tugilganKun: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            tugilganKun: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Talaba', () => {
        const patchObject = Object.assign({}, new Talaba());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            tugilganKun: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Talaba', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            ism: 'BBBBBB',
            familiya: 'BBBBBB',
            sharif: 'BBBBBB',
            tugilganKun: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            tugilganKun: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Talaba', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTalabaToCollectionIfMissing', () => {
        it('should add a Talaba to an empty array', () => {
          const talaba: ITalaba = { id: 123 };
          expectedResult = service.addTalabaToCollectionIfMissing([], talaba);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(talaba);
        });

        it('should not add a Talaba to an array that contains it', () => {
          const talaba: ITalaba = { id: 123 };
          const talabaCollection: ITalaba[] = [
            {
              ...talaba,
            },
            { id: 456 },
          ];
          expectedResult = service.addTalabaToCollectionIfMissing(talabaCollection, talaba);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Talaba to an array that doesn't contain it", () => {
          const talaba: ITalaba = { id: 123 };
          const talabaCollection: ITalaba[] = [{ id: 456 }];
          expectedResult = service.addTalabaToCollectionIfMissing(talabaCollection, talaba);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(talaba);
        });

        it('should add only unique Talaba to an array', () => {
          const talabaArray: ITalaba[] = [{ id: 123 }, { id: 456 }, { id: 73503 }];
          const talabaCollection: ITalaba[] = [{ id: 123 }];
          expectedResult = service.addTalabaToCollectionIfMissing(talabaCollection, ...talabaArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const talaba: ITalaba = { id: 123 };
          const talaba2: ITalaba = { id: 456 };
          expectedResult = service.addTalabaToCollectionIfMissing([], talaba, talaba2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(talaba);
          expect(expectedResult).toContain(talaba2);
        });

        it('should accept null and undefined values', () => {
          const talaba: ITalaba = { id: 123 };
          expectedResult = service.addTalabaToCollectionIfMissing([], null, talaba, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(talaba);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
