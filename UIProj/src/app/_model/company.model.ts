export interface Company {
  id: string;
  userId: string;
  name: string;
  address: string;
  phoneNumber: string;
  mobileNumber: string;
  natureOfBusiness: string;
  arabicName: string;
  isActive: boolean;
  status: string;
  email: string;
  tradeLicenseNo: string;
}


export interface CompanyBranch {
  id: string;
  branchName: string;
  arabicName: string;
  companyId: string;
  address: string;
  phoneNumber: string;
  mobileNumber: string;
  isActive: boolean;
  status: string;
  //email: string;
  CreatedBy: string,
  CompanyName : string
  stateId : string
}



export interface CompanyBranchDTO {
  id: string;
  name: string;
}
