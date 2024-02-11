import { Test, TestingModule } from '@nestjs/testing';
import { DestroyerService } from './destroyer.service';

describe('DestroyerService', () => {
  let service: DestroyerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DestroyerService],
    }).compile();

    service = module.get<DestroyerService>(DestroyerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
