const app = require('../../app');
const request = require('supertest');

describe("GET /api/categories/all", () => {
    it("should return all categories", async () => {
        const res = await request(app).get("/api/categories/all");
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(
            expect.objectContaining({
                income: expect.any(Array),
                expense: expect.any(Array),
            })
        );
        expect(res.body.income).toHaveLength(4);
        expect(res.body.expense).toHaveLength(13);
    });
});

describe("GET /api/categories/unique", () => {
    it("should return all unique categories", async () => {
        const res = await request(app).get("/api/categories/unique?type=all");
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(expect.any(Array));
        expect(res.body).toHaveLength(17);
    });

    it("should return all unique income categories", async () => {
        const res = await request(app).get("/api/categories/unique?type=income");
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(expect.any(Array));
        expect(res.body).toHaveLength(4);
    });

    it("should return all unique expense categories", async () => {
        const res = await request(app).get("/api/categories/unique?type=expense");
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(expect.any(Array));
        expect(res.body).toHaveLength(13);
    });
});