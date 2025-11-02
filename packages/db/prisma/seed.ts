import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";
const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { number: '1111' },
    update: {},
    create: {
      number: '1111',
      password: await bcrypt.hash('alice', 10),
      name: 'alice',
      Balance: {
        create: {
            amount: 20500,
            locked: 0
        }
      },
      OnRampTransaction: {
        create: [
          {
            startTime: new Date(),
            status: "Success",
            amount: 20500,
            token: "token__1",
            provider: "HDFC Bank",
          },
          {
            startTime: new Date(),
            status: "Failure",
            amount: 1000,
            token: "token__2",
            provider: "HDFC Bank",
          },
        ]
      },
    },
  })
  const bob = await prisma.user.upsert({
    where: { number: '2222' },
    update: {},
    create: {
      number: '2222',
      password: await bcrypt.hash('bob', 10),
      name: 'bob',
      Balance: {
        create: {
            amount: 2000,
            locked: 0
        }
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 2000,
          token: "token__3",
          provider: "HDFC Bank",
        },
      },
    },
  })
  const chaitanya = await prisma.user.upsert({
    where: { number: '9876' },
    update: {},
    create: {
      number: '9876',
      password: await bcrypt.hash('lemon', 10),
      name: 'chaitanya',
      Balance: {
        create: {
            amount: 50000,
            locked: 0
        }
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 50000,
          token: "token__4",
          provider: "HDFC Bank",
        },
      },
    },
  })
  const lemon = await prisma.user.upsert({
    where: { number: '6789' },
    update: {},
    create: {
      number: '6789',
      password: await bcrypt.hash('lemon', 10),
      name: 'lemon',
      Balance: {
        create: {
            amount: 30000,
            locked: 0
        }
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 30000,
          token: "token__5",
          provider: "HDFC Bank",
        },
      },
    },
  })
  const dave = await prisma.user.upsert({
    where: { number: '4444' },
    update: {},
    create: {
      number: '4444',
      password: await bcrypt.hash('lemon', 10),
      name: 'dave',
      Balance: {
        create: {
            amount: 15000,
            locked: 0
        }
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 15000,
          token: "token__6",
          provider: "HDFC Bank",
        },
      },
    },
  })
  const eve = await prisma.user.upsert({
    where: { number: '5555' },
    update: {},
    create: {
      number: '5555',
      password: await bcrypt.hash('lemon', 10),
      name: 'eve',
      Balance: {
        create: {
            amount: 10000,
            locked: 0
        }
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 10000,
          token: "token__7",
          provider: "HDFC Bank",
        },
      },
    },
  })

  await prisma.p2pTransfer.createMany({
    data:[
      {
        fromUserId: chaitanya.id,
        toUserId: lemon.id,
        amount: 10000,
        timestamp: new Date()
      },
      {
        fromUserId: alice.id,
        toUserId: bob.id,
        amount: 5000,
        timestamp: new Date()
      },
      {
        fromUserId: dave.id,
        toUserId: eve.id,
        amount: 2000,
        timestamp: new Date()
      },
      {
        fromUserId: lemon.id,
        toUserId: alice.id,
        amount: 3000,
        timestamp: new Date()
      }
    ]
  })

  console.log({ alice, bob, chaitanya, lemon, dave, eve })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })  