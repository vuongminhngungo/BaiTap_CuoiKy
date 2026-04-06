const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function renameTypeIfExists(from, to) {
  const rows = await db.$queryRawUnsafe(
    "SELECT to_regtype($1) IS NOT NULL AS exists",
    from,
  );
  const exists = rows?.[0]?.exists;
  if (exists) {
    await db.$executeRawUnsafe(`ALTER TYPE ${from} RENAME TO ${to}`);
    console.log(`Renamed enum type ${from} -> ${to}`);
  } else {
    console.log(`Skipped ${from}, type not found`);
  }
}

(async () => {
  try {
    await renameTypeIfExists("product_status", '"ProductStatus"');
    await renameTypeIfExists("user_role", '"UserRole"');
    await renameTypeIfExists("order_status", '"OrderStatus"');
    await renameTypeIfExists("voucher_type", '"VoucherType"');
  } finally {
    await db.$disconnect();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
