import { prisma } from "../lib/prisma"
import { hashPassword } from "../lib/password"


async function main() {
  console.log("Seeding database...")

  // Delete existing users to ensure clean slate (optional, but good for hackathon)
  // Let's just update/create the admin user to prevent errors if running multiple times.
  const adminEmail = "admin@awaaz.gov.np"
  const adminLoginId = "99999999"
  const adminPassword = "AdminPassword123"
  const passwordHash = await hashPassword(adminPassword)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      loginId: adminLoginId,
      passwordHash,
    },
    create: {
      role: "ADMIN",
      email: adminEmail,
      loginId: adminLoginId,
      displayName: "System Administrator",
      passwordHash,
    },
  })

  const authorityPassword = "12345678"
  const authorityHash = await hashPassword(authorityPassword)
  const authorityAccounts = [
    { email: "nepalpolice@gmail.com", displayName: "Nepal Police", authorityType: "NEPAL_POLICE" },
    { email: "trafficpolice@gmail.com", displayName: "Traffic Police", authorityType: "TRAFFIC_POLICE" },
    { email: "tourismboard@gmail.com", displayName: "Tourism Board", authorityType: "TOURISM_BOARD" },
    { email: "hotelassociation@gmail.com", displayName: "Hotel Association", authorityType: "HOTEL_ASSOCIATION" },
  ]

  const authorityUsers = []
  for (const account of authorityAccounts) {
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {
        role: "AUTHORITY",
        passwordHash: authorityHash,
        displayName: account.displayName,
      },
      create: {
        role: "AUTHORITY",
        email: account.email,
        displayName: account.displayName,
        passwordHash: authorityHash,
      },
    })

    await prisma.authorityProfile.upsert({
      where: { userId: user.id },
      update: {
        authorityType: account.authorityType,
      },
      create: {
        userId: user.id,
        authorityType: account.authorityType,
      },
    })

    authorityUsers.push({ ...user, authorityType: account.authorityType })
  }

  console.log("\n==================================================")
  console.log("Seeding Completed Successfully!")
  console.log(`Admin User:`)
  console.log(`- Login ID: ${admin.loginId}`)
  console.log(`- Email:    ${admin.email}`)
  console.log(`- Password: ${adminPassword}`)
  console.log("\nAuthority Users:")
  authorityUsers.forEach((user) => {
    console.log(`- ${user.displayName}`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Password: ${authorityPassword}`)
  })
  console.log("==================================================\n")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
