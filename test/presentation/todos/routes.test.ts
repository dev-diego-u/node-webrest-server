import { Server } from "../../../src/presentation/server";
import { AppRoutes } from "../../../src/presentation/routes";
import { envs } from "../../../src/config/envs";
import request from "supertest";
import { prisma } from "../../../src/data/postgres";
import { todo } from "node:test";

describe("presentation/todos/todoRoutes.ts", () => {
  const server = new Server({ port: envs.PORT, routes: AppRoutes.routes });
  const todo1 = { text: "todo1" };
  const todo2 = { text: "todo2" };

  beforeAll(async () => {
    await server.start();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  afterAll(async () => {
    //borrar la base de datos
    await prisma.todo.deleteMany();

    server.close();
    prisma.$disconnect();
  });

  test("should return todos api/todos", async () => {
    await prisma.todo.createMany({
      data: [todo1, todo2],
    });
    const app = server.getApp();
    const { body, status } = await request(app).get("/api/todos"); // etc...
    // console.log(status);
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Array);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining(todo1),
        expect.objectContaining(todo2),
      ])
    );
  });

  test("should return todo api/todos/:id", async () => {
    const todoA = await prisma.todo.create({ data: todo1 });
    // console.log(todoA);
    // console.log(todo1);
    const app = server.getApp();
    const { body, status } = await request(app).get(`/api/todos/${todoA.id}`); // etc...
    // console.log(status);
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toEqual(expect.objectContaining(todo1));
  });

  test("should return error 404 not found  api/todos/:id", async () => {
    const app = server.getApp();
    const id = 999; // Assuming this ID does not exist
    const { body, status } = await request(app).get(`/api/todos/${id}`); // etc...
    // console.log(body);
    expect(status).toBe(404);
    expect(body).toEqual({ error: `Todo with id ${id} not found` });
  });

  test("should create todo api/todos", async () => {
    const app = server.getApp();
    const { body, status } = await request(app).post("/api/todos").send(todo1); // etc...
    // console.log(body, status);
    expect(status).toBe(201);
    expect(body).toBeInstanceOf(Object);
    expect(body).toEqual(expect.objectContaining(todo1));
  });

  test("should return error if is not valid text api/todos", async () => {
    const app = server.getApp();
    const { body, status } = await request(app)
      .post("/api/todos")
      .send({ text: "" }); // etc...
    // console.log(body, status);
    expect(status).toBe(400);
    expect(body).toEqual({ error: "Text must be a non-empty string" });
  });

  test("should update todo api/todos/:id", async () => {
    const todoA = await prisma.todo.create({ data: todo1 });
    const app = server.getApp();
    const updatedTodo = { ...todo1, text: "Updated Todo" };
    const { body, status } = await request(app)
      .put(`/api/todos/${todoA.id}`)
      .send(updatedTodo); // etc...
    // console.log(body, status);
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toEqual(expect.objectContaining(updatedTodo));
  });

  test("should return error if todo update not exist", async () => {
    const app = server.getApp();
    const id = 999; // Assuming this ID does not exist
    const updatedTodo = { text: "Updated Todo" };
    const { body, status } = await request(app)
      .put(`/api/todos/${id}`)
      .send(updatedTodo); // etc...
    // console.log(body, status);
    expect(status).toBe(404);
    expect(body).toEqual({ error: `Todo with id ${id} not found` });
  });

  test("should return update todo only the date", async () => {
    const todoA = await prisma.todo.create({ data: todo1 });
    const app = server.getApp();
    const updatedTodo = { completedAt: new Date() };
    const { body, status } = await request(app)
      .put(`/api/todos/${todoA.id}`)
      .send(updatedTodo); // etc...
    // console.log(body, status);
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toEqual(
      expect.objectContaining({
        ...todo1,
        completedAt: expect.any(String), // Assuming completedAt is a date string
      })
    );
  });

  test("should return delete todo", async () => {
    const todoA = await prisma.todo.create({ data: todo1 });
    const app = server.getApp();
    const { body, status } = await request(app).del(`/api/todos/${todoA.id}`);
    // console.log(body, status);
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body).toEqual(
      expect.objectContaining({
        ...todo1,
      })
    );
  });

  test("should return error if todo delete not exist", async () => {
    const app = server.getApp();
    const id = 999; // Assuming this ID does not exist
    const { body, status } = await request(app).del(`/api/todos/${id}`);
    // console.log(body, status);
    expect(status).toBe(404);
    expect(body).toEqual({ error: "Todo with id 999 not found" });
  });
});
