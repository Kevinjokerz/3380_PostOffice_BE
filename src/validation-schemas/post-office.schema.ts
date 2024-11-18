import Joi from "joi";
import  { CreateBranchDTO } from '../dtos'

interface CreateBranchPayLoad {
    payload: CreateBranchDTO;
}

const branchCreateValidator = Joi.object<CreateBranchPayLoad>().keys({
    payload: Joi.object<CreateBranchDTO>()
    .keys({
        branchName: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().min(10).max(10).required(),
        street: Joi.string().max(100).required(),
        city: Joi.string().max(100).required(),
        state: Joi.string().max(10).required(),
        zipcode: Joi.string().max(10).required(),
    })
    .required(),
});

export { branchCreateValidator }