import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Response, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { ValidationService } from 'src/validation/validation.service';

const axios = require('axios');

@Controller('emails')
export class EmailController {
    success: any = ['DELIVERABLE'];

    constructor(
        private readonly emailService: EmailService,
        private readonly validationService: ValidationService
    ) { }

    @Get()
    findAll(@Request() req: any) {
        return this.emailService.findAll(req.query);
    }

    /**
     * Email Validation
     * validations table
     * @returns 
     */
    @Post('check')
    async checkEmail(@Body() data: any, @Response() res: any) {
        // check if the email address has already been checked before
        let mustValidate: boolean = true;
        const email = await this.validationService.findOne(data.email);
        // console.log(email, this.success.includes(email.status));
        if (email) {
            mustValidate = false;
        }

        if (!mustValidate) {
            return res.status(HttpStatus.OK).json({ email: email.value, status: this.success.includes(email.status) ? true : false });
        }
        else {
            axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.EMAIL_CHECK_API_KEY}&email=${data.email}`)
                .then(response => {
                    // save result to db first
                    this.validationService.create({ type: 'email', value: data.email, status: response.data.deliverability });

                    return res.status(HttpStatus.OK).json({
                        email: data.email,
                        status: this.success.includes(response.data.deliverability) ? true : false
                    });
                })
                .catch(error => {
                    console.log(error);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
                });
        }
    }
}
