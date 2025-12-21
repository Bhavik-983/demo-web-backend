// Backend/seed.js
import config from "../config/env.js"
import mongoose from "mongoose"
import { UserModel } from "../models/user.schema.js";
import bcrypt from "bcrypt"

const dummyUsers = [
  {
    username: 'user1',
    email: 'user1@example.com',
    password: 'User@123',
    role: 'USER',
    age: 25
  },
  {
    username: 'user2',
    email: 'user2@example.com',
    password: 'User@123',
    role: 'USER',
    age: 30
  },
  {
    username: 'user3',
    email: 'user3@example.com',
    password: 'User@123',
    role: 'USER',
    age: 28
  },
  {
    username: 'user4',
    email: 'user4@example.com',
    password: 'User@123',
    role: 'USER',
    age: 35
  },
  {
    username: 'user5',
    email: 'user5@example.com',
    password: 'User@123',
    role: 'USER',
    age: 32
  }
];

const dummyManagers = [
  {
    username: 'manager1',
    email: 'manager1@example.com',
    password: 'Manager@123',
    role: 'MANAGER',
    age: 40
  },
  {
    username: 'manager2',
    email: 'manager2@example.com',
    password: 'Manager@123',
    role: 'MANAGER',
    age: 38
  },
  {
    username: 'manager3',
    email: 'manager3@example.com',
    password: 'Manager@123',
    role: 'MANAGER',
    age: 42
  },
  {
    username: 'manager4',
    email: 'manager4@example.com',
    password: 'Manager@123',
    role: 'MANAGER',
    age: 36
  },
  {
    username: 'manager5',
    email: 'manager5@example.com',
    password: 'Manager@123',
    role: 'MANAGER',
    age: 39
  }
];

export const seedDatabase = async () => {
  try {
    const users = await UserModel.find({})
    if(users.length > 2) return
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(dummyUsers.map(async user => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return { ...user, password: hashedPassword };
    }));

    const hashedManagers = await Promise.all(dummyManagers.map(async manager => {
      const hashedPassword = await bcrypt.hash(manager.password, 10);
      return { ...manager, password: hashedPassword };
    }));


    // Insert new data
    const createdUsers = await UserModel.insertMany([...hashedUsers, ...hashedManagers]);
    console.log(`Created ${createdUsers.length} users`);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
