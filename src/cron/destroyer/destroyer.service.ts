import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DateTime } from "luxon";

@Injectable()
export class DestroyerService {
    @Cron('0 * * * * *')
    runEvery10Seconds() {
        console.log('Cron destroyer finished running: ' + DateTime.now().toFormat('y-LL-dd HH:mm:ss'));
    }
}
