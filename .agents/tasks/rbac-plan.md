# Implementation Plan: RBAC Bug Fixes

This plan fixes three specific bugs in the Event Planning System's role-based access control:
1. RegisterPage.tsx missing roles and wrong field names
2. UserServiceImpl.register() hardcoding Role.CUSTOMER
3. Admin hard-coded credentials not working

---

## Bug 1: Fix RegisterPage.tsx Role Dropdown and Field Names

**File:** `d:\project\Event-planning-system\frontend\src\auth\RegisterPage.tsx`

**Changes:**

### Change 1.1: Update role type definition (line 26)
**Find (line 26):**
```typescript
    role: 'EVENT_COORDINATOR' as 'OPERATIONS_MANAGER' | 'EVENT_COORDINATOR'
```

**Replace with:**
```typescript
    role: 'EVENT_COORDINATOR' as 'ADMIN' | 'OPERATIONS_MANAGER' | 'EVENT_COORDINATOR' | 'FINANCE_OFFICER' | 'VENDOR' | 'CUSTOMER'
```

### Change 1.2: Add phoneNum field to formData state (line 25)
**Find (lines 22-27):**
```typescript
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'EVENT_COORDINATOR' as 'OPERATIONS_MANAGER' | 'EVENT_COORDINATOR'
  });
```

**Replace with:**
```typescript
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNum: '',
    role: 'EVENT_COORDINATOR' as 'ADMIN' | 'OPERATIONS_MANAGER' | 'EVENT_COORDINATOR' | 'FINANCE_OFFICER' | 'VENDOR' | 'CUSTOMER'
  });
```

### Change 1.3: Fix JSON body field name from fullName to name, add phoneNum (lines 44-48)
**Find (lines 44-48):**
```typescript
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
```

**Replace with:**
```typescript
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          phoneNum: formData.phoneNum || null,
          role: formData.role
        })
```

### Change 1.4: Update role dropdown options (lines 112-116)
**Find (lines 112-116):**
```typescript
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="EVENT_COORDINATOR">Event Coordinator</option>
                <option value="OPERATIONS_MANAGER">Operations Manager</option>
              </select>
```

**Replace with:**
```typescript
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="ADMIN">Admin</option>
                <option value="OPERATIONS_MANAGER">Operations Manager</option>
                <option value="EVENT_COORDINATOR">Event Coordinator</option>
                <option value="FINANCE_OFFICER">Finance Officer</option>
                <option value="VENDOR">Vendor</option>
                <option value="CUSTOMER">Customer</option>
              </select>
```

### Change 1.5: Add phone number input field (insert after email field, after line 99)
**Insert after line 99 (after email div closing tag):**
```typescript

            <div>
              <label htmlFor="phoneNum" className="block text-sm font-medium text-gray-700">
                Phone Number (Optional)
              </label>
              <input
                id="phoneNum"
                name="phoneNum"
                type="tel"
                value={formData.phoneNum}
                onChange={(e) => setFormData({...formData, phoneNum: e.target.value})}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="0771234567"
                pattern="[0-9]{10}"
                title="Please enter a 10-digit phone number"
              />
            </div>
```

**Verify:** Run `npm run build` in the frontend directory. Build should complete without TypeScript errors.

---

## Bug 2: Fix UserServiceImpl.register() to Use Requested Role

**File:** `d:\project\Event-planning-system\backend\src\main\java\edu\sliit\service\impl\UserServiceImpl.java`

**Change 2.1: Update setRole() to use request.getRole() (line 66)**

**Find (line 66):**
```java
        user.setRole(Role.CUSTOMER);
```

**Replace with:**
```java
        user.setRole(request.getRole() != null ? request.getRole() : Role.CUSTOMER);
```

**Rationale:** The current code ignores the role sent from the frontend and always sets CUSTOMER. This change uses the requested role from RegisterRequestDTO, falling back to CUSTOMER only if null.

**Verify:** Run `mvn clean compile` in the backend directory. Compilation should succeed with no errors.

---

## Bug 3: Add Hard-Coded Admin Credentials to login()

**File:** `d:\project\Event-planning-system\backend\src\main\java\edu\sliit\service\impl\UserServiceImpl.java`

**Change 3.1: Add hard-coded admin check at the start of login() method (insert after line 132)**

**Find (lines 132-141):**
```java
    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        if (!ValidationUtil.isValidEmail(request.getEmail())) {
            throw new ValidationException("Invalid email format");
        }

        if (request.getPassword() == null
                || request.getPassword().trim().isEmpty()) {

            throw new ValidationException("Password is required");
        }
```

**Replace with:**
```java
    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        if (!ValidationUtil.isValidEmail(request.getEmail())) {
            throw new ValidationException("Invalid email format");
        }

        if (request.getPassword() == null
                || request.getPassword().trim().isEmpty()) {

            throw new ValidationException("Password is required");
        }

        // Hard-coded admin credentials
        if ("admin@gmail.com".equals(request.getEmail())
                && "admin123".equals(request.getPassword())) {

            String token = jwtService.generateToken("admin@gmail.com");

            return new LoginResponseDTO(
                    0,
                    "Admin",
                    "admin@gmail.com",
                    null,
                    Role.ADMIN,
                    token
            );
        }
```

**Rationale:** This adds a hard-coded admin user (admin@gmail.com / admin123) that bypasses the database lookup. The admin gets userId=0, name="Admin", role=ADMIN, and a valid JWT token. This happens before the DB lookup, so it works even if the admin user doesn't exist in the database.

**Verify:** Run `mvn clean compile` in the backend directory. Compilation should succeed with no errors.

---

## Final Verification

After all changes are applied:

1. **Backend verification:**
   - Run `mvn clean compile` in `d:\project\Event-planning-system\backend`
   - Expected: BUILD SUCCESS with no compilation errors

2. **Frontend verification:**
   - Run `npm run build` in `d:\project\Event-planning-system\frontend`
   - Expected: Build completes successfully with no TypeScript errors

3. **Manual testing (if backend and frontend servers are running):**
   - Test admin login: email=admin@gmail.com, password=admin123 should successfully log in as ADMIN role
   - Test registration: all 6 roles (ADMIN, OPERATIONS_MANAGER, EVENT_COORDINATOR, FINANCE_OFFICER, VENDOR, CUSTOMER) should appear in the dropdown
   - Test role persistence: registering with a specific role should save that role (verify by logging in and checking the user's role)

---

## Summary

- **3 bugs fixed** across 2 files
- **Frontend changes:** RegisterPage.tsx — added all 6 roles to dropdown, added phoneNum field, fixed field name from fullName to name
- **Backend changes:** UserServiceImpl.java — fixed register() to use requested role instead of hardcoding CUSTOMER, added hard-coded admin credentials to login()
- **No breaking changes:** All changes are additive or fix existing bugs; no other functionality is affected
