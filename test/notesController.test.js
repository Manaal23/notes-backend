const request = require("supertest");
const app = require("../server");


describe("Notes actions", () => {

    let token = '';

beforeAll(async () => {
  const {body, statusCode} = await request(app).post('/api/auth/login')
  .set("content-type", "application/json")
  .send({firstname: "manaal1", lastname: "mishra", email: "manaal4@gmail.com", password: "12345"});
  token = body.token
});


    describe("create notes", ()=>{
        it("should return 201 and notes created", async () =>{
            const {body, statusCode} = await request(app)
                .post("/api/notes")
                .set("content-type", "application/json")
                .set('Authorization', `Bearer ${token}`)
                .send({
                    note: "first note of manaal"
                })
    
                expect(statusCode).toBe(201);
                expect(body.message).toBe("saved")
        })
    })
    describe("get notes", ()=>{
        it("should return 201", async () =>{
            const {body, statusCode} = await request(app)
                .get("/api/notes")
                .set("content-type", "application/json")
                .set('Authorization', `Bearer ${token}`)
    
                expect(statusCode).toBe(201);
        })
    })
})