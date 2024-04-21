import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Email } from 'src/email/entities/email.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Project, Email])],
    controllers: [ProjectsController],
    providers: [ProjectsService]
})
export class ProjectsModule { }
