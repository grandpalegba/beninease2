export type UserRole = "admin" | "jury" | "candidate";

export type PublicUserRow = {
  id: string;
  role: UserRole;
  is_approved: boolean;
};
