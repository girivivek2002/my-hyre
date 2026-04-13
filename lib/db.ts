// Mock Prisma client for development
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prismaMock: any = {
  waitlist: {
    findUnique: async (args: any) => null,
    create: async (args: any) => ({ id: 'mock', email: args?.data?.email || 'mock@mock.com' }),
  },
  candidate: {
    findUnique: async (args: any) => {
      if (args?.where?.email === 'candidate@test.com') {
        return { id: '1', name: 'Test Candidate', email: 'candidate@test.com', password: '$2b$10$mock', role: 'candidate' };
      }
      return null;
    },
    create: async (args: any) => ({ id: 'mock', email: args?.data?.email || 'mock@mock.com' }),
  },
  recruiter: {
    findUnique: async (args: any) => {
      if (args?.where?.email === 'recruiter@test.com') {
        return { id: '1', name: 'Test Recruiter', email: 'recruiter@test.com', password: '$2b$10$mock', role: 'recruiter' };
      }
      return null;
    },
    create: async (args: any) => ({ id: 'mock', email: args?.data?.email || 'mock@mock.com' }),
  },
  user: {
    findUnique: async (args: any) => {
      if (args?.where?.email === 'test@test.com') {
        return { id: '1', name: 'Test User', email: 'test@test.com', password: '$2b$10$mock', role: 'candidate' };
      }
      return null;
    },
    create: async (args: any) => ({ id: 'mock', email: args?.data?.email || 'mock@mock.com' }),
  },
  job: {
    create: async (args: any) => ({ id: 'mock', title: 'Mock Job' }),
    findMany: async () => [],
  },
};

export default prismaMock;
