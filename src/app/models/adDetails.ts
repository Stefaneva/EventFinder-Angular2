import {UserDto} from './userDto';

export class AdDetailsDto {
  id: number;
  title: string;
  adType: string;
  description: string;
  price: number;
  surface: number;
  rooms: number;
  adItemType: string;
  lat: number;
  lng: number;
  userDetails: UserDto;
  partitioning: string;
  comfort: number;
  furnished: string;
  floorLevel: string;
  areaSurface: number;
  yearBuilt: number;
  avgAdReview: number;
}
