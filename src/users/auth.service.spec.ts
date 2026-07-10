import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      findOne: (id: number) => {
        const user = users.find((u) => u.id === id);
        return Promise.resolve(user ?? null);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 1000000),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if signin password is correct', async () => {
    const createdUser = await service.signup('test@test.com', 'password');
    const user = await service.signin('test@test.com', 'password');

    expect(user.id).toEqual(createdUser.id);
    expect(user.email).toEqual('test@test.com');
  });

  describe('findOne', () => {
    it('throws if user is not logged in', async () => {
      await expect(service.findOne()).rejects.toThrow(UnauthorizedException);
    });

    it('throws if user is not found', async () => {
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('returns a user if id is valid', async () => {
      const createdUser = await service.signup('test@test.com', 'password');
      const user = await service.findOne(createdUser.id);

      expect(user).toEqual(createdUser);
    });
  });
});
