import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";
import { Server } from "@/components/informatique/serveurs/types";

const dataFile = path.join(process.cwd(), "src/data/servers.json");

// Helper function to read servers
async function readServers(): Promise<Server[]> {
  try {
    const data = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with empty array
    await fs.writeFile(dataFile, "[]");
    return [];
  }
}

// Helper function to write servers
async function writeServers(servers: Server[]) {
  await fs.writeFile(dataFile, JSON.stringify(servers, null, 2));
}

export async function GET() {
  try {
    const servers = await readServers();
    return NextResponse.json(servers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch servers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const servers = await readServers();

    // Validate required fields
    if (!body.name || !body.ip_address || !body.type || !body.os || !body.location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new server with defaults for metrics
    const newServer: Server = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      status: body.status || "offline",
      metrics: {
        cpu_usage: 0,
        memory_usage: 0,
        disk_usage: 0,
        uptime: 0,
      },
      services: body.services || [],
      ...body,
    };

    servers.push(newServer);
    await writeServers(servers);

    return NextResponse.json(newServer);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create server" },
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
        { error: "Server ID is required" },
        { status: 400 }
      );
    }

    const servers = await readServers();
    const serverIndex = servers.findIndex((s) => s.id === id);

    if (serverIndex === -1) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      );
    }

    // Update server while preserving existing fields
    servers[serverIndex] = {
      ...servers[serverIndex],
      ...body,
      id, // Ensure ID cannot be changed
      updated_at: new Date().toISOString(),
    };

    await writeServers(servers);
    return NextResponse.json(servers[serverIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update server" },
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
        { error: "Server ID is required" },
        { status: 400 }
      );
    }

    const servers = await readServers();
    const filteredServers = servers.filter((s) => s.id !== id);

    if (filteredServers.length === servers.length) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      );
    }

    await writeServers(filteredServers);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete server" },
      { status: 500 }
    );
  }
}
