import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    findOneBy: jest.Mock;
    find: jest.Mock;
    remove: jest.Mock;
  };

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'hashed.password',
  } as User;

  beforeEach(async () => {
    repo = {
      create: jest.fn().mockReturnValue(mockUser),
      save: jest.fn().mockResolvedValue(mockUser),
      findOneBy: jest.fn().mockResolvedValue(mockUser),
      find: jest.fn().mockResolvedValue([mockUser]),
      remove: jest.fn().mockResolvedValue(mockUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates and saves a user', async () => {
      const user = await service.create('test@test.com', 'password');

      expect(repo.create).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password',
      });
      expect(repo.save).toHaveBeenCalledWith(mockUser);
      expect(user).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('returns a user by id', async () => {
      const user = await service.findOne(1);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(user).toEqual(mockUser);
    });
  });

  describe('find', () => {
    it('returns users by email', async () => {
      const users = await service.find('test@test.com');

      expect(repo.find).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
      expect(users).toEqual([mockUser]);
    });
  });

  describe('update', () => {
    it('updates and saves a user', async () => {
      const user = await service.update(1, { email: 'new@test.com' });

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repo.save).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it('hashes the password when updating', async () => {
      await service.update(1, { password: 'newpassword' });

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: expect.not.stringMatching('newpassword') as string,
        }),
      );
    });

    it('throws if user is not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, { email: 'new@test.com' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('removes a user', async () => {
      const user = await service.remove(1);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repo.remove).toHaveBeenCalledWith(mockUser);
      expect(user).toEqual(mockUser);
    });

    it('throws if user is not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
