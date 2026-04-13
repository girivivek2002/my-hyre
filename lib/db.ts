// Mock Prisma client for development - stores users in memory
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const users: any[] = [];

const prismaMock: any = {
  waitlist: {
    findUnique: async (args: any) => {
      return users.find(u => u.email === args?.where?.email) || null;
    },
    create: async (args: any) => {
      const newUser = { id: Date.now().toString(), email: args?.data?.email, ...args?.data };
      users.push(newUser);
      return newUser;
    },
  },
  candidate: {
    findUnique: async (args: any) => {
      return users.find(u => u.email === args?.where?.email && u.role === 'candidate') || null;
    },
    create: async (args: any) => {
      const newUser = { id: Date.now().toString(), ...args?.data, role: 'candidate' };
      users.push(newUser);
      return newUser;
    },
  },
  recruiter: {
    findUnique: async (args: any) => {
      return users.find(u => u.email === args?.where?.email && u.role === 'recruiter') || null;
    },
    create: async (args: any) => {
      const newUser = { id: Date.now().toString(), ...args?.data, role: 'recruiter' };
      users.push(newUser);
      return newUser;
    },
  },
  user: {
    findUnique: async (args: any) => {
      return users.find(u => u.email === args?.where?.email) || null;
    },
    create: async (args: any) => {
      const newUser = { id: Date.now().toString(), ...args?.data };
      users.push(newUser);
      return newUser;
    },
  },
  job: {
    create: async (args: any) => ({ id: 'mock', title: 'Mock Job' }),
    findMany: async () => [],
  },
};

export default prismaMock;
