import express from "express";

export interface Request extends express.Request {
    cookies: any;
}

export interface UserResponse {
    id: string;
    email: string;
    fullname?: string;
    avatar?: string | null;
    dob?: Date | null;
}
