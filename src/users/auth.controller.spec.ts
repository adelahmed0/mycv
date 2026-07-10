import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './users.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { signup: jest.Mock; signin: jest.Mock };

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'hashed.password',
  } as User;

  beforeEach(async () => {
    authService = {
      signup: jest.fn().mockResolvedValue(mockUser),
      signin: jest.fn().mockResolvedValue(mockUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('whoami', () => {
    it('returns the current user', () => {
      expect(controller.whoami(mockUser)).toEqual(mockUser);
    });
  });

  describe('signOut', () => {
    it('clears the session userId', () => {
      const session = { userId: 1 };

      controller.signOut(session);

      expect(session.userId).toBeUndefined();
    });
  });

  describe('signUp', () => {
    it('calls authService.signup and stores userId in session', async () => {
      const session = { userId: undefined as number | undefined };
      const body = { email: 'test@test.com', password: 'password' };

      const user = await controller.signUp(body, session);

      expect(authService.signup).toHaveBeenCalledWith(
        'test@test.com',
        'password',
      );
      expect(session.userId).toEqual(1);
      expect(user).toEqual(mockUser);
    });

    it('propagates errors from authService.signup', async () => {
      authService.signup.mockRejectedValue(
        new BadRequestException('email in use'),
      );

      await expect(
        controller.signUp(
          { email: 'test@test.com', password: 'password' },
          { userId: undefined },
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('signIn', () => {
    it('calls authService.signin and stores userId in session', async () => {
      const session = { userId: undefined as number | undefined };
      const body = { email: 'test@test.com', password: 'password' };

      const user = await controller.signIn(body, session);

      expect(authService.signin).toHaveBeenCalledWith(
        'test@test.com',
        'password',
      );
      expect(session.userId).toEqual(1);
      expect(user).toEqual(mockUser);
    });

    it('propagates errors from authService.signin', async () => {
      authService.signin.mockRejectedValue(
        new NotFoundException('user not found'),
      );

      await expect(
        controller.signIn(
          { email: 'test@test.com', password: 'password' },
          { userId: undefined },
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
