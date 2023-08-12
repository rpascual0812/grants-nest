import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, Response, HttpStatus, UnauthorizedException, InternalServerErrorException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utilities/upload.utils';
import e from 'express';
import { AccountService } from 'src/account/account.service';
// import { response } from 'express';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService, private readonly accountService: AccountService) { }

    // @UseGuards(JwtAuthGuard)
    // @Post('update')
    // async update(@Request() req: any, @Body() body: any) {
    //     return await this.userService.update(body);
    // }

    @UseGuards(JwtAuthGuard)
    @Post()
    async save(@Request() req: any, @Body() body: any) {
        return await this.userService.save(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async find(@Request() req: any) {
        return await this.userService.find(req.user);
    }

    @Get(':pk')
    async findOne(@Request() req: any) {
        const user = await this.userService.findOne(req.params);
        // const userAddresses = await this.userService.getUserAddresses([user['pk']], req.query);

        // user['user_addresses'] = [];
        // // Append user addresses
        // if (userAddresses) {
        //     userAddresses[0].forEach(address => {
        //         if (user['pk'] == address.user_pk) {
        //             user['user_addresses'].push(address);
        //         }
        //     });
        // }

        if (user) {
            return user;
        }

        throw new InternalServerErrorException();
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req: any) {
        const users = await this.userService.findAll(req.user, req.query);
        if (users.data) {
            return users;
        }

        throw new InternalServerErrorException();
    }

    @UseGuards(JwtAuthGuard)
    @Post('photo')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: (req, file, callback) => {
                    callback(null, process.env.UPLOAD_DIR + '/profile');
                },
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async create(@UploadedFile() file: Express.Multer.File, @Request() req: any, @Response() res: any) {
        const result = await this.userService.uploadPhoto(req.user, file);
        // console.log("🚀 ~ file: users.controller.ts ~ line 46 ~ UsersController ~ create ~ result", result.affected)

        return res.status(result.affected == 1 ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: result.affected == 1 ? true : false,
            file: file,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('last')
    async getLast(@Request() req: any) {
        // console.log('getting last user', req.user);
        return await this.userService.findLast(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async delete(@Request() req: any) {
        return await this.userService.delete(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':pk/reset-password')
    async resetUserPassword(@Request() req: any, @Param('pk') pk: string, @Body() body: any) {
        console.log(req.user, pk);
        return await this.userService.resetUserPassword(req.user, pk, body);
    }
}
