import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      + '-' + Date.now();
  }

  async create(dto: CreatePostDto, author: Pick<User, 'id'>): Promise<Post> {
    const post = this.postsRepository.create({
      title: dto.title,
      content: dto.content,
      slug: this.generateSlug(dto.title),
      author: { id: author.id } as User,
    });

    return this.postsRepository.save(post);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.postsRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });

    if (!post) throw new NotFoundException('Post não encontrado');

    return post;
  }

  async update(
    id: string,
    dto: UpdatePostDto,
    user: Pick<User, 'id'>,
  ): Promise<Post> {
    const post = await this.findOne(id);

    if (post.author.id !== user.id) {
      throw new ForbiddenException('Você não pode editar este post');
    }

    if (dto.title) {
      post.slug = this.generateSlug(dto.title);
    }

    Object.assign(post, dto);

    return this.postsRepository.save(post);
  }

  async remove(id: string, user: Pick<User, 'id'>): Promise<void> {
    const post = await this.findOne(id);

    if (post.author.id !== user.id) {
      throw new ForbiddenException('Você não pode deletar este post');
    }

    await this.postsRepository.remove(post);
  }
}