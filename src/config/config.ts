import dotenv from "dotenv";
dotenv.config();

// export const config = {
//   port: process.env.PORT || 8000,
//   jwtSecret: process.env.JWT_SECRET || "super_secret_key_123",
//   services: {
//     user:  'http://localhost:4001/api',
//     chat:   'http://localhost:4002/chat',
//     call:  'http://localhost:4005/api/calls',
//     auth:  "http://localhost:4000/api/auth",
//   },
//   adminCredentials: {
//     owner: process.env.ADMIN_OWNER_PASS || "owner123",
//     admin: process.env.ADMIN_ADMIN_PASS || "admin123",
//     service: process.env.ADMIN_SERVICE_PASS || "service123",
//     billing: process.env.ADMIN_BILLING_PASS || "billing123",
//     readonly: process.env.ADMIN_READONLY_PASS || "readonly123",
//   }
// };  


export const config = {
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET || "super_secret_key_123",
  services: {
    user: process.env.USER_SERVICE_URL  ,
    chat: process.env.CHAT_SERVICE_URL,
    call: process.env.CALL_SERVICE_URL,
    auth: process.env.AUTH_SERVICE_URL,
  },
  adminCredentials: {
    owner: process.env.ADMIN_OWNER_PASS || "owner123",
    admin: process.env.ADMIN_ADMIN_PASS || "admin123",
    service: process.env.ADMIN_SERVICE_PASS || "service123",
    billing: process.env.ADMIN_BILLING_PASS || "billing123",
    readonly: process.env.ADMIN_READONLY_PASS || "readonly123",
  }
};


export const SERVICES = [
  { name: 'Auth Service', url: "https://uhura-gateaway.azure-api.net/auth" },
  { name: 'User Service', url: "https://uhura-gateaway.azure-api.net/user" },
  { name: 'Chat Service', url: "http://165.227.209.124:4002" },
  { name: 'Call Service', url: "http://157.245.222.207:4005" },
  { name: 'Notification Service', url: "http://161.35.178.26:4003" },
  { name: 'Payment Service', url: "http://165.227.209.81:4006" }
];
