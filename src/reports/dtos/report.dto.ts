import { Expose, Transform } from 'class-transformer';
import { Report } from '../reports.entity';

export class ReportDto {
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  year: number;
  @Expose()
  mileage: number;
  @Expose()
  lat: number;
  @Expose()
  lng: number;
  @Expose()
  price: number;

  @Transform(({ obj }: { obj: Report }) => obj.user.id)
  @Expose()
  userId: number;
}
