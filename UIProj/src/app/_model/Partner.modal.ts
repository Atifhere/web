export interface Partner {
  id?: string;
  companyId: string;
  companyName?: string;
  fullName: string;
  email?: string;
  phone: string;
  position: string;
  address: string;
  companyPercentageShare: number;
  CompanyName : string
}


export interface PartnerEarning {
  partnerId: string;
  partnerName: string;
  totalCompanyRevenue: number;
  companyPercentageShare: number;
  partnerEarnings: number;
}