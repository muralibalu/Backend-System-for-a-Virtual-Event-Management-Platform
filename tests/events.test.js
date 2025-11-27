const request = require("supertest");
const app = require("../src/app");
const users = require("../src/data/users");
const events = require("../src/data/events");

beforeEach(() => {
  users.length = 0;
  events.length = 0;
});

describe("Events", () => {
  test("organizer can create, update, delete event; attendee can register", async () => {
    // create organizer
    const regOrg = await request(app)
      .post("/api/register")
      .send({
        name: "Org",
        email: "org@example.com",
        password: "orgpass",
        role: "organizer",
      });
    expect(regOrg.statusCode).toBe(201);
    const loginOrg = await request(app)
      .post("/api/login")
      .send({ email: "org@example.com", password: "orgpass" });
    const orgToken = loginOrg.body.token;

    // create event
    const createRes = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${orgToken}`)
      .send({
        title: "My Event",
        date: "2025-12-01",
        time: "10:00",
        description: "desc",
      });
    expect(createRes.statusCode).toBe(201);
    const eventId = createRes.body.id;

    // update
    const upd = await request(app)
      .put(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${orgToken}`)
      .send({ title: "Updated" });
    expect(upd.statusCode).toBe(200);
    expect(upd.body.title).toBe("Updated");

    // create attendee and register
    await request(app)
      .post("/api/register")
      .send({
        name: "Att",
        email: "att@example.com",
        password: "attpass",
        role: "attendee",
      });
    const loginAtt = await request(app)
      .post("/api/login")
      .send({ email: "att@example.com", password: "attpass" });
    const attToken = loginAtt.body.token;

    const reg = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set("Authorization", `Bearer ${attToken}`)
      .send();
    expect(reg.statusCode).toBe(200);

    // delete event
    const del = await request(app)
      .delete(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${orgToken}`)
      .send();
    expect(del.statusCode).toBe(200);
  });
});
