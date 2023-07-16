import { Body, Controller, Get, Post, Request, Response, UseGuards, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly authService: AuthService,
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Response() res: any, @Request() req) {
        let account = req.user;

        const user = await this.authService.login(account);

        if (user) {
            return res.status(HttpStatus.OK).json({ status: 'success', user });
        }
        return res.status(HttpStatus.FORBIDDEN).json({ status: 'failed' });
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@Response() res: any, @Request() req): any {
        const result = this.authService.logout(req.user);
        if (result) {
            return res.status(HttpStatus.OK).json({ status: 'success' });
        }
        return res.status(HttpStatus.FORBIDDEN).json({ status: 'failed' });
    }
}
