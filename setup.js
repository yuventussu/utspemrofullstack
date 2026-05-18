#!/usr/bin/env node

/**
 * Setup script untuk konfigurasi Eco-Share database
 * Run: node setup.js
 */

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log("\n🔧 Eco-Share Database Setup\n");

  const envPath = path.resolve(process.cwd(), ".env");
  let existingConfig = {};

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    content.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key) existingConfig[key.trim()] = value ? value.trim() : "";
    });
  }

  console.log("📋 Masukkan konfigurasi MySQL Anda:\n");

  const MYSQL_HOST =
    (await question(
      `MYSQL_HOST [${existingConfig.MYSQL_HOST || "localhost"}]: `,
    )) ||
    existingConfig.MYSQL_HOST ||
    "localhost";
  const MYSQL_PORT =
    (await question(`MYSQL_PORT [${existingConfig.MYSQL_PORT || "3306"}]: `)) ||
    existingConfig.MYSQL_PORT ||
    "3306";
  const MYSQL_USER =
    (await question(`MYSQL_USER [${existingConfig.MYSQL_USER || "root"}]: `)) ||
    existingConfig.MYSQL_USER ||
    "root";
  const MYSQL_PASSWORD =
    (await question(
      `MYSQL_PASSWORD [${existingConfig.MYSQL_PASSWORD ? "(set)" : "(empty)"}]: `,
    )) ?? existingConfig.MYSQL_PASSWORD;
  const MYSQL_DATABASE =
    (await question(
      `MYSQL_DATABASE [${existingConfig.MYSQL_DATABASE || "eco_share"}]: `,
    )) ||
    existingConfig.MYSQL_DATABASE ||
    "eco_share";
  const JWT_SECRET =
    (await question(
      `JWT_SECRET [${existingConfig.JWT_SECRET ? "(set)" : "change-me-securely"}]: `,
    )) ||
    existingConfig.JWT_SECRET ||
    "change-me-securely";

  console.log("\n🔗 Menguji koneksi MySQL...");

  try {
    const connection = await mysql.createConnection({
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD || undefined,
    });

    console.log("✅ Koneksi berhasil!");

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\``,
    );
    console.log(`✅ Database \`${MYSQL_DATABASE}\` siap.`);

    await connection.end();

    const envContent = `PORT=4000
MYSQL_HOST=${MYSQL_HOST}
MYSQL_PORT=${MYSQL_PORT}
MYSQL_USER=${MYSQL_USER}
MYSQL_PASSWORD=${MYSQL_PASSWORD || ""}
MYSQL_DATABASE=${MYSQL_DATABASE}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=12h
`;

    fs.writeFileSync(envPath, envContent);
    console.log(`\n✅ File .env berhasil disimpan di ${envPath}`);
    console.log("\n🚀 Sekarang Anda bisa menjalankan:\n  npm run dev\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log("\n💡 Tips:");
    console.log("  - Pastikan MySQL server sudah berjalan");
    console.log("  - Periksa MYSQL_USER dan MYSQL_PASSWORD");
    console.log("  - Periksa MYSQL_HOST dan MYSQL_PORT\n");
    process.exit(1);
  }

  rl.close();
}

main();
