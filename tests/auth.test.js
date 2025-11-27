const request = require("supertest");
const app = require("../src/app");
const users = require("../src/data/users");

beforeEach(() => {
  // reset users array
  users.length = 0;
});

describe("Auth", () => {
  test("register -> login flow", async () => {
    const registerRes = await request(app)
      .post("/api/register")
      .send({
        name: "Alice",
        email: "alice@example.com",
        password: "pass123",
        role: "organizer",
      });
    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.email).toBe("alice@example.com");

    const loginRes = await request(app)
      .post("/api/login")
      .send({ email: "alice@example.com", password: "pass123" });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });

  test("duplicate registration returns 409", async () => {
    await request(app)
      .post("/api/register")
      .send({ name: "Bob", email: "bob@example.com", password: "p" });
    const res = await request(app)
      .post("/api/register")
      .send({ name: "Bob2", email: "bob@example.com", password: "p2" });
    expect(res.statusCode).toBe(409);
  });
});
