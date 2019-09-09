const request = require("supertest");

const db = require("../database/dbConfig.js");

const server = require("../api/server.js");


describe("routes", () => {
    beforeAll(async () => {
        await db("users").truncate()
    })

    describe("POST /register", () => {
        it("should return 201 when posting user", () => {
            return request(server)
                .post("/api/register")
                .send({ username: "testing", password: "password" })
                .then(res => {
                    expect(res.status).toBe(201)
                })
        })

        it("should return user id number", () => {
            return request(server)
                .post("/api/register")
                .send({ username: "testing1", password: "password" })
                .then(res => {
                    expect(res.body[0]).toEqual(2)
                })
        })

    })

    describe("POST /login", () => {
        it("should return 200 when logging in", () => {
            return request(server)
                .post("/api/login")
                .send({ username: "testing", password: "password" })
                .then(res => {
                    expect(res.status).toBe(200)
                    // expect(res.body.token) 
                })
        })
    })
})