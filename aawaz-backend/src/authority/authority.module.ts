import { Module } from '@nestjs/common';
import { AuthorityController } from './authority.controller';

@Module({
  controllers: [AuthorityController],
})
export class AuthorityModule {}
