const request = require("supertest");
const app = require("../server");


describe("User Authentication", () => {

    describe("User signup with new valid email", ()=>{
        it("should return 201 and user account created", async () =>{
            const {body, statusCode} = await request(app)
                .post("/api/auth/signup")
                .set("content-type", "application/json")
                .send({firstname: "manaal1", lastname: "mishra", email: "manaal5@gmail.com", password: "12345"})
    
                expect(statusCode).toBe(201);
                expect(body.message).toBe("Sucessfully created")
        })
    })

    describe("User signup with new valid email", ()=>{
        it("should return 201 and user account created", async () =>{
            const {body, statusCode} = await request(app)
                .post("/api/auth/login")
                .set("content-type", "application/json")
                .send({firstname: "manaal1", lastname: "mishra", email: "manaal5@gmail.com", password: "12345"})
    
                expect(statusCode).toBe(201);
                expect(body.message).toBe("Login successful")
        })
    })
})