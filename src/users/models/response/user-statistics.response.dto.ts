import { UserResponseDto } from './user.response.dto';

export class UserStatisticsResponseDto<T> extends UserResponseDto {
  totalOrdersCount: number;
  statusCounts: T[];
}

export type StatusCount = {
  count: number;
  status: string;
};
