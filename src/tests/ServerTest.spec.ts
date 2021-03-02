import request, { Response } from 'supertest';
import { app, server } from '../server';

// Prevent Console Logs
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe('Test Server Up', () => {
  it('should test if server is up', async () => {
    const result : Response = await request(app)
    .get('/test');
    expect(result.status).toBe(202);
    expect(result.body).toStrictEqual({ result: true });
    server.close();
  })  
})