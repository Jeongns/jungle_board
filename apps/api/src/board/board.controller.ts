import { Controller, Get, Query } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardPageReqeust } from './dto/get-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  getPaginatedPosts(@Query() boardPageReqeust: BoardPageReqeust) {
    return this.boardService.getPaginatedPosts(boardPageReqeust);
  }
}
