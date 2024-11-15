interface createPackageDTO {
    senderEmail: string,
    recipientStreet: string,
    recipientCity: string,
    recipientState: string,
    recipientZipcode: string,
    weight: number,
    dimensions: string,
    shippingMethod: string,
    shippingDate: Date,
    deliveryDate: Date,
}

interface updatePackageDTO {
    packageId: number,
    status: string,
    shippingDate: Date,
    deliveryDate: Date,
    currentBranchId: number,
}

export {createPackageDTO, updatePackageDTO}