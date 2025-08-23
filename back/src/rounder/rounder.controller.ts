import { Body, Controller, Post } from '@nestjs/common';
import { RounderService } from './rounder.service';
import { CreateRoundedPrivateDto } from './Dtos/createRoundedPrivateDto';

@Controller('rounder')
export class RounderController {
  constructor(private readonly rounderServices: RounderService) {}

  @Post('createRounderPrivate')
  async postCreateRounderPrivate(
    @Body() createRoundedPrivateDto: CreateRoundedPrivateDto,
  ) {
    return await this.rounderServices.postCreateRoundedPrivateService(
      createRoundedPrivateDto,
    );
  }
}
