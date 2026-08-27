export default interface User {
  id: string;
  email: string;
  name: string;
  enabled: boolean;
  emailVerified: boolean;
  image?: string | null;
  updatedAt?: string;
  createdAt?: string;
  provider: "LOCAL" | "GOOGLE" | "GITHUB" | string;
  roles: string[];
}
