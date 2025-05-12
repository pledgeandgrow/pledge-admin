import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";
import { Test } from "@/components/informatique/test-et-validation/types";

const dataFile = path.join(process.cwd(), "src/data/tests.json");

// Helper function to read tests
async function readTests(): Promise<Test[]> {
  try {
    const data = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with empty array
    await fs.writeFile(dataFile, "[]");
    return [];
  }
}

// Helper function to write tests
async function writeTests(tests: Test[]) {
  await fs.writeFile(dataFile, JSON.stringify(tests, null, 2));
}

export async function GET() {
  try {
    const tests = await readTests();
    return NextResponse.json(tests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tests = await readTests();

    // Validate required fields
    if (!body.name || !body.project || !body.type || !body.priority || !body.environment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new test
    const newTest: Test = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      status: body.status || "pending",
      progress: 0,
      steps: [],
      ...body,
    };

    tests.push(newTest);
    await writeTests(tests);

    return NextResponse.json(newTest);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create test" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Test ID is required" },
        { status: 400 }
      );
    }

    const tests = await readTests();
    const testIndex = tests.findIndex((t) => t.id === id);

    if (testIndex === -1) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }

    // Update test while preserving existing fields
    tests[testIndex] = {
      ...tests[testIndex],
      ...body,
      id, // Ensure ID cannot be changed
      updated_at: new Date().toISOString(),
    };

    await writeTests(tests);
    return NextResponse.json(tests[testIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update test" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Test ID is required" },
        { status: 400 }
      );
    }

    const tests = await readTests();
    const filteredTests = tests.filter((t) => t.id !== id);

    if (filteredTests.length === tests.length) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }

    await writeTests(filteredTests);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete test" },
      { status: 500 }
    );
  }
}
