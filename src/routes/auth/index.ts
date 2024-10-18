import { Router } from "express";
import { authController } from "../../controllers";
import { validateBody } from "../../middlewares";
import { employeeCreateValidator } from "../../validation-schemas";

const authRouter = Router();

authRouter.post('/employee-register', validateBody(employeeCreateValidator), authController.employeeRegister)


export default authRouter;