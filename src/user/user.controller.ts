import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, Response, HttpStatus, UnauthorizedException, InternalServerErrorException, Put, ParseFilePipeBuilder } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '../utilities/upload.utils';
import { generatePath } from '../utilities/generate-s3-path.utils';
import e from 'express';
import { AccountService } from 'src/account/account.service';
// import { response } from 'express';
import { S3 } from 'aws-sdk';

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
    async save(@Body() body: any, @Request() req: any) {
        return await this.userService.save(body, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async find(@Request() req: any) {
        const user = await this.userService.find(req.user);
        user.documents.forEach((document: any) => {
            generatePath(document.path, (path: string) => {
                document.path = path;
            });
        });

        return user;
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
        const s3 = new S3({
            region: process.env.AWS_S3_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        const users = await this.userService.findAll(req.user, req.query);

        let user_data = [];
        users.data.forEach(async (user: any, key: any) => {
            user.documents.forEach((document: any) => {
                generatePath(document.path, (path) => {
                    document.path = path;
                });
            });
        });

        if (users.data) {
            return users;
        }

        throw new InternalServerErrorException();
    }

    async getS3File(key: string) {
        const s3 = new S3({
            region: process.env.AWS_S3_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        let params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Expires: 86400
        };

        return await s3.getSignedUrlPromise('getObject', params);
    }

    // @UseGuards(JwtAuthGuard)
    // @Post('photo')
    // @UseInterceptors(
    //     FileInterceptor('image', {
    //         storage: diskStorage({
    //             destination: (req, file, callback) => {
    //                 callback(null, process.env.UPLOAD_DIR + '/profile');
    //             },
    //             filename: editFileName,
    //         }),
    //         fileFilter: imageFileFilter,
    //     }),
    // )
    // async create(@UploadedFile() file: Express.Multer.File, @Request() req: any, @Response() res: any) {
    //     const result = await this.userService.uploadPhoto(req.user, file);
    //     return res.status(result.affected == 1 ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR).json({
    //         status: result.affected == 1 ? true : false,
    //         file: file,
    //     });
    // }

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
    async sendResetPassword(@Request() req: any, @Param('pk') pk: string, @Body() body: any) {
        return await this.userService.sendResetPassword(req.user, pk, body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('password/update')
    async resetUserPassword(@Request() req: any, @Body() body: any) {
        const encryptedPassword = await this.accountService.getHash(body.new_password);
        const data = {
            password: encryptedPassword
        }

        return await this.accountService.update(req.user, body.pk, data);
    }

    @UseGuards(JwtAuthGuard)
    @Post('roles')
    async updateRoles(@Body() body: any, @Request() req: any) {
        return await this.userService.updateRoles(body, req.user);
    }
}
