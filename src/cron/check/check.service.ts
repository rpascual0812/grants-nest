import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DateTime } from "luxon";

@Injectable()
export class CheckService {
    @Cron('*/10 * * * * *')
    runEvery10Seconds() {
        console.log('Cron checker is running: ' + DateTime.now().toFormat('y-LL-dd HH:mm:ss'));
    }
}
