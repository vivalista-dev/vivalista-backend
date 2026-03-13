export class UpdateGuestDto {
  name?: string;
  email?: string;
  phone?: string;
  status?: 'INVITED' | 'CONFIRMED' | 'DECLINED';
}