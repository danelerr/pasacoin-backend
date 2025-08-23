import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RounderService } from './rounder.service';
import { CreateRoundedPrivateDto } from './Dtos/createRoundedPrivateDto';
import { CreateRoundedPublicDto } from './Dtos/createRoundedPublicDto';

@Controller('rounder')
export class RounderController {
  constructor(private readonly rounderServices: RounderService) {}

  @Get('allRoundedPublicCreated')
  async getAllRoundedPublicCreated() {
    return await this.rounderServices.getAllRoundedPublicCreatedService();
  }
  @Get('allRoundedUsers/:id')
  async getAllRoundedUsers(@Param('id') id: string) {
    return await this.rounderServices.getAllRoundedUsersService(id);
  }
  @Post('createRounderPrivate')
  async postCreateRounderPrivate(
    @Body() createRoundedPrivateDto: CreateRoundedPrivateDto,
  ) {
    return await this.rounderServices.postCreateRoundedPrivateService(
      createRoundedPrivateDto,
    );
  }
  @Post('createRounderPublic')
  async postCreateRounderPublic(
    @Body() createRoundedPublicDto: CreateRoundedPublicDto,
  ) {
    return await this.rounderServices.postCreateRoundedPublicService(
      createRoundedPublicDto,
    );
  }
}
