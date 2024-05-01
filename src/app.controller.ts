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
        account.remember = req.body.remember;

        // remove existing session by logging out the user before logging in
        const session = await this.authService.logout(account);
        if (session) {
            const user = await this.authService.login(account);

            if (user) {
                return res.status(HttpStatus.OK).json({ status: 'success', user });
            }
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

    @Post('forgot-password')
    async forgot(@Response() res: any, @Request() req, @Body() body): Promise<any> {
        const newForgot = await this.authService.forgotPassword(body);
        if (newForgot) {
            return res.status(HttpStatus.OK).json(newForgot);
        }
        return res.status(HttpStatus.FORBIDDEN).json({ status: 'failed' });
    }

    @Post('reset-password')
    async reset(@Response() res: any, @Request() req, @Body() body): Promise<any> {
        const newReset = await this.authService.resetPassword(body);
        if (newReset) {
            return res.status(HttpStatus.OK).json({ status: 'success' });
        }
        return res.status(HttpStatus.FORBIDDEN).json({ status: 'failed' });
    }

    @Get('assets/images/uploads/:customDir/:imageName')
    invoke(@Request() req, @Response() res) {
        return res.sendFile(req.path, { root: './' });
    }

    @Get('assets/images/:imageName')
    images(@Request() req, @Response() res) {
        return res.sendFile(req.path, { root: './' });
    }
}
