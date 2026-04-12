// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prismaMock: any = {
  waitlist: {
    findUnique: async (args: any) => null,
    create: async (args: any) => ({ id: 'mock', email: 'mock@mock.com' }),
  },
  job: {
    create: async (args: any) => ({ id: 'mock', title: 'Mock Job' }),
    findMany: async () => [],
  },
  candidate: {
    findMany: async () => [],
  },
};

export default prismaMock;
