import request from 'supertest';
import app from '../../server';

describe('API Integration Tests', () => {
  describe('Root endpoint', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Web3 Message Verifier API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('health', '/api/health');
      expect(response.body.endpoints).toHaveProperty('verifySignature', 'POST /api/verify-signature');
    });
  });

  describe('API Health Check', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version', '1.0.0');
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Content-Type Validation', () => {
    it('should reject non-JSON content type', async () => {
      const response = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'text/plain')
        .send('invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain('Content-Type must be application/json');
    });
  });

  describe('Rate Limiting', () => {
    it('should not rate limit normal usage', async () => {
      // Make several requests in quick succession
      const promises = Array(5).fill(null).map(() => 
        request(app).get('/api/health')
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('404 Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body.message).toContain('Route GET /api/unknown-route not found');
    });
  });

  describe('Signature Verification Integration', () => {
    it('should handle complete verification flow', async () => {
      const testRequest = {
        message: 'Test message',
        signature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      };

      const response = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send(testRequest);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isValid');
      expect(response.body).toHaveProperty('originalMessage', testRequest.message);
      expect(typeof response.body.isValid).toBe('boolean');
    });

    it('should validate request body structure', async () => {
      const response = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app).get('/');

      // Helmet adds various security headers
      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });

  describe('Request Body Size Limits', () => {
    it('should handle normal sized requests', async () => {
      const normalRequest = {
        message: 'A'.repeat(1000), // 1KB message
        signature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      };

      const response = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send(normalRequest);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('originalMessage', normalRequest.message);
    });
  });
});