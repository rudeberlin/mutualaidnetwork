# Test Cases and Expected Results

## Test Case 1: Verification Status Update Works

### Setup
- Have an admin account ready
- Create a new test user account

### Steps
1. Register new user: username="testuser123", email="test@example.com", password="Test123!"
2. Login with test user account
3. Observe "Offer Help" button - should be DISABLED
4. Check browser console - should see "[UserDashboard] Verification status changed: old: false, new: false"

### Expected Results
- ✓ Button is disabled with tooltip "Waiting for admin approval"
- ✓ Verification status is false initially

### Next Steps
- Logout from test user
- Login as admin account

---

## Test Case 2: Admin Verification Flow

### Setup
- Admin account logged in
- Offer Help button should be disabled for unverified test user

### Steps
1. Navigate to Admin Panel
2. Click on "ID Verification Queue" (or similar verification tab)
3. Find the test user from Test Case 1
4. Click "Approve" or "Verify" button
5. Confirm the action

### Expected Results
- ✓ User verification status changes to verified
- ✓ Admin sees confirmation message
- ✓ User disappears from verification queue

### Next Steps
- Logout from admin
- Login as test user again (within 10 seconds if possible)

---

## Test Case 3: Offer Help Button Activation

### Setup
- Just completed Test Case 2 (admin verified the test user)
- Test user should be logged out or on another page

### Steps
1. Login as test user again
2. Navigate to User Dashboard
3. Observe "Offer Help" button
4. Open browser console and watch for logs

### Expected Results - CRITICAL FIX VERIFICATION
- ✓ Within 5-10 seconds: Console shows "[UserDashboard] Verification status changed: old: false, new: true"
- ✓ Button becomes ENABLED (green, clickable)
- ✓ Tooltip changes or disappears
- ✓ Button no longer shows "Waiting for admin approval"

**If button doesn't enable:**
- Check browser console for errors
- Check Network tab to see if `/api/user/:id` returns `isVerified: true`
- Verify polling effect is running (check Network tab for 10-second interval requests)

---

## Test Case 4: Offer Help Creates Activity

### Setup
- Completed Test Case 3
- Test user is verified and "Offer Help" button is enabled

### Steps
1. Click "Offer Help" button
2. Select a package from the modal
3. Confirm the offer
4. Observe dashboard updates

### Expected Results
- ✓ Modal opens showing available packages
- ✓ Can select a package
- ✓ Confirmation succeeds with message like "Registered as help provider successfully"
- ✓ "Offer Help" button becomes disabled again (user now has active help offer)
- ✓ Dashboard shows updated stats

---

## Test Case 5: Admin Dashboard Shows Available Givers

### Setup
- Completed Test Case 4
- Test user has an active help offer

### Steps
1. Login as admin account
2. Navigate to Admin Panel → Payment Matching
3. Look at "Available Givers" section

### Expected Results - ROOT CAUSE FIX VERIFICATION
- ✓ "Available Givers" shows count > 0
- ✓ Test user appears in the list with:
  - User ID
  - Full Name
  - Email
  - Phone Number
  - Total Earnings
  - Payment Method (if set)

**If still showing empty:**
- Check backend logs for errors on `/api/admin/available-givers` endpoint
- Verify test user was actually created with help_activity
- Check database: SELECT * FROM help_activities WHERE giver_id = {test_user_id}

---

## Test Case 6: Receive Help Functionality

### Setup
- Same as above, but with two different verified users
- User A: Will offer help
- User B: Will request help

### Steps for User A
1. Login as User A
2. Wait for verification (if needed) or assume already verified
3. Click "Offer Help"
4. Select package (e.g., "$1000 Monthly")
5. Confirm

### Steps for User B
1. Login as User B
2. Wait for verification (if needed) or assume already verified
3. Click "Receive Help"
4. Select package (same as User A if possible)
5. Confirm

### Steps for Admin
1. Login as admin
2. Go to Admin Panel → Payment Matching
3. Check "Available Givers" - should show User A
4. Check "Available Receivers" - should show User B

### Expected Results
- ✓ Available Givers section shows User A
- ✓ Available Receivers section shows User B
- ✓ Both can be manually matched by admin
- ✓ Manual match creates payment_match record

---

## Test Case 7: Field Names Consistency Check

### Technical Test
1. Register a new user
2. Open browser Developer Tools → Network tab
3. Go to User Dashboard
4. Watch the network requests
5. Find the request to `/api/user/{userId}`
6. Check the response body

### Expected Results
- ✓ Response contains camelCase fields:
  ```json
  {
    "isVerified": false,
    "paymentMethodVerified": false,
    "registeredPackageId": null,
    "fullName": "User Name",
    "phoneNumber": "+1234567890",
    "myReferralCode": "ABC123",
    "createdAt": "2024-...",
    "updatedAt": "2024-..."
  }
  ```
- ✓ Response does NOT contain snake_case equivalents in data object
- ✓ Original snake_case fields may appear (spread from DB) but are overshadowed by camelCase

---

## Debugging Guide

### If Offer Help Button Doesn't Activate

**Step 1: Check Polling**
- Open Network tab
- Look for `/api/user/:id` requests every 10 seconds
- If not there: Polling effect not running

**Step 2: Check Response**
- Look at the `/api/user/:id` response
- Find `isVerified` field (camelCase)
- If it says `false`: User not actually verified in database
- If it says `true`: Field is correct

**Step 3: Check Console**
- Look for: `[UserDashboard] Verification status changed: old: false, new: true`
- If not there: Comparison on line 267 failed
- If there: Store update happened

**Step 4: Check Store Update**
- Open browser DevTools
- In console: `localStorage.getItem('user')`
- Look for `"isVerified":true`
- If missing: updateUser() didn't work

**Step 5: Manual Refresh**
- Hard refresh page (Ctrl+F5)
- If button is now enabled: Caching issue, try incognito mode

---

## Success Criteria

ALL of the following must be true:

1. ✓ Admin verifies user
2. ✓ User sees "Offer Help" button become enabled within 10 seconds
3. ✓ User can click "Offer Help" and create a help activity
4. ✓ Admin dashboard shows user in "Available Givers" list
5. ✓ Similarly for "Receive Help" and "Available Receivers"
6. ✓ API response uses camelCase field names
7. ✓ No TypeScript errors
8. ✓ No console errors
9. ✓ Polling works (requests every 10 seconds)
10. ✓ Manual matching works with real data (not empty lists)

---

## Quick Test Checklist

Run through in 5 minutes:

- [ ] Create user → Should show unverified
- [ ] Offer Help button disabled? → YES ✓
- [ ] Admin verifies user
- [ ] Wait 10 seconds on dashboard → Button enabled? → YES ✓
- [ ] Click Offer Help → Select package → Success? → YES ✓
- [ ] Admin dashboard shows giver → YES ✓
- [ ] Admin can manually match → YES ✓

If ALL checked: **FIX IS COMPLETE AND WORKING** ✅
