import { Router } from "express";
import { authController } from "../../controllers";
import { validateBody } from "../../middlewares";
import { employeeCreateValidator, employeeLoginValidator } from "../../validation-schemas";

const authRouter = Router();

authRouter.post('/employee-register', validateBody(employeeCreateValidator), authController.employeeRegister);
authRouter.post('/employee-login', validateBody(employeeLoginValidator), authController.employeeLogin);


export default authRouter;