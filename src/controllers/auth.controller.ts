import { Request, Response } from "express";
import { authService } from "../services";

class AuthController {
    async employeeRegister(req: Request, res: Response) {
        const { payload } = req.body;
        const newEmployee = await authService.employeeRegister(payload);
        res.status(201).send({newEmployee});
    }
}

const authController = new AuthController();

export {authController}