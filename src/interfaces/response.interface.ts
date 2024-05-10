export interface dtoListResponse<T> extends dtoResponseError {
  data: T[];
  resultsCount: number;
}

export interface dtoActionResponse<T> extends dtoResponseError {
  data: T;
}

export interface dtoResponseError {
  message?: string;
  error?: dtoResponseMessageCodes;
}

export enum dtoResponseMessageCodes {
  "DATABASE_OPERATION",
  "USER_EXISTS",
  "WRONG_PASSWORD",
  "NOT_EXISTS",
  "OPERATION_NOT_PERFORMED"
}
