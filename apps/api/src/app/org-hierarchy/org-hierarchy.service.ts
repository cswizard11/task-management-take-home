import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization, User } from '@task-management-take-home/data';

@Injectable()
export class OrgHierarchyService {
  constructor(
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
  ) { }

  async getDescendantOrgIds(orgId: number): Promise<number[]> {
    const children = await this.orgRepo.find({
      where: { parentId: orgId },
    });

    if (children.length === 0) {
      return [];
    }

    let allDescendants = children.map((c) => c.id);

    for (const child of children) {
      const childDescendants = await this.getDescendantOrgIds(child.id);
      allDescendants = [...allDescendants, ...childDescendants];
    }

    return allDescendants;
  }

  async getAccessibleOrgIds(user: User): Promise<number[]> {
    const orgIds = [user.organizationId];
    const descendants = await this.getDescendantOrgIds(user.organizationId);
    return [...orgIds, ...descendants];
  }

  async canAccessOrganization(user: User, orgId: number): Promise<boolean> {
    const accessibleIds = await this.getAccessibleOrgIds(user);
    return accessibleIds.includes(orgId);
  }
}
