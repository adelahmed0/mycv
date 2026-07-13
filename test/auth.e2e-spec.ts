import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import cookieSession from 'cookie-session';
import { AppModule } from './../src/app.module';

describe('Authentication system', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      cookieSession({
        keys: ['asdfasdf'],
      }),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
  });

  it('handles a signup request', () => {
    const email = `test1234@test.com`;
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

  it('signup as a new user then get the currently logged in user', async () => {
    const email = `test1234@test.com`;
    const res = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({ email, password: '123456' })
      .expect(201);
    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer());
    await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);
    expect(body.email).toEqual(email);
  });
});
