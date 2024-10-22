import { Request, NextFunction, Response } from "express";
import { verify } from 'jsonwebtoken';
import { RequestWithEmployeeInfo, EmployeeInfo} from '../types/custom-request.type'
import { BadRequestError, UnAuthorizedError } from "../types/http-error.type";
import * as dotenv from 'dotenv';
import { toString } from "lodash";

dotenv.config()




const employeeAuthenticationMiddleware = async (req : RequestWithEmployeeInfo, res: Response, next: NextFunction) => {

        const accessToken: string = req.headers['authentication'] as string;
        if(!accessToken) {
            return next(new UnAuthorizedError('Require access token'))
        }
        const secrectKey = toString(process.env.JWT_SECRET)
        const decoded = verify(accessToken, secrectKey)
        req.employeeInfo = decoded as EmployeeInfo;
        return next();
}

export { employeeAuthenticationMiddleware }