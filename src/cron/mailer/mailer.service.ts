import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DateTime } from "luxon";
import { EmailService } from 'src/email/email.service';

@Injectable()
export class MailerService {
    pagination = {
        skip: 0,
        take: 10
    }

    constructor(
        private readonly emailsService: EmailService
    ) { }

    @Cron('*/15 * * * * *')
    runEvery15Seconds() {
        this.emailsService.findAll(this.pagination).then((emails: any) => {
            console.log('Mailer started sending (' + emails.length + ') emails on ' + DateTime.now().toFormat('y-LL-dd HH:mm:ss'));
            emails.forEach(email => {
                this.sendEmail(email);
            });
        }).catch((err: any) => {
            // save something on the error logs
            console.log(err);
        });
    }

    sendEmail(email: any) {
        switch (process.env.PROVIDER) {
            case 'mailjet':
                this.mailjet(email);
                break;

            default:
                this.mailjet(email);
                break;
        }
    }

    mailjet(email: any) {
        const mailjet = require('node-mailjet').apiConnect(
            process.env.API_KEY,
            process.env.SECRET_KEY,
        );

        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request(this.buildEmail(email));

        request
            .then((result) => {
                if (result.response.status == 200) {
                    this.emailsService.update(email.pk, { sent: 'true' }).then((data: any) => {

                    }).catch((err: any) => {
                        // save something on the error logs
                        console.log(err);
                    });
                }
            })
            .catch((err) => {
                // save something on the error logs
                console.log(err.statusCode)
            });
    }

    buildEmail(email) {
        return {
            "Messages": [
                {
                    "From": {
                        "Email": email.from,
                        "Name": email.from_name
                    },
                    "To": [
                        {
                            "Email": email.to,
                            "Name": email.to_name
                        }
                    ],
                    "Subject": email.subject,
                    // "TextPart": "My first Mailjet email",
                    "HTMLPart": email.body,
                    "CustomID": email.uuid
                }
            ]
        };
    }
}
