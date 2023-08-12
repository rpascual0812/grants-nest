import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, InternalServerErrorException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService, private readonly userService: UserService) { }

    @Post()
    create(@Body() createAccountDto: CreateAccountDto) {
        return this.accountService.create(createAccountDto);
    }

    @Get()
    findAll() {
        return this.accountService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':pk')
    async findOne(@Param('pk') pk: number, @Request() req: any) {
        const account = await this.accountService.findOne(pk);
        // const userAddresses = await this.userService.getUserAddresses([account['user']['pk']], req.query);

        account['user']['user_addresses'] = [];
        // // Append user addresses
        // if (userAddresses) {
        //     userAddresses[0].forEach(address => {
        //         if (account['user']['pk'] == address.user_pk) {
        //             account['user']['user_addresses'].push(address);
        //         }
        //     });
        // }

        if (account) {
            return account;
        }

        throw new InternalServerErrorException();

    }

    @UseGuards(JwtAuthGuard)
    @Post(':pk')
    async update(@Param('pk') pk, @Request() req: any, @Body() body: any) {
        return await this.accountService.update(req.user, pk, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.accountService.remove(+id);
    }
}
