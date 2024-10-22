import { Request, Response } from "express";
import { customerAuthService } from "../../services";

class CustomersAuthController {
    async customerRegister(req: Request, res: Response) {
        const { payload } = req.body;
        const newCustomer = await customerAuthService.customerRegister(payload);
        res.status(201).send({newCustomer});
    }

    async customerLogin(req: Request, res: Response){
        const { payload } = req.body;
        const accessToken = await customerAuthService.customerLogin(payload);
        res.status(200).send(accessToken);
    }
}

const customerAuthController = new CustomersAuthController();

export {customerAuthController}