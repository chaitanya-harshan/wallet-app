import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Deleting all data from the database...')
  
  console.log('Deleting p2pTransfer records...')
  await prisma.p2pTransfer.deleteMany({})
  
  console.log('Deleting OnRampTransaction records...')
  await prisma.onRampTransaction.deleteMany({})
  
  console.log('Deleting Balance records...')
  await prisma.balance.deleteMany({})
  
  console.log('Deleting User records...')
  await prisma.user.deleteMany({})
  
  console.log('Deleting Merchant records...')
  await prisma.merchant.deleteMany({})
  
  console.log('All data deleted successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error deleting data:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

