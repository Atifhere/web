export interface Staff{
    id: string,
    firstName: string,
    lastName: string,
    emiratesId: string,
    phone: string,
    email: string,
    address: string,
    percentageShare?: number,
    monthlyTarget?: number,
    createdBy: string,
    isActive: boolean,
    status: string
    companyBranchId: string,
    companyBranchName : string,
    monthlySalary? : number,
    paymentType?: number
}