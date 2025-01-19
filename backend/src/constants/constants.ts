export const MONGO_URI = process.env.MONGO_URI as string
export const PORT = process.env.PORT || 3001
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret"
export const JWT_SECRET = process.env.JWT_USER_SECRET || "user_secret"

export enum VerificationCodeType {
    EmailVerification = "email_verification",
    PasswordReset = "password_reset"
}

export const enum AppErrorCode {
    InvalidAccessToken = "InvalidAccessToken",
}