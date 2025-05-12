import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "invoices.json");

// Ensure data directory exists
async function ensureDataFile() {
  try {
    await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error("Error ensuring data file:", error);
  }
}

async function readInvoices() {
  await ensureDataFile();
  const content = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(content);
}

async function writeInvoices(invoices: any[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(invoices, null, 2));
}

export async function GET(request: Request) {
  try {
    const invoices = await readInvoices();
    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Ensure required fields
    if (!body.invoice_number || !body.client || !body.items) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const invoice = {
      id: uuidv4(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const invoices = await readInvoices();
    invoices.push(invoice);
    await writeInvoices(invoices);

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
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
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    const invoices = await readInvoices();
    const index = invoices.findIndex((invoice: any) => invoice.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    const updatedInvoice = {
      ...invoices[index],
      ...body,
      updated_at: new Date().toISOString(),
    };

    invoices[index] = updatedInvoice;
    await writeInvoices(invoices);

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
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
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    const invoices = await readInvoices();
    const filteredInvoices = invoices.filter((invoice: any) => invoice.id !== id);

    if (filteredInvoices.length === invoices.length) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    await writeInvoices(filteredInvoices);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
