import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RefreshDto, RefreshResponseDto } from './dto/refresh.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  @Post('register')
  @ApiOperation({ summary: 'Register a new tourist account' })
  @ApiCreatedResponse({ type: ApiResponseDto<RegisterResponseDto> })
  register(@Body() _dto: RegisterDto): ApiResponseDto<RegisterResponseDto> {
    return {
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        status: 'PENDING_VERIFICATION',
      },
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with Login ID and password' })
  @ApiOkResponse({ type: ApiResponseDto<LoginResponseDto> })
  login(@Body() _dto: LoginDto): ApiResponseDto<LoginResponseDto> {
    return {
      data: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        role: 'TOURIST',
      },
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({ type: ApiResponseDto<RefreshResponseDto> })
  refresh(@Body() _dto: RefreshDto): ApiResponseDto<RefreshResponseDto> {
    return {
      data: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
    };
  }
}
