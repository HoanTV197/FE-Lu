// Dùng để khi thêm nhân viên với tương ứng body request postmant

export interface EmployeePayload {
    employeeLoginId: string;
    employeeLoginPassword: string;
    employeeName: string;
    employeeNameKana: string;
    employeeBirthDate: string;
    employeeEmail: string;
    employeeTelephone: string;
    departmentId: string;
    certifications: CertificationPayload[];
  }

  export interface CertificationPayload {
    certificationId: string;
    certificationDate: string;
    expirationDate: string;
    score: string;
  }

  