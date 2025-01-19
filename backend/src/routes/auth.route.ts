import { Router } from "express";
import { registerHandler } from "../controllers/auth/register.controller";
import { loginHandler } from "../controllers/auth/login.controller";
import { logoutHandler } from "../controllers/auth/logout.controller";
import { refreshTokenHandler } from "../controllers/auth/refresh-token.controller";

export const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler)
authRoutes.get("/refresh", refreshTokenHandler)
