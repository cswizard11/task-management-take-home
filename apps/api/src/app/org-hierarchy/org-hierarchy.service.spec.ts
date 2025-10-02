import { Test, TestingModule } from '@nestjs/testing';
import { OrgHierarchyService } from './org-hierarchy.service';

describe('OrgHierarchyService', () => {
  let service: OrgHierarchyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgHierarchyService],
    }).compile();

    service = module.get<OrgHierarchyService>(OrgHierarchyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
