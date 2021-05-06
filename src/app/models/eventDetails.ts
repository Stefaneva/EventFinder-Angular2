import {UserDto} from './userDto';

export class EventDetailsDto {
  id: number;
  title: string;
  eventType: string;
  description: string;
  price: number;
  surface: number;
  rooms: number;
  feeType: string;
  lat: number;
  lng: number;
  userDetails: UserDto;
  partitioning: string;
  comfort: number;
  furnished: string;
  floorLevel: string;
  areaSurface: number;
  yearBuilt: number;
  avgEventReview: number;
}
