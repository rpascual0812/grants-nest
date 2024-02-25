import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dataSource from 'db/data-source';
import { Log } from 'src/log/entities/log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GlobalService {
    constructor(
    ) { }

    async saveLog(data: any): Promise<any> {
        console.log('Saving logs from the global service...');
    }

    async saveError(data: any): Promise<any> {
        console.log('Saving errors from the global service...');
    }
}
