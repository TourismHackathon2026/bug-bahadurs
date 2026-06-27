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

  console.log("\n==================================================")
  console.log("Seeding Completed Successfully!")
  console.log(`Admin User:`)
  console.log(`- Login ID: ${admin.loginId}`)
  console.log(`- Email:    ${admin.email}`)
  console.log(`- Password: ${adminPassword}`)
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
