# Branch Protection Setup Guide

To ensure only admins and maintainers can add or remove logs, you need to configure branch protection rules on GitHub. This complements the CODEOWNERS file to provide robust access control.

## ⚙️ Recommended Settings

Configure these settings for your `main` branch (or default branch):

### 1. Enable Branch Protection

1. Go to your repository on GitHub
2. Click **Settings** → **Branches**
3. Click **Add rule** under "Branch protection rules"
4. Enter `main` as the branch name pattern

### 2. Required Settings

Enable these options:

#### ✅ Require a pull request before merging
- **Required approvals**: 1 (or more for stricter control)
- **Dismiss stale pull request approvals when new commits are pushed**: Enabled
- **Require review from Code Owners**: **✅ ENABLED** (Critical!)
- **Require approval of the most recent reviewable push**: Enabled

#### ✅ Require status checks to pass before merging
- **Require branches to be up to date before merging**: Enabled
- **Status checks that are required**:
  - `Validate Log Entry Schema` (from validate-logs.yml workflow)
  - Add this after the workflow runs at least once

#### ✅ Require conversation resolution before merging
- Enabled (ensures all review comments are addressed)

#### ✅ Do not allow bypassing the above settings
- Enabled (prevents even admins from bypassing)
- OR keep disabled if you want admins to have override capability

### 3. Optional but Recommended

- **Require signed commits**: For additional security
- **Require linear history**: Prevents merge commits
- **Require deployments to succeed**: If you add deployment workflows

## 🔒 CODEOWNERS Integration

The CODEOWNERS file in this repository specifies:

```
/logs/ @Bloxi-Dev
/logs/** @Bloxi-Dev
/schema/ @Bloxi-Dev
/schema/** @Bloxi-Dev
```

This means:
- Any PR that modifies files in `/logs` or `/schema` requires approval from `@Bloxi-Dev`
- The "Require review from Code Owners" setting enforces this automatically

## 👥 Managing Maintainers

To add or remove maintainers:

1. **Edit CODEOWNERS file**: Add or remove GitHub usernames
   ```
   /logs/ @Bloxi-Dev @new-maintainer @another-admin
   ```

2. **Repository Collaborators**: Also add them as collaborators with "Write" or "Maintain" access
   - Settings → Collaborators → Add people

## 🧪 Testing Access Control

After setup, test that protection works:

1. **Test as non-maintainer**:
   - Try to push directly to `main` → Should fail
   - Create PR modifying `/logs` → Can create, but can't merge without approval

2. **Test as maintainer**:
   - Create PR modifying `/logs` → Should be able to approve and merge

3. **Test validation**:
   - Create PR with invalid JSON → Status checks should fail
   - Fix validation → Status checks should pass

## 📋 Verification Checklist

- [ ] Branch protection rule created for `main`
- [ ] "Require pull request before merging" enabled
- [ ] "Require review from Code Owners" enabled
- [ ] Status checks configured (validate-logs workflow)
- [ ] CODEOWNERS file lists all maintainers
- [ ] Maintainers added as repository collaborators
- [ ] Tested: Direct push to main is blocked
- [ ] Tested: PR requires CODEOWNER approval
- [ ] Tested: Invalid logs fail validation

## 🎯 Result

With these settings:

✅ Public can **view** all logs (repository is public)  
✅ Anyone can **create PRs** to propose new logs  
❌ Only **maintainers** listed in CODEOWNERS can **approve and merge** PRs  
❌ Changes that fail validation **cannot be merged**  
✅ Full **audit trail** via Git history  

## 📚 Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
