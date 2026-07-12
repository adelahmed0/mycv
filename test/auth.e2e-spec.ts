import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setup-app';

describe('Authentication system', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  it('handles a signup request', () => {
    const email = `test${Date.now()}@test.com`;
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({ email, password: '123456' })
      .expect(201)
      .then((res) => {
        const body = res.body as { id: number; email: string };
        expect(body.id).toBeDefined();
        expect(body.email).toEqual(email);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
