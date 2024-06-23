const app = require('../../app');
const request = require('supertest');
const path = require('path');

jest.mock('../../middlewares/clerkAuthMiddleware', () => {
    return (req, res, next) => {
      req.auth = { userId: process.env.TEST_USER_ID };
      next();
    };
});

describe("POST /api/transactions/create", () => {
    it("should create a transaction", async () => {
        const payload = {
            name: "test transaction",
            amount: "100",
            date: new Date(2024, 1, 2).toUTCString(),
            type: "expense",
            category: 26, // Entertainment
            description: "Lunch"
        };

        const res = await request(app)
            .post("/api/transactions/create")
            .send(payload)
            .set('Content-Type', 'application/json');
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toStrictEqual({
            message: "Transaction created"
        });
    });

    it("should return an error if the transaction is invalid", async () => {
        const payload = {
            name: "test transaction",
            amount: "100",
            date: new Date(2024, 1, 2).toUTCString(),
            type: "expense",
            category: "Invalid", // Invalid category
            description: "Lunch"
        };

        const res = await request(app)
            .post("/api/transactions/create")
            .send(payload)
            .set('Content-Type', 'application/json');
        
        expect(res.statusCode).toBe(500);
        expect(res.body).toStrictEqual({
            error: "Error creating transaction"
        });
    });
});

describe("POST /api/transactions/process/csv", () => {
    it("should process a CSV file", async () => {
        const filePath = path.join(__dirname, '../resources/data.csv');

        const res = await request(app)
            .post("/api/transactions/process/csv")
            .attach('file', filePath)
            .set('Content-Type', 'multipart/form-data');
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toStrictEqual({
            message: "Transaction import completed"
        });
    });

    it("should return an error if the file type is invalid", async () => {
        const filePath = path.join(__dirname, '../resources/invalid-file.txt');

        const res = await request(app)
            .post("/api/transactions/process/csv")
            .attach('file', filePath)
            .set('Content-Type', 'multipart/form-data');
        
        expect(res.statusCode).toBe(500);
        expect(res.error.text).toContain("Invalid file type");
    });

    it("should return an error if the file headers are invalid", async () => {
        const filePath = path.join(__dirname, '../resources/invalid-headers.csv');

        const res = await request(app)
            .post("/api/transactions/process/csv")
            .attach('file', filePath)
            .set('Content-Type', 'multipart/form-data');
        
        expect(res.statusCode).toBe(500);
        expect(res.body).toStrictEqual({
            error: "Something went wrong with transaction import"
        });
    });

    it("should return an error if the file data is invalid", async () => {
        const filePath = path.join(__dirname, '../resources/invalid-data.csv');

        const res = await request(app)
            .post("/api/transactions/process/csv")
            .attach('file', filePath)
            .set('Content-Type', 'multipart/form-data');
        
        expect(res.statusCode).toBe(500);
        expect(res.body).toStrictEqual({
            error: "Something went wrong with transaction import"
        });
    });

    it("should return an error if no file is uploaded", async () => {
        const res = await request(app)
            .post("/api/transactions/process/csv");
        
        expect(res.statusCode).toBe(400);
        expect(res.body).toStrictEqual({
            error: "No file uploaded"
        });
    });
});

describe("GET /api/transactions/recent", () => {
    it("should get ten recent transactions", async () => {
        const res = await request(app)
            .get("/api/transactions/recent");
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(20);
    });
});

describe("GET /api/transactions/all", () => {
    it("should get all transactions with no filters", async () => {
        const res = await request(app)
            .get("/api/transactions/all");
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    created_at: expect.any(String),
                    amount: expect.any(String),
                    name: expect.any(String),
                    category: expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                        value: expect.any(String),
                        icon: expect.any(String),
                        colour: expect.any(String),
                        type: expect.any(String),
                    }),
                    description: expect.any(String),
                    type: expect.any(String),
                    date: expect.any(String),
                    user_id: expect.any(String)
                })
            ])
        );
    });

    it("should get all transactions with a period filter", async () => {
        const res = await request(app)
            .get("/api/transactions/all?period=2024");
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    created_at: expect.any(String),
                    amount: expect.any(String),
                    name: expect.any(String),
                    category: expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                        value: expect.any(String),
                        icon: expect.any(String),
                        colour: expect.any(String),
                        type: expect.any(String),
                    }),
                    description: expect.any(String),
                    type: expect.any(String),
                    date: expect.any(String),
                    user_id: expect.any(String)
                })
            ])
        );
    });
});

describe("PATCH /api/transactions/update/:id", () => {
    it("should update a transaction", async () => {
        const payload = {
            name: "updated test transaction",
            amount: "200",
            date: new Date(2024, 1, 2).toUTCString(),
            type: "income",
            category: 24, // Government
            description: "test description"
        };

        const res = await request(app)
            .patch("/api/transactions/update/292")
            .send(payload)
            .set('Content-Type', 'application/json');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
            message: "Transaction updated"
        });
    });

    it("should return an error if the transaction is invalid", async () => {
        const payload = {
            name: "updated test transaction",
            amount: "200",
            date: new Date(2024, 1, 2).toUTCString(),
            type: "income",
            category: "Invalid", // Invalid category
            description: "test description"
        };

        const res = await request(app)
            .patch("/api/transactions/update/292")
            .send(payload)
            .set('Content-Type', 'application/json');
        
        expect(res.statusCode).toBe(500);
        expect(res.body).toStrictEqual({
            error: "Something went wrong with updating transaction"
        });
    });
});

describe("GET /api/transactions/category/stats", () => {
    it("should get category stats for income type", async () => {
        const res = await request(app)
            .get("/api/transactions/category/stats?type=income&period=2024");
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(
            expect.objectContaining({
                categoryStats: expect.arrayContaining([
                    expect.objectContaining({
                        colour: expect.any(String),
                        count: expect.any(String),
                        name: expect.any(String),
                        percentage: expect.any(String),
                        total: expect.any(String),
                        type: expect.any(String)
                    })
                ]),
                incomeTotal: expect.anything(),
                expenseTotal: expect.anything()
            })
        );
    });

    it("should get category stats for expense type", async () => {
        const res = await request(app)
            .get("/api/transactions/category/stats?type=expense&period=2024");
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(
            expect.objectContaining({
                categoryStats: expect.arrayContaining([
                    expect.objectContaining({
                        colour: expect.any(String),
                        count: expect.any(String),
                        name: expect.any(String),
                        percentage: expect.any(String),
                        total: expect.any(String),
                        type: expect.any(String)
                    })
                ]),
                incomeTotal: expect.anything(),
                expenseTotal: expect.anything()
            })
        );
    });

    it("should get category stats for all types", async () => {
        const res = await request(app)
            .get("/api/transactions/category/stats?type=all&period=2024");
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(
            expect.objectContaining({
                categoryStats: expect.arrayContaining([
                    expect.objectContaining({
                        colour: expect.any(String),
                        count: expect.any(String),
                        name: expect.any(String),
                        percentage: expect.any(String),
                        total: expect.any(String),
                        type: expect.any(String)
                    })
                ]),
                incomeTotal: expect.anything(),
                expenseTotal: expect.anything()
            })
        );
    });
});

describe("GET /api/transactions/years", () => {
    it("should get all relevant years for the user", async () => {
        const res = await request(app)
            .get("/api/transactions/years");
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    label: expect.any(String),
                    value: expect.any(String)
                })
            ])
        );
    });
});

describe("DELETE /api/transactions/:id", () => {
    it("should delete a transaction", async () => {
        const oldSize = (await request(app).get("/api/transactions/all"))
            .body
            .length

        const res = await request(app)
            .delete("/api/transactions/290");

        const newSize = (await request(app).get("/api/transactions/all"))
            .body
            .length;
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({ message: "Transaction deleted" });
        expect(oldSize).toBeGreaterThan(newSize);
    });
});
