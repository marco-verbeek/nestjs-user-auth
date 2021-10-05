import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import { mockedConfigService } from '../../../utils/mocks/config.service';
import { mockedJwtService } from '../../../utils/mocks/jwt.service';
import { AuthenticationService } from '../authentication.service';
import * as bcrypt from 'bcrypt';
import { userStub } from '../../../utils/stubs/user.stub';

jest.mock('bcrypt');

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let usersService: UsersService;

  let bcryptCompare: jest.Mock;
  let findUser: jest.Mock;

  let userData: User;

  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    userData = {
      ...userStub,
    };

    findUser = jest.fn().mockResolvedValue(userData);
    const usersRepository = {
      findOne: findUser,
    };

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthenticationService,
        { provide: ConfigService, useValue: mockedConfigService },
        { provide: JwtService, useValue: mockedJwtService },
        { provide: getRepositoryToken(User), useValue: usersRepository },
      ],
    }).compile();

    authenticationService = await module.get(AuthenticationService);
    usersService = await module.get(UsersService);
  });

  describe('when accessing the data of the authenticating user', () => {
    it('should attempt to get the user by email', async () => {
      const getByEmailSpy = jest.spyOn(usersService, 'getByEmail');

      await authenticationService.getAuthenticatedUser(
        'user@mail.be',
        'strong-password!',
      );

      expect(getByEmailSpy).toBeCalledTimes(1);
    });

    describe('and the provided password is incorrect', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });

      it('should throw an error', async () => {
        await expect(
          authenticationService.getAuthenticatedUser(
            userStub.email,
            userStub.password,
          ),
        ).rejects.toThrow();
      });
    });

    describe('and the provided password is correct', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });

      describe('and the user is found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(userData);
        });

        it('should return the user data', async () => {
          const user = await authenticationService.getAuthenticatedUser(
            userStub.email,
            userStub.password,
          );
          expect(user).toBe(userData);
        });
      });

      describe('and the user is not found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(undefined);
        });

        it('should throw an error', async () => {
          await expect(
            authenticationService.getAuthenticatedUser(
              userStub.email,
              userStub.password,
            ),
          ).rejects.toThrow();
        });
      });
    });
  });
});
