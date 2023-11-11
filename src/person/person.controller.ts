import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseInterceptors
} from '@nestjs/common';
import { AppInterceptor } from 'src/app.interceptor';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonService } from './person.service';

@Controller('api/person')
@UseInterceptors(AppInterceptor)
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post('file/base64')
  file1(@Body() file: string) {
    console.log(file);
    return file;
  }

  @Post()
  body(@Body() createPersonDto: CreatePersonDto) {
    return `received: ${JSON.stringify(createPersonDto)}`;
  }

  @Get('find')
  queryParam(@Query('name') name: string, @Query('age') age: number) {
    return `received: name ${name},age = ${age}`;
  }

  @Get(':id')
  urlParam(@Param('id') id: string) {
    return `received: id ${id}`;
  }

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
