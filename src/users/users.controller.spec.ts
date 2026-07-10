import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: {
    findOne: jest.Mock;
    find: jest.Mock;
    remove: jest.Mock;
    update: jest.Mock;
  };

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'hashed.password',
  } as User;

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn().mockResolvedValue(mockUser),
      find: jest.fn().mockResolvedValue([mockUser]),
      remove: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(mockUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findUser', () => {
    it('returns a user by id', async () => {
      const user = await controller.findUser(1);

      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(user).toEqual(mockUser);
    });
  });

  describe('findAllUsers', () => {
    it('returns users when email matches the current user', async () => {
      const users = await controller.findAllUsers('test@test.com', mockUser);

      expect(usersService.find).toHaveBeenCalledWith('test@test.com');
      expect(users).toEqual([mockUser]);
    });

    it('throws if email does not match the current user', () => {
      expect(() =>
        controller.findAllUsers('other@test.com', mockUser),
      ).toThrow(ForbiddenException);
    });
  });

  describe('removeUser', () => {
    it('removes a user by id', async () => {
      const user = await controller.removeUser(1);

      expect(usersService.remove).toHaveBeenCalledWith(1);
      expect(user).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('updates a user by id', async () => {
      const body = { email: 'new@test.com' };
      const user = await controller.updateUser(1, body);

      expect(usersService.update).toHaveBeenCalledWith(1, body);
      expect(user).toEqual(mockUser);
    });
  });
});
