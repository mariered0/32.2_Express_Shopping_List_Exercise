//set an environment variables.
process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const items = require("../fakeDb");

let pickles = {name: "Pickles"};

//before each test, perform this
beforeEach(function (){
    items.push(pickles);
})

//let the length to 0 to delete
afterEach(function () {
    items.length = 0;
})

//making request takes time, so use async and await
describe("GET /items", () => {
    test('Get all items', async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ items: [pickles]})
    })
})

describe("GET /items/:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get(`/items/${pickles.name}`);
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ item: pickles })
    })
    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).get(`/items/ice`);
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", () => {
    test("Create an item", async () => {
        const res = await request(app).post("/items").send({ name: "ice cream" });
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({ item: { name: "ice cream" }})
    })
})

describe("PATCH /items/:name", () => {
    test("Update item's name", async () => {
        const res = await request(app).patch(`/items/${pickles.name}`).send({name: "strawberry"});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ item: { name: "strawberry" } });
    })
    test("Respond with 404 for invalid name", async () => {
        const res = await request(app).patch(`/items/Cat`).send({ name: "strawberry" })
        expect(res.statusCode).toBe(404);
    })
})

describe("/DELETE /items/:name", () => {
    test("Delete an item", async () => {
        const res = await request(app).delete(`/items/${pickles.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted' })
    })
    test("Responds with 404 for deleting invalid cat", async() => {
        const res = await request(app).delete(`/items/pudding`);
        expect(res.statusCode).toBe(404);
    })
})