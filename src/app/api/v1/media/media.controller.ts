import { Hono } from "hono";

const app = new Hono<{ Variables: any }>()

export { app as MediaController };

