import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@task-management-take-home/data';
import { OrgHierarchyService } from './org-hierarchy.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [OrgHierarchyService],
  exports: [OrgHierarchyService],
})
export class OrgHierarchyModule { }
