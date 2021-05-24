import {UserDto} from './userDto';

export class EventDetailsDto {
  id: number;
  title: string;
  eventType: string;
  description: string;
  price: number;
  feeType: string;
  seatsTotal: number;
  seatsOccupied: number;
  lat: number;
  lng: number;
  userEmail: string;
  userDetails: UserDto;
  avgEventReview: number;
  location: string;
  category: string;
  eventDate: string;
  eventLink: string;
}
