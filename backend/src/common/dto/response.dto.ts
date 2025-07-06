export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  
  constructor(success: boolean, message: string, data?: T, error?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}

export class UserResponseDto {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  profilePicture?: string;
  createdAt: Date;
}