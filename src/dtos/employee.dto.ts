interface CreateEmployeeDTO {
    firstName: string;
    lastName: string;
    DOB: Date;
    email: string;
    phoneNumber: string;
    position: string;
    password: string;
    branchId: number;
    managerId: number;
}



export{ CreateEmployeeDTO };