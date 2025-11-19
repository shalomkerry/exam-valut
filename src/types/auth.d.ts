
declare namespace BetterAuth {
  // 1. Extend the UserAttributes type to include your custom column
  interface UserAttributes {
    role:"editor" | "approver" | "admin"; // The type must match your database column's TS type
  }
}