const app = require('../../app');
const request = require('supertest');

jest.mock('../../middlewares/clerkAuthMiddleware', () => {
    return (req, res, next) => {
      req.auth = { userId: process.env.TEST_USER_ID };
      next();
    };
});

describe("GET /api/overview/monthly-transactions", () => {
    it("should return monthly transaction data from a populated year", async () => {
        const res = await request(app).get("/api/overview/monthly-transactions?year=2024");
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    month: expect.any(Number),
                    total_amount: expect.any(String),
                    type: expect.any(String)
                })
            ])
        );
    });

    it("should return an empty array from an empty year", async () => {
        const res = await request(app).get("/api/overview/monthly-transactions");
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual([]);
    });

    it("should return an empty array from an unpopulated year", async () => {
        const res = await request(app).get("/api/overview/monthly-transactions?year=12");
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual([]);
    });

    it("should return an error message from an invalid year", async () => {
        const res = await request(app).get("/api/overview/monthly-transactions?year=invalid");
        expect(res.statusCode).toBe(500);
        expect(res.body).toStrictEqual({ message: "Something went wrong with getting monthly transaction data" });
    });
});

describe("GET /api/overview/summary", () => {
    it("should return summary data from a populated month and year", async () => {
        const res = await request(app).get("/api/overview/summary?month=1&year=2024");
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(
            expect.objectContaining({
                finances: expect.objectContaining({
                    expense: expect.any(String),
                    income: expect.any(String),
                    netIncome: expect.any(String)
                }),
                frequentSpendingCategories: expect.arrayContaining([
                    expect.objectContaining({
                        colour: expect.any(String),
                        count: expect.any(String),
                        icon: expect.any(String),
                        name: expect.any(String)
                    })
                ]),
                topSpendingCategories: expect.arrayContaining([
                    expect.objectContaining({
                        colour: expect.any(String),
                        icon: expect.any(String),
                        name: expect.any(String),
                        total_spent: expect.any(String)
                    })
                ])
            })
        );
    });

    it("should return summary data from a populated year", async () => {
        const res = await request(app).get("/api/overview/summary?month=0&year=2024");
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(
            expect.objectContaining({
                finances: expect.objectContaining({
                    expense: expect.any(String),
                    income: expect.any(String),
                    netIncome: expect.any(String)
                }),
                frequentSpendingCategories: expect.arrayContaining([
                    expect.objectContaining({
                        colour: expect.any(String),
                        count: expect.any(String),
                        icon: expect.any(String),
                        name: expect.any(String)
                    })
                ]),
                topSpendingCategories: expect.arrayContaining([
                    expect.objectContaining({
                        colour: expect.any(String),
                        icon: expect.any(String),
                        name: expect.any(String),
                        total_spent: expect.any(String)
                    })
                ])
            })
        );
    });

    it("should return summary data from an unpopulated month and year", async () => {
        const res = await request(app).get("/api/overview/summary?month=2&year=19");
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(
            expect.objectContaining({
                finances: expect.objectContaining({
                    expense: "0.00",
                    income: "0.00",
                    netIncome: "0.00"
                }),
                frequentSpendingCategories: [],
                topSpendingCategories: []
            })
        );
    })

    it("should return an error message from an empty month and year", async () => {
        const res = await request(app).get("/api/overview/summary");
        expect(res.statusCode).toBe(500);
        expect(res.body).toStrictEqual({ message: "Something went wrong with getting financial summary" });
    });

    it("should return an error message from an invalid month and year", async () => {
        const res = await request(app).get("/api/overview/summary?month=invalid&year=invalid");
        expect(res.statusCode).toBe(500);
        expect(res.body).toStrictEqual({ message: "Something went wrong with getting financial summary" });
    });

    it("should return an error message from an invalid month", async () => {
        const res = await request(app).get("/api/overview/summary?month=invalid&year=2024");
        expect(res.statusCode).toBe(500);
        expect(res.body).toStrictEqual({ message: "Something went wrong with getting financial summary" });
    });

    it("should return an error message from an invalid year", async () => {
        const res = await request(app).get("/api/overview/summary?month=1&year=invalid");
        expect(res.statusCode).toBe(500);
        expect(res.body).toStrictEqual({ message: "Something went wrong with getting financial summary" });
    });
});