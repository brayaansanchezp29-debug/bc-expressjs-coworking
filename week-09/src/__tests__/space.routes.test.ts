// ============================================================
// INTEGRATION TESTS — spaces routes
// ============================================================
// Ciclo completo HTTP → controller → service → DB en memoria.
// SIN mocks de la capa de servicio. Dominio: Coworking Space.
// ============================================================

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app';

let mongod: MongoMemoryServer;
let userToken: string;
let userId: string;
let adminToken: string;

async function registerAndLogin(
  email: string,
  role: 'user' | 'admin' = 'user'
): Promise<{ token: string; id: string }> {
  const registerRes = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Test User', email, password: 'Password1!' });

  const { UserModel } = await import('../models/user.model');
  const createdUser = await UserModel.findOne({ email }).lean();
  const id = String(createdUser?._id ?? registerRes.body.data?.id ?? registerRes.body.data?._id ?? '');

  // El registro siempre crea rol 'user' — para pruebas de admin, se
  // promueve directamente en la base de datos (no hay endpoint de
  // gestión de roles en este dominio).
  if (role === 'admin') {
    await UserModel.findByIdAndUpdate(id, { role: 'admin' }, { new: true });
  }

  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password: 'Password1!' });

  return { token: loginRes.body.accessToken as string, id: String(id) };
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key]?.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Spaces Routes — Integration Tests', () => {
  describe('GET /api/v1/spaces', () => {
    it('should return 200 and empty array initially', async () => {
      const res = await request(app).get('/api/v1/spaces');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.total).toBe(0);
    });
  });

  describe('POST /api/v1/spaces', () => {
    beforeEach(async () => {
      const auth = await registerAndLogin('owner@test.com');
      userToken = auth.token;
      userId = auth.id;
    });

    it('should return 201 with valid data and token', async () => {
      const res = await request(app)
        .post('/api/v1/spaces')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Sala Ártico', code: 'SP-001', capacity: 8, pricePerHour: 25 });

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        name: 'Sala Ártico',
        code: 'SP-001',
        capacity: 8,
      });
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/v1/spaces')
        .send({ name: 'Sala Ártico', code: 'SP-001', capacity: 8, pricePerHour: 25 });

      expect(res.status).toBe(401);
    });

    it('should return 422 with invalid data', async () => {
      const res = await request(app)
        .post('/api/v1/spaces')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'A', capacity: -1 }); // name muy corto, sin code, capacity negativa

      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/v1/spaces/:id', () => {
    let spaceId: string;

    beforeEach(async () => {
      const auth = await registerAndLogin('owner2@test.com');
      userToken = auth.token;

      const createRes = await request(app)
        .post('/api/v1/spaces')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Sala Boreal', code: 'SP-002', capacity: 12, pricePerHour: 30 });

      spaceId = createRes.body.data._id;
    });

    it('should return 200 with existing space', async () => {
      const res = await request(app).get(`/api/v1/spaces/${spaceId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.code).toBe('SP-002');
    });

    it('should return 404 with non-existent ID', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/v1/spaces/${fakeId}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/spaces/:id', () => {
    let spaceId: string;
    let ownerToken: string;
    let otherToken: string;

    beforeEach(async () => {
      const owner = await registerAndLogin('owner3@test.com');
      ownerToken = owner.token;
      const other = await registerAndLogin('intruder@test.com');
      otherToken = other.token;

      const createRes = await request(app)
        .post('/api/v1/spaces')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Oficina Privada', code: 'SP-003', capacity: 4, pricePerHour: 45 });

      spaceId = createRes.body.data._id;
    });

    it('should return 200 with valid data', async () => {
      const res = await request(app)
        .put(`/api/v1/spaces/${spaceId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ pricePerHour: 50 });

      expect(res.status).toBe(200);
      expect(res.body.data.pricePerHour).toBe(50);
    });

    it('should return 403 when a non-owner, non-admin user tries to update', async () => {
      const res = await request(app)
        .put(`/api/v1/spaces/${spaceId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ pricePerHour: 999 });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/spaces/:id', () => {
    let spaceId: string;
    let ownerToken: string;

    beforeEach(async () => {
      const owner = await registerAndLogin('owner4@test.com');
      ownerToken = owner.token;

      const createRes = await request(app)
        .post('/api/v1/spaces')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Cabina de Llamadas', code: 'SP-004', capacity: 1, pricePerHour: 4 });

      spaceId = createRes.body.data._id;
    });

    it('should return 204 when the owner deletes', async () => {
      const res = await request(app)
        .delete(`/api/v1/spaces/${spaceId}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(204);
    });

    it('should return 403 when a non-admin, non-owner user tries to delete', async () => {
      const other = await registerAndLogin('intruder2@test.com');

      const res = await request(app)
        .delete(`/api/v1/spaces/${spaceId}`)
        .set('Authorization', `Bearer ${other.token}`);

      expect(res.status).toBe(403);
    });

    it('should allow an admin to delete a space they do not own', async () => {
      const admin = await registerAndLogin('admin@test.com', 'admin');
      adminToken = admin.token;

      const res = await request(app)
        .delete(`/api/v1/spaces/${spaceId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
    });
  });
});

export {};
