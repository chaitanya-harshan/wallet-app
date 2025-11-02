import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";
const prisma = new PrismaClient()

async function main() {
  // Clear existing data for clean seed
  await prisma.p2pTransfer.deleteMany({});
  await prisma.onRampTransaction.deleteMany({});
  await prisma.balance.deleteMany({});
  await prisma.user.deleteMany({});

  // Create 5 realistic demo users with varying transaction histories
  const rajesh = await prisma.user.upsert({
    where: { number: '9876543210' },
    update: {},
    create: {
      number: '9876543210',
      password: await bcrypt.hash('password123', 10),
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      Balance: {
        create: {
            amount: 45000,  // ₹450 after accounting for transactions
            locked: 5000    // ₹50 locked for processing transaction
        }
      },
      OnRampTransaction: {
        create: [
          {
            startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            status: "Success",
            amount: 50000,  // ₹500
            token: "onramp_rajesh_001",
            provider: "HDFC Bank",
          },
          {
            startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            status: "Failure",
            amount: 20000,  // ₹200
            token: "onramp_rajesh_002",
            provider: "Axis Bank",
          },
          {
            startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
            status: "Processing",
            amount: 5000,  // ₹50
            token: "onramp_rajesh_003",
            provider: "HDFC Bank",
          },
        ]
      },
    },
  })

  const priya = await prisma.user.upsert({
    where: { number: '9876543211' },
    update: {},
    create: {
      number: '9876543211',
      password: await bcrypt.hash('password123', 10),
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      Balance: {
        create: {
            amount: 32500,  // ₹325
            locked: 0
        }
      },
      OnRampTransaction: {
        create: [
          {
            startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            status: "Success",
            amount: 30000,  // ₹300
            token: "onramp_priya_001",
            provider: "HDFC Bank",
          },
          {
            startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            status: "Success",
            amount: 5000,  // ₹50
            token: "onramp_priya_002",
            provider: "Axis Bank",
          },
          {
            startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            status: "Success",
            amount: 10000,  // ₹100
            token: "onramp_priya_003",
            provider: "HDFC Bank",
          },
        ]
      },
    },
  })

  const amit = await prisma.user.upsert({
    where: { number: '9876543212' },
    update: {},
    create: {
      number: '9876543212',
      password: await bcrypt.hash('password123', 10),
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      Balance: {
        create: {
            amount: 18500,  // ₹185
            locked: 0
        }
      },
      OnRampTransaction: {
        create: [
          {
            startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            status: "Success",
            amount: 25000,  // ₹250
            token: "onramp_amit_001",
            provider: "HDFC Bank",
          },
          {
            startTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
            status: "Failure",
            amount: 15000,  // ₹150
            token: "onramp_amit_002",
            provider: "HDFC Bank",
          },
          {
            startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            status: "Failure",
            amount: 8000,  // ₹80
            token: "onramp_amit_003",
            provider: "Axis Bank",
          },
        ]
      },
    },
  })

  const sneha = await prisma.user.upsert({
    where: { number: '9876543213' },
    update: {},
    create: {
      number: '9876543213',
      password: await bcrypt.hash('password123', 10),
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      Balance: {
        create: {
            amount: 72000,  // ₹720
            locked: 10000   // ₹100 locked for processing
        }
      },
      OnRampTransaction: {
        create: [
          {
            startTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
            status: "Success",
            amount: 50000,  // ₹500
            token: "onramp_sneha_001",
            provider: "HDFC Bank",
          },
          {
            startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            status: "Success",
            amount: 30000,  // ₹300
            token: "onramp_sneha_002",
            provider: "Axis Bank",
          },
          {
            startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            status: "Processing",
            amount: 10000,  // ₹100
            token: "onramp_sneha_003",
            provider: "HDFC Bank",
          },
        ]
      },
    },
  })

  const vikram = await prisma.user.upsert({
    where: { number: '9876543214' },
    update: {},
    create: {
      number: '9876543214',
      password: await bcrypt.hash('password123', 10),
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      Balance: {
        create: {
            amount: 28000,  // ₹280
            locked: 0
        }
      },
      OnRampTransaction: {
        create: [
          {
            startTime: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
            status: "Success",
            amount: 40000,  // ₹400
            token: "onramp_vikram_001",
            provider: "HDFC Bank",
          },
          {
            startTime: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
            status: "Failure",
            amount: 5000,  // ₹50
            token: "onramp_vikram_002",
            provider: "Axis Bank",
          },
          {
            startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            status: "Success",
            amount: 15000,  // ₹150
            token: "onramp_vikram_003",
            provider: "HDFC Bank",
          },
        ]
      },
    },
  })

  // Create P2P transfers between users with realistic timestamps
  await prisma.p2pTransfer.createMany({
    data:[
      {
        fromUserId: rajesh.id,
        toUserId: priya.id,
        amount: 5000,  // ₹50
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
      },
      {
        fromUserId: sneha.id,
        toUserId: rajesh.id,
        amount: 8000,  // ₹80
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        fromUserId: amit.id,
        toUserId: vikram.id,
        amount: 6500,  // ₹65
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      },
      {
        fromUserId: priya.id,
        toUserId: sneha.id,
        amount: 2500,  // ₹25
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        fromUserId: vikram.id,
        toUserId: amit.id,
        amount: 7000,  // ₹70
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        fromUserId: rajesh.id,
        toUserId: amit.id,
        amount: 3000,  // ₹30
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        fromUserId: sneha.id,
        toUserId: vikram.id,
        amount: 12000,  // ₹120
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
      },
      {
        fromUserId: priya.id,
        toUserId: rajesh.id,
        amount: 4000,  // ₹40
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
    ]
  })

  console.log({ 
    rajesh: { id: rajesh.id, name: rajesh.name, number: rajesh.number },
    priya: { id: priya.id, name: priya.name, number: priya.number },
    amit: { id: amit.id, name: amit.name, number: amit.number },
    sneha: { id: sneha.id, name: sneha.name, number: sneha.number },
    vikram: { id: vikram.id, name: vikram.name, number: vikram.number }
  })
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