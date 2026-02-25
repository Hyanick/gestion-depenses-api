import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) { }

    findByUsername(username: string) {
        return this.repo.findOne({ where: { username } });
    }

    findById(id: string) {
        return this.repo.findOne({ where: { id } });
    }

    async create(data: Partial<UserEntity>) {
        return this.repo.save(this.repo.create(data));
    }
}