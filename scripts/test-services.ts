#!/usr/bin/env node

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function runTest(scriptName: string) {
  console.log(`\n🚀 Running ${scriptName}...\n`);
  try {
    const { stdout, stderr } = await execAsync(`bun run ${scriptName}`, {
      cwd: process.cwd(),
      env: { ...process.env },
    });

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    console.log(`✅ ${scriptName} completed successfully\n`);
    return true;
  } catch (error: any) {
    console.error(`❌ ${scriptName} failed:`, error.message);
    return false;
  }
}

async function main() {
  console.log("🧪 Starting comprehensive service tests...\n");

  const tests = [
    { name: "test-s3", description: "S3/MinIO connectivity" },
    { name: "test-hf", description: "Hugging Face API" },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`📋 Testing ${test.description}...`);
    const success = await runTest(`scripts/${test.name}.ts`);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log("\n📊 Test Results Summary:");
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);

  if (failed > 0) {
    console.log("\n⚠️  Some tests failed. Please check the output above for details.");
    process.exit(1);
  } else {
    console.log("\n🎉 All tests passed! Services are working correctly.");
  }
}

main().catch((error) => {
  console.error("💥 Test runner failed:", error);
  process.exit(1);
});