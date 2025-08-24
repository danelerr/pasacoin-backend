import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './Dtos/registerUser.Dto';
import { LoginUserDto } from './Dtos/loginUser.Dto';
import { InformationUserDto } from './Dtos/informationUser.Dto';
import { UpdateUserDto } from './Dtos/updateUser.Dto';
import { LoginWalletUserDto } from './Dtos/loginWalletUserDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //ruta parar registar un usuario con wallet
  @Get('registerWithWallet/:address')
  async getRegisterWithWallet(@Param('address') address: string) {
    return await this.usersService.getRegisterWithWalletService(address);
  }

  //ruta para iniciar sesión
  @Post('loginUser')
  async getLoginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.loginUserService(loginUserDto);
  }
  //ruta para registrar un usuario
  @Post('register')
  async postRegisterUser(@Body() registerUserDto: RegisterUserDto) {
    return await this.usersService.registerUserService(registerUserDto);
  }
  //ruta para obtener la informacion del usuario
  @Post('informationUser')
  async postInformartionUser(@Body() informationUserDto: InformationUserDto) {
    return await this.usersService.postInformationUserService(
      informationUserDto,
    );
  }
  //ruta para actualizar la informacion del usuario
  @Put('updateUser')
  async putUpdateUser(@Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.putUpdateUserService(updateUserDto);
  }

  // Ruta para iniciar sesión con wallet y firma
  @Post('loginWithWallet')
  async loginWithWallet(@Body() loginWalletUserDto: LoginWalletUserDto) {
    return await this.usersService.loginWithWalletService(loginWalletUserDto);
  }

  @Get('wallet-challenge/:address')
  getWalletChallenge(@Param('address') address: string) {
    return this.usersService.generateWalletChallenge(address);
  }
}
