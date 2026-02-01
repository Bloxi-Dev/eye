# Quick Setup Guide for Eye Database

This repository has been configured as a public database store with admin-only write access. Follow these steps to complete the setup.

## ✅ What's Already Done

The following has been implemented in this repository:

1. **Directory Structure**
   - `/logs` - Storage for log entries (JSON files)
   - `/schema` - JSON schema for validation
   - `/docs` - Documentation
   - `/examples` - Example scripts for querying logs

2. **Access Control Files**
   - `CODEOWNERS` - Specifies who can approve changes to logs
   - `.gitignore` - Excludes build artifacts and temporary files

3. **Automated Validation**
   - `.github/workflows/validate-logs.yml` - GitHub Actions workflow
   - Validates JSON schema compliance
   - Checks for duplicate IDs
   - Verifies filename matches log ID

4. **Documentation**
   - `README.md` - Complete user guide
   - `CONTRIBUTING.md` - Guidelines for adding logs
   - `docs/BRANCH_PROTECTION.md` - Branch protection setup guide
   - `logs/README.md` - Log directory documentation

5. **Examples**
   - 4 example log entries demonstrating different types
   - `examples/fetch-logs.js` - Node.js script to query logs

## 🔧 Required Setup Steps (Manual)

To complete the setup and enforce access control, you need to:

### 1. Enable Branch Protection

**This is critical for enforcing admin-only write access!**

Go to: `Settings` → `Branches` → `Add rule`

Configure these settings:
- Branch name pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require approvals (1+)
- ✅ **Require review from Code Owners** ⬅️ CRITICAL
- ✅ Require status checks to pass
  - Add: `Validate Log Entry Schema`
- ✅ Require conversation resolution
- ✅ Do not allow bypassing (or leave unchecked for admin override)

See detailed instructions: [docs/BRANCH_PROTECTION.md](docs/BRANCH_PROTECTION.md)

### 2. Update CODEOWNERS

Edit the `CODEOWNERS` file to include all maintainers:

```
# Default owners for everything in the repo
* @Bloxi-Dev @maintainer2 @maintainer3

# Logs directory - requires approval from maintainers
/logs/ @Bloxi-Dev @maintainer2 @maintainer3
/logs/** @Bloxi-Dev @maintainer2 @maintainer3

# Schema file - requires approval from maintainers
/schema/ @Bloxi-Dev @maintainer2 @maintainer3
/schema/** @Bloxi-Dev @maintainer2 @maintainer3
```

### 3. Add Collaborators

Add maintainers as collaborators:
- Go to: `Settings` → `Collaborators`
- Add each maintainer with "Write" or "Maintain" access

### 4. Make Repository Public (if not already)

- Go to: `Settings` → General
- Scroll to "Danger Zone"
- Click "Change visibility" → "Make public"

## 🧪 Testing the Setup

After completing the manual steps, test the access control:

### Test 1: Validation Works
1. Create a test branch
2. Add an invalid log file (missing required field)
3. Push and create PR
4. Verify: GitHub Actions should fail ❌

### Test 2: CODEOWNERS Enforcement
1. Create a test branch as a non-maintainer
2. Add a valid log file
3. Push and create PR
4. Verify: PR requires maintainer approval before merging ✅

### Test 3: Direct Push Blocked
1. Try to push directly to `main`
2. Verify: Push should be rejected ❌

## 📊 Repository Structure

```
eye/
├── .github/
│   └── workflows/
│       └── validate-logs.yml      # Automated validation
├── docs/
│   └── BRANCH_PROTECTION.md       # Setup guide
├── examples/
│   └── fetch-logs.js              # Query example
├── logs/
│   ├── README.md                  # Log directory docs
│   ├── example-001.json           # Example: info
│   ├── error-example-002.json     # Example: error
│   ├── audit-example-003.json     # Example: audit
│   └── warning-example-004.json   # Example: warning
├── schema/
│   └── log-entry.json             # JSON schema
├── .gitignore                     # Ignore patterns
├── CODEOWNERS                     # Access control
├── CONTRIBUTING.md                # Contribution guide
├── README.md                      # Main documentation
└── LICENSE                        # License file
```

## 🎯 How It Works

1. **Public Read**: Anyone can view logs on GitHub or via API
2. **Controlled Write**: Only maintainers can approve PRs that modify logs
3. **Automated Validation**: Invalid logs cannot be merged
4. **Audit Trail**: Full Git history of all changes
5. **API Access**: Logs queryable via GitHub REST/GraphQL API

## 🔗 Next Steps

1. ✅ Complete manual setup steps above
2. ✅ Test access control
3. ✅ Remove example logs (or keep as templates)
4. ✅ Start adding real logs from your service
5. ✅ Integrate log submission into your service

## 📚 Additional Resources

- [README.md](README.md) - Full documentation
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to add logs
- [docs/BRANCH_PROTECTION.md](docs/BRANCH_PROTECTION.md) - Detailed setup
- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [CODEOWNERS Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

## ❓ Need Help?

If you encounter issues:
1. Check the documentation in `/docs`
2. Review the example logs in `/logs`
3. Open an issue in this repository
4. Contact: @Bloxi-Dev

---

**Status**: Setup is 90% complete. Complete the manual steps above to finalize.