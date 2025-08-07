import {z} from 'zod'
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/


export const resetPasswordSchema = z.object({
    email: z.string({error: "Email is required."}),
    token: z.string({error: "Token is requird"}), 
newPassword: z.string({error: "New password is required."}).regex(new RegExp(passwordRegex), "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one digit, and one special character.") , 
confirmNewPassword: z.string({error: "Confirm new password is required."}).regex(new RegExp(passwordRegex), "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one digit, and one special character."),
})


export type ResetPasswordInput  =  z.infer<typeof resetPasswordSchema>

