import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(dto: CreateCommentDto, author: Pick<User, 'id'>): Promise<Comment> {
    const post = await this.postsRepository.findOne({
      where: { id: dto.postId },
    });

    if (!post) throw new NotFoundException('Post não encontrado');

    const comment = this.commentsRepository.create({
      content: dto.content,
      author: { id: author.id } as User,
      post,
    });

    return this.commentsRepository.save(comment);
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { post: { id: postId } },
      order: { createdAt: 'DESC' },
    });
  }
}