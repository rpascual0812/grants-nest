import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationQueryHelpersService } from './application-query-helpers.service';

describe('ApplicationQueryHelpersService', () => {
    let service: ApplicationQueryHelpersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ApplicationQueryHelpersService],
        }).compile();

        service = module.get<ApplicationQueryHelpersService>(ApplicationQueryHelpersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
