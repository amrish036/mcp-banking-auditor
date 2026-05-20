import fs from "fs/promises";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Initialize the server with identity and capabilities
const server = new Server(
  { name: "banking-auditor", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

// Helper to get DB connection
async function getDb() {
  return open({
    filename: "banking_audit.db",
    driver: sqlite3.Database,
  });
}

// 1. Tell the AI what tools we have
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_suspicious_transactions",
      description:
        "Queries the ledger for transactions that may require auditing based on high value or status.",
      inputSchema: {
        type: "object",
        properties: {
          minAmount: {
            type: "number",
            description: "The minimum amount to flag",
          },
        },
      },
    },
    {
      name: "read_compliance_policy",
      description:
        "Reads the internal AML compliance rules for auditing guidance.",
      inputSchema: {
        type: "object",
        properties: {}, // No arguments needed to read the file
      },
    },
    {
      name: "flag_transaction",
      description:
        "Marks a transaction for manual review by the compliance team.",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "number" },
          reason: { type: "string" },
        },
        required: ["id", "reason"],
      },
    },
  ],
}));

// 2. Handle the actual logic when the AI calls the tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_suspicious_transactions") {
    const minAmount = (request.params.arguments?.minAmount as number) || 10000;
    const db = await getDb();

    const rows = await db.all("SELECT * FROM transactions WHERE amount >= ?", [
      minAmount,
    ]);

    return {
      content: [{ type: "text", text: JSON.stringify(rows) }],
    };
  }
  if (request.params.name === "read_compliance_policy") {
    try {
      const policy = await fs.readFile("local_rules.md", "utf-8");
      return {
        content: [{ type: "text", text: policy }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: "Error: local_rules.md not found in root directory.",
          },
        ],
        isError: true,
      };
    }
  }
  if (request.params.name === "flag_transaction") {
    const { id, reason } = request.params.arguments as {
      id: number;
      reason: string;
    };
    const db = await getDb();

    // You'll need to add an 'audit_flag' column to your DB for this to work perfectly!
    await db.run(
      "UPDATE transactions SET status = 'flagged', description = description || ? WHERE id = ?",
      [` [FLAGGED: ${reason}]`, id],
    );

    return {
      content: [
        {
          type: "text",
          text: `Transaction ${id} has been flagged for: ${reason}`,
        },
      ],
    };
  }
  throw new Error("Tool not found");
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Banking Auditor MCP Server running on stdio");
