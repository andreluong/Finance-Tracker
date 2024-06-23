const app = require('../../app');
const request = require('supertest');

jest.mock('../../middlewares/clerkAuthMiddleware', () => {
    return (req, res, next) => {
      req.auth = { userId: process.env.TEST_USER_ID };
      next();
    };
});

describe("GET /api/statistics/income-expense-stats", () => {
    it("should return income and expense statistics", async () => {
        const res = await request(app).get("/api/statistics/income-expense-stats");
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
            income: expect.objectContaining({
                count: expect.any(String),
                total: expect.any(String),
                categories: expect.arrayContaining([
                    expect.objectContaining({
                        colour: expect.any(String),
                        count: expect.any(String),
                        name: expect.any(String),
                        total: expect.any(String),
                        type: expect.any(String)
                    })
                ])
            }),
            expense: expect.objectContaining({
                count: expect.any(String),
                total: expect.any(String),
                categories: expect.arrayContaining([
                    expect.objectContaining({
                        colour: expect.any(String),
                        count: expect.any(String),
                        name: expect.any(String),
                        total: expect.any(String),
                        type: expect.any(String)
                    })
                ])
            })
        });
    });
});