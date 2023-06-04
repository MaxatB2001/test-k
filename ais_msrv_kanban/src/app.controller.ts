import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'nest-keycloak-connect';
import { AppService } from './app.service';
import { CreateSectionDto } from './DTO/create-section-dto';

// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
