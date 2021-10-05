import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../../users/users.service';
import { mockedConfigService } from '../../../utils/mocks/config.service';
import { mockedJwtService } from '../../../utils/mocks/jwt.service';
import { userStub } from '../../../utils/stubs/user.stub';
import { User } from '../../users/user.entity';
import { AuthenticationController } from '../authentication.controller';
import { AuthenticationService } from '../authentication.service';
import * as request from 'supertest';

describe('AuthenticationController', () => {
  let app: INestApplication;
  let userData: User;

  beforeEach(async () => {
    userData = { ...userStub };

    const usersRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        UsersService,
        AuthenticationService,
        { provide: ConfigService, useValue: mockedConfigService },
        { provide: JwtService, useValue: mockedJwtService },
        { provide: getRepositoryToken(User), useValue: usersRepository },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the data of the user without password', () => {
        const expectedData = { ...userStub };
        delete expectedData.password;

        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            email: userStub.email,
            username: userStub.username,
            password: userStub.password,
          })
          .expect(201)
          .expect(expectedData);
      });
    });

    describe('and using invalid data', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({ username: userStub.username })
          .expect(400);
      });
    });
  });
});
