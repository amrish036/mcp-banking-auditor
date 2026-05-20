# MCP Banking Auditor

An Anti-Money Laundering (AML) compliance audit server built with the Model Context Protocol (MCP). This project provides AI-powered tools to detect suspicious transactions and enforce AML compliance rules based on AUSTRAC-style policies.

## Features

- **Suspicious Transaction Detection**: Identifies transactions exceeding high-value thresholds
- **Compliance Rule Engine**: Enforces AML compliance policies including:
  - High-value transaction flagging (>$10,000 AUD)
  - Structuring/smurfing pattern detection
  - High-risk transaction description analysis
- **SQLite Database**: Persistent storage for banking ledger data
- **MCP Server**: Integrates with AI systems through the Model Context Protocol

## Prerequisites

- Node.js 18+
- pnpm 11.1.0 or later (will auto-download if needed)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mcp-banking-auditor
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up the database:

```bash
pnpm run seed
```

## Quick Start

### Development Mode

Run the auditor server in development mode:

```bash
pnpm run dev
```

### Build

Compile TypeScript to JavaScript:

```bash
pnpm run build
```

### Production

Start the compiled server:

```bash
pnpm run start
```

### Inspect

Launch the MCP Inspector to test tools and inspect the server:

```bash
pnpm run inspect
```

## Project Structure

```
├── src/
│   └── index.ts          # Main MCP server implementation
├── setup_db.js           # Database initialization script
├── local_rules.md        # AML compliance rules and policies
├── package.json          # Project metadata and dependencies
├── pnpm-workspace.yaml   # Workspace configuration
└── tsconfig.json         # TypeScript configuration
```

## Available Tools

### get_suspicious_transactions

Queries the ledger for transactions that may require auditing based on high value or status.

**Parameters:**

- `minAmount` (number): The minimum amount to flag

### read_compliance_policy

Reads the internal AML compliance rules for auditing guidance.

## Compliance Rules

The auditor enforces the following AML compliance rules (defined in `local_rules.md`):

- **Rule 101**: Flag transactions exceeding $10,000 AUD
- **Rule 202**: Detect structuring patterns (multiple transactions totaling >$10,000 on the same day)
- **Rule 303**: Flag high-risk transaction descriptions for non-business accounts

## Technologies

- **Framework**: Model Context Protocol (MCP)
- **Language**: TypeScript
- **Database**: SQLite3
- **Package Manager**: pnpm

## License

ISC
