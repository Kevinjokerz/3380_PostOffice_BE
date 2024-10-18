import { Request, Response } from "express";
import { authService } from "../services";
import { CatchAsyncDecorator } from '../decorators'



//@CatchAsyncDecorator(AuthController.name)
class AuthController {
    async employeeRegister(req: Request, res: Response) {
        const { payload } = req.body;
        const newEmployee = await authService.employeeRegister(payload);
        res.status(201).send({newEmployee});
    }

    async employeeLogin(req: Request, res: Response){
        const { payload } = req.body;
        const accessToken = await authService.employeeLogin(payload);
        res.status(200).send(accessToken);
    }
}

const authController = new AuthController();

export {authController}