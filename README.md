# Agentic MCP Banking Auditor 🏦 🤖

A senior-level implementation of a localized AI compliance auditor using the **Model Context Protocol (MCP)**. This project demonstrates how to bridge reasoning models (like Claude 3.5) with secure, isolated banking data to automate AML (Anti-Money Laundering) detection.

## 🚀 Key Features

- **Agentic Workflows**: Allows AI to dynamically discover compliance rules and audit live transactions.
- **Protocol-First**: Built on the 2026 MCP standard for secure tool-integration.
- **Security Sandbox**: Uses a decoupled architecture where the LLM never has direct DB access; it only interacts via validated tool schemas.

## 🛠️ Tech Stack

- **Runtime**: Node.js (ESM) with **pnpm**.
- **Language**: TypeScript (Strict Mode).
- **Data**: SQLite (Relational Ledger).
- **Interface**: Model Context Protocol (MCP)[cite: 1].

## 🚦 Getting Started

1. **Setup Data**: `pnpm run seed` (Generates mock transactions).
2. **Build**: `pnpm run build`.
3. **Inspect**: `pnpm run inspect` (Launches the MCP Inspector).

## 📊 Mock Audit Scenario

This repo includes a "Structuring" scenario where an account makes two transfers of $9,500 on the same day. The AI auditor uses the `read_compliance_policy` tool to identify this as a breach of Rule 202 and flags the account[cite: 1].
