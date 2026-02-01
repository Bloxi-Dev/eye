# Log Entry Index

This directory contains all log entries stored in the eye database. Each log entry is stored as a separate JSON file following the schema defined in `/schema/log-entry.json`.

## File Naming Convention

Log files should be named using the following pattern:
- `{id}.json` where `{id}` matches the `id` field in the JSON content

## Adding New Logs

⚠️ **Access Restricted**: Only repository administrators and maintainers can add or remove log entries.

To add a new log entry:
1. Create a new JSON file in this directory
2. Ensure it follows the schema defined in `/schema/log-entry.json`
3. Use a unique ID for the filename and the `id` field
4. Submit a pull request (requires approval from CODEOWNERS)

## Viewing Logs

All logs are publicly readable. You can:
- Browse individual log files in this directory
- Query logs programmatically via the GitHub API
- Download the entire repository to analyze logs locally

## Log Types

- `info`: Informational messages
- `warning`: Warning messages
- `error`: Error messages
- `debug`: Debug messages
- `audit`: Audit trail entries
