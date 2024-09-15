export type Employee = {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  grade: string;
  userType: string;
  username: string;

  achievements: Achievement[];
};

export type HomeCertificate = {
  id: number;
  certification: string;
  certificateLevel: string;
  certifiedDate: string;
  status: string;
  expiryDate?: string;
};

export type DashboardCertificate = {
  employeeId: number;
  fullName: string;
  role: string;
  grade: string;
  email: string;
  certificateName: string;
  certificateLevel: string;
  certifiedDate: string;
  expiryDate?: string;
};

export type Certificate = {
  name: string;
  level: string;
  category: string;
};

export type Achievement = {
  id: number;
  certifiedDate: string;
  expiryDate?: string;
  employee: Employee;
  certificateName: string;
  certificate: Certificate;
};
