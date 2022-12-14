import {
  BadRequestException,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';

export const normalizeDate = (date: Date): Date => {
  return date.toLocaleString() as unknown as Date;
};

export const ThrowNotFoundException = (msg: string) => {
  throw new NotFoundException(msg);
};

export const ThrowBadRequestException = (msg: string) => {
  throw new BadRequestException(msg);
};

export const ThrowMethodNotAllowedException = (msg: string) => {
  throw new MethodNotAllowedException(msg);
};
