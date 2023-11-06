import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("123", 10),
    isAdmin: true,
    avatar: "/assets/images/avatars/avatar_1.jpg",
  },
  {
    name: "John",
    email: "john@gmail.com",
    password: bcrypt.hashSync("123", 10),
    isAdmin: false,
    avatar: "/assets/images/avatars/avatar_2.jpg",
  },
  {
    name: "Apk",
    email: "apk@gmail.com",
    password: bcrypt.hashSync("123", 10),
    isAdmin: false,
    avatar: "/assets/images/avatars/avatar_3.jpg",
  },
];
export default users;