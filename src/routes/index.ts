import { Router } from "express";
import authRouter from "./auth";
import employeeRouter from './employee'

const apiRouter = Router();

apiRouter.use('/auth', authRouter)
apiRouter.use('/employee', employeeRouter)

export default apiRouter;