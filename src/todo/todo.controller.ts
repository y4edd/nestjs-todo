import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TodoService } from './todo.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';
import { AuthUser } from './interfaces/todo.interface';

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getTasks(@Req() req: Request): Promise<Task[]> {
    const user = req.user as AuthUser;
    return this.todoService.getTasks(user.id);
  }

  @Get(':id')
  getTaskById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<Task> {
    const user = req.user as AuthUser;
    return this.todoService.getTaskById(user.id, taskId);
  }

  @Post()
  createTask(@Req() req: Request, @Body() dto: CreateTaskDto): Promise<Task> {
    const user = req.user as AuthUser;
    return this.todoService.createTask(user.id, dto);
  }

  @Patch(':id')
  updateTaskById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    const user = req.user as AuthUser;
    return this.todoService.updateTaskById(user.id, taskId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTaskById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<void> {
    const user = req.user as AuthUser;
    return this.todoService.deleteTaskById(user.id, taskId);
  }
}
