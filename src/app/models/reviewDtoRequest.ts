export class ReviewDtoRequest {
  idReview: number;
  comment: string;
  rating: number;
  like: number;
  username: string;
  mail: string;
  userType: string;
  date: string;
  editReview = false;
}
