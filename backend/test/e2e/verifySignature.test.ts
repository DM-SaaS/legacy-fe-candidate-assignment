import request from 'supertest';
import app from '../../src'; // Adjust the import if your app export path is different
import { server } from '../../src'; // Make sure your app exports the server

const jwtToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjM4Y2YxNWU3LTljNjItNGVjYi04OWRjLTQwODg0ZmRmNDIwZiJ9.eyJraWQiOiIzOGNmMTVlNy05YzYyLTRlY2ItODlkYy00MDg4NGZkZjQyMGYiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxNzQiLCJpc3MiOiJhcHAuZHluYW1pY2F1dGguY29tLzhlYzI1NTUzLWRjMWItNGUyNi05ZDc3LTBiMmQ5NzY0MjhmYSIsInN1YiI6ImEwMWJmMDNlLWMzZTItNDcxYi1hZDE2LWMyNGI5ZDIxZjQ2OCIsInNpZCI6IjJjZmExZWEwLTgwN2ItNDgzOS1hZGFmLTZkOTUyNDkzMWVlOCIsInNlc3Npb25fcHVibGljX2tleSI6IjAyZmUwZjFjNDRhMGJhNDRiNzZhMWZmMDVlNmJlZGMxN2M2MTBhYTI3NDVkMTJmZWUwNDhjNzUwYWI2ZTk5MDgxYSIsImVtYWlsIjoibmtuYXBweTEyM0BnbWFpbC5jb20iLCJlbnZpcm9ubWVudF9pZCI6IjhlYzI1NTUzLWRjMWItNGUyNi05ZDc3LTBiMmQ5NzY0MjhmYSIsImxpc3RzIjpbXSwibWlzc2luZ19maWVsZHMiOltdLCJ2ZXJpZmllZF9jcmVkZW50aWFscyI6W3siYWRkcmVzcyI6IjB4QjhiNzNjRTc5MmRDMzY3RUNmNGUxMTFCMDY3Y2U4MGRjODY2OERjNyIsImNoYWluIjoiZWlwMTU1IiwiaWQiOiIzYzE0N2Y3Mi1lMzkwLTRlNmQtOTYyMC1kMjAyZjU3ZjEwMzkiLCJuYW1lX3NlcnZpY2UiOnt9LCJwdWJsaWNfaWRlbnRpZmllciI6IjB4YjhiNzNjZTc5MmRjMzY3ZWNmNGUxMTFiMDY3Y2U4MGRjODY2OGRjNyIsIndhbGxldF9uYW1lIjoiZHluYW1pY3dhYXMiLCJ3YWxsZXRfcHJvdmlkZXIiOiJlbWJlZGRlZFdhbGxldCIsIndhbGxldF9wcm9wZXJ0aWVzIjp7ImtleVNoYXJlcyI6W3siaWQiOiJjMGM1M2JhNi0zYmZlLTRiMDgtODgxNS0yMWQzZDhlOTk4MWQiLCJiYWNrdXBMb2NhdGlvbiI6ImR5bmFtaWMiLCJwYXNzd29yZEVuY3J5cHRlZCI6ZmFsc2V9XSwidGhyZXNob2xkU2lnbmF0dXJlU2NoZW1lIjoiVFdPX09GX1RXTyIsImRlcml2YXRpb25QYXRoIjoie1wiMFwiOjQ0LFwiMVwiOjYwLFwiMlwiOjAsXCIzXCI6MCxcIjRcIjowfSJ9LCJmb3JtYXQiOiJibG9ja2NoYWluIiwibGFzdFNlbGVjdGVkQXQiOiIyMDI1LTA2LTI2VDA5OjM1OjQzLjM0OFoiLCJzaWduSW5FbmFibGVkIjpmYWxzZX0seyJhZGRyZXNzIjoiMHg5Qjg3ZTc2RThlQTZEMDBFMjQyMUNCN0UwZWFhMDhlNzk0RDc5QzEwIiwiY2hhaW4iOiJlaXAxNTUiLCJpZCI6ImIzMDVhYmJiLWNiZDQtNGI4ZS1iYzE1LTUyOWNhNmJhMTQ5NSIsIm5hbWVfc2VydmljZSI6e30sInB1YmxpY19pZGVudGlmaWVyIjoiMHg5Yjg3ZTc2ZThlYTZkMDBlMjQyMWNiN2UwZWFhMDhlNzk0ZDc5YzEwIiwid2FsbGV0X25hbWUiOiJkeW5hbWljd2FhcyIsIndhbGxldF9wcm92aWRlciI6ImVtYmVkZGVkV2FsbGV0Iiwid2FsbGV0X3Byb3BlcnRpZXMiOnsia2V5U2hhcmVzIjpbeyJpZCI6IjE0YTkzNmYwLWFlMWEtNGEyYy1iOTM0LWRjMzY5ZjU1YzE5OSIsImJhY2t1cExvY2F0aW9uIjoiZHluYW1pYyIsInBhc3N3b3JkRW5jcnlwdGVkIjpmYWxzZX1dLCJ0aHJlc2hvbGRTaWduYXR1cmVTY2hlbWUiOiJUV09fT0ZfVFdPIiwiZGVyaXZhdGlvblBhdGgiOiJ7XCIwXCI6NDQsXCIxXCI6NjAsXCIyXCI6MCxcIjNcIjowLFwiNFwiOjB9In0sImZvcm1hdCI6ImJsb2NrY2hhaW4iLCJsYXN0U2VsZWN0ZWRBdCI6IjIwMjUtMDYtMjVUMTQ6MDI6MDEuNTEzWiIsInNpZ25JbkVuYWJsZWQiOmZhbHNlfSx7ImVtYWlsIjoibmtuYXBweTEyM0BnbWFpbC5jb20iLCJpZCI6ImY4NjgxODViLWUzYmQtNGU4OC1iZGVkLWY3M2FiZTFhNWU5ZiIsInB1YmxpY19pZGVudGlmaWVyIjoibmtuYXBweTEyM0BnbWFpbC5jb20iLCJmb3JtYXQiOiJlbWFpbCIsInNpZ25JbkVuYWJsZWQiOnRydWV9XSwibGFzdF92ZXJpZmllZF9jcmVkZW50aWFsX2lkIjoiZjg2ODE4NWItZTNiZC00ZTg4LWJkZWQtZjczYWJlMWE1ZTlmIiwiZmlyc3RfdmlzaXQiOiIyMDI1LTA2LTI1VDE0OjAxOjU2LjQxMloiLCJsYXN0X3Zpc2l0IjoiMjAyNS0wNi0yNlQwOTozNTo0My4yNTlaIiwibmV3X3VzZXIiOmZhbHNlLCJtZXRhZGF0YSI6e30sInZlcmlmaWVkQ3JlZGVudGlhbHNIYXNoZXMiOnsiYmxvY2tjaGFpbiI6IjUzZWQ1NmQxMzVhZTY1ODBmOGNkYjRiOTc0ZmE3ZDY2IiwiZW1haWwiOiIzNWYyMjA3ZjgyY2E1ODk5YzkxMzZkOTgxNTEyZTg3NCJ9LCJpYXQiOjE3NTA5MzA1NDMsImV4cCI6MTc1MDkzNzc0M30.oq8n0hWXGY1eaEcJ43lCScPihyPIBylQH9zV_V8Ap7XaNSdLwkxSZUXWnO3I-kO9Agt1uBzusff2MuL4AJoBh7Ih0ZLSd8HSYnjVX8SeTgeY5lwpln0ZsyXIkj-yuTTQLUbdsVQFiNO8eNiLFpx_U2wbGCOJZ8n3AO3BRTy4sHeQ0UN9l7SvcEqesiMoZJaiuSOP2Eek7Q3Y-pwmNyeeJbewFd9pYVAYJ0jZC5pz6p6IjweTV4Vga3jAQ5F9BKVm8tEFOhAG5GJXDpsCWL8fvP6KD0q7UvYKcER9JTHHDNnI55XkKHTYWU1SF3JE4-yySyh4Sii-hQffzHn1w6F4A3zLqJRuV4x0YvaT29TOruqy4ybbALahEt6qfzulJc6V-RTfJOjERtmZObcW-ln36c2ttC9uLgFvKP8u27l5WaPYn0t0koftBwbb-rPfZdP_cI9OjP1prvHKosVEJG2L_XZCdLnTIhs3INV--8f9l6slyev_d00hgH5tsjbDWC_4V0EljMCXP8MHnkV1Zz-Uk35dQ6CMB4SjazDmPj8c5AmKRq91HNdivn_UupC6RX1eFwgvyWRX50bV9NDOp7qlWzr4UzpY2pVfEUMPVmcsm_X23tyCy8pybXSJIglte-VnQqVK-5jaOQUaJA-j7Ea-vkup1f4AeWsa3NxGwVld068';

const signature = '0xbe47b3aadd4add6b0c7f5eb717c81ccf0230fccd4251cba426f7a599d8e7709026b42781d579b43e4f7be0964ad24dc774f7be774307bb038939f28d9cace2701b';
const originalMessage = 'hello world';


afterAll((done) => {
  server.close(done);
});

describe('Signature Verification E2E', () => {
  it('should verify a signature and return success', async () => {
    const res = await request(app)
      .post('/verify-signature')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ signature, message:originalMessage });
    expect(res.status).toBe(200);
  });

  it('should get all signatures for the user', async () => {
    const res = await request(app)
      .get('/verify-signature')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          originalMessage,
          signedMessage: signature,
        }),
      ])
    );
  });
});

describe('Signature Verification E2E - Error Scenarios', () => {
  it('should return 401 for missing token', async () => {
    const res = await request(app)
      .post('/verify-signature')
      .send({ signature, message: originalMessage });

    expect(res.status).toBe(401);

  });

  it('should return 400 for invalid input (missing signature)', async () => {
    const res = await request(app)
      .post('/verify-signature')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ message: originalMessage });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 for invalid input (missing message)', async () => {
    const res = await request(app)
      .post('/verify-signature')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ signature });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 for invalid input (empty body)', async () => {
    const res = await request(app)
      .post('/verify-signature')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
