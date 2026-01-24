# Admin Quick Reference Guide

## Admin Panel Access
Navigate to: `/admin` → Login with admin credentials

---

## Payment Matching Workflow (Step-by-Step)

### Step 1: Approve User Packages
1. Click **"User Packages"** in sidebar
2. Find pending package subscriptions
3. Click **"Approve"** button
4. Confirm 15-day maturity date (or customize)
5. Status changes to "Active"

### Step 2: Match Giver to Receiver
1. Click **"Payment Matching"** in sidebar
2. **Select Receiver** from top section (users waiting to receive help)
3. **Select Giver** from middle section (verified users ready to give)
4. Click **"Create Match"** button
5. 6-hour countdown starts automatically

### Step 3: Monitor Countdown
- Check "Active Matches" section (bottom)
- Countdown shows: "5h 30m left" → "1h 0m left" → "0h 30m left"
- When overdue: Shows "2h overdue" (RED alert)
- Auto-refreshes every 10 seconds

### Step 4: Confirm Payment
- Wait for giver to click "I Have Sent the Payment"
- Status changes to "Awaiting Confirmation"
- Contact receiver to verify payment received
- Click **"Confirm Payment"** button
- Match status changes to "Completed"

### Step 5: Handle Defaults (If Needed)
- If giver doesn't pay within 6 hours
- **"Ban User"** button appears
- Click to ban the defaulting user
- User account suspended immediately
- User added to Banned Accounts list

---

## Admin Pages Overview

### 1. User Packages
**Purpose**: Manage user package subscriptions

**Actions**:
- ✅ **Approve**: Activate package with maturity date
- ❌ **Reject**: Decline package subscription
- 📅 **Extend**: Add more days to maturity date
- ⟳ **Reset**: Return package to pending status

**Status Indicators**:
- 🟡 Pending (yellow badge)
- 🟢 Active (green badge)
- 🔴 Rejected (red badge)

**Columns Displayed**:
- User Name
- Package Name
- Amount
- Status
- Maturity Date
- Extended Count
- Created At
- Actions

---

### 2. Payment Matching
**Purpose**: Manually match givers to receivers with 6-hour deadline

**Sections**:

1. **Pending Receivers** (Top)
   - Users waiting to receive help
   - Shows: Name, Amount, Help Status
   - Click to select receiver

2. **Available Givers** (Middle)
   - Verified users ready to give help
   - Shows: Name, Verification Status
   - Click to select giver

3. **Active Matches** (Bottom)
   - Current payment matches
   - Shows: Giver, Receiver, Amount, Deadline, Time Left
   - Actions: Confirm Payment, Ban User

**Countdown Colors**:
- 🟢 Green: 2+ hours remaining
- 🟡 Orange: < 1 hour remaining
- 🔴 Red: Overdue

---

### 3. Banned Accounts
**Purpose**: Review and manage banned users

**Actions**:
- 👀 **View**: See full ban details
- ✅ **Unban**: Restore user access

**Information Displayed**:
- Full Name
- Email
- Phone Number
- Ban Reason
- Banned At (timestamp)
- Status (Active/Unbanned)

**To Unban**:
1. Click "Unban" button
2. Confirm action in dialog
3. User account restored immediately
4. User can login again

---

## Common Admin Tasks

### Extend Maturity Date
1. Go to **User Packages**
2. Find approved package
3. Click **"Extend"** button
4. Select new date in calendar picker
5. Click "Extend" to confirm
6. Extension count increases by 1

### Reset Package to Pending
1. Go to **User Packages**
2. Find package (any status)
3. Click **"Reset"** button
4. Status changes to "Pending"
5. Admin can re-approve with new maturity date

### Force Ban User (Outside Payment Flow)
1. Go to **Payment Matching**
2. Find overdue match
3. Click **"Ban User"** button
4. Confirm action
5. User added to banned list

### Review User Payment History
1. Go to **Payments** (sidebar)
2. Filter by user email or name
3. View all completed payments
4. Check transaction IDs and timestamps

---

## User Dashboard View (What Users See)

### When Matched as Giver
Users see **PaymentMatchCard** with:
- ✅ Receiver's full name
- ✅ Receiver's phone number
- ✅ Receiver's bank account details
- ⏱️ Countdown timer (real-time)
- 🚨 Urgent warning when < 1 hour left
- 💳 "I Have Sent the Payment" button

### When Matched as Receiver
Users see **PaymentMatchCard** with:
- ℹ️ Giver's full name
- ℹ️ Giver's phone number
- ⏳ Waiting message
- 💰 Amount to expect

### Status Indicators (Both Views)
- 🟡 **Pending**: Payment not yet sent
- 🔵 **Awaiting Confirmation**: Payment sent, waiting for admin verification
- 🟢 **Completed**: Payment confirmed by admin

---

## Troubleshooting

### Match Not Appearing
- ✓ Verify user package is approved
- ✓ Check user is verified (is_verified = true)
- ✓ Ensure user not already in active match
- ✓ Refresh page or re-login

### Countdown Not Updating
- ✓ Wait 10 seconds (auto-refresh interval)
- ✓ Check browser console for errors
- ✓ Verify backend server is running
- ✓ Check network tab for failed API calls

### Ban Not Working
- ✓ Confirm admin privileges
- ✓ Check user is actually matched
- ✓ Verify deadline has passed (must be overdue)
- ✓ Check banned_accounts table in database

### Unban Not Restoring Access
- ✓ User must logout and login again
- ✓ Clear browser cache/cookies
- ✓ Verify is_verified set to true in database
- ✓ Check JWT token refreshed

---

## Best Practices

### 1. Package Approval
- ✅ Review user verification status first
- ✅ Check user has no active packages (prevent duplicates)
- ✅ Set appropriate maturity date based on package duration
- ✅ Document reason for rejection (if rejected)

### 2. Payment Matching
- ✅ Match users in chronological order (FIFO)
- ✅ Ensure giver and receiver amounts match exactly
- ✅ Verify both users are active and verified
- ✅ Monitor matches closely during first hour
- ✅ Contact users proactively at 5-hour mark

### 3. Ban Enforcement
- ⚠️ Only ban after attempting to contact user
- ⚠️ Document reason for ban clearly
- ⚠️ Check user payment history before banning
- ⚠️ Consider extending deadline for first-time users

### 4. Unban Decisions
- ✓ Verify user has made payment before unbanning
- ✓ Add note about reason for unban
- ✓ Consider probationary period (manual monitoring)
- ✓ Track repeat offenders

---

## Keyboard Shortcuts (Future Enhancement)

Currently not implemented, but planned:
- `Ctrl+K`: Quick search users
- `Ctrl+M`: Create new match
- `Ctrl+B`: View banned accounts
- `Ctrl+P`: View pending approvals
- `Escape`: Close any modal

---

## API Rate Limits

No current limits, but monitor:
- Payment match creation: Max 1 per second
- Ban/unban actions: Max 10 per minute
- Package approvals: Max 50 per minute

---

## Support Contacts

For technical issues:
- Backend errors: Check Render logs
- Frontend errors: Check browser console
- Database issues: Check PostgreSQL connection

For policy questions:
- Payment disputes: Contact receiver first
- Ban appeals: Review user history
- Maturity extensions: Follow company policy

---

## Version History

**v1.0.0** (Current)
- Initial release
- Package management
- Payment matching with 6-hour deadline
- Ban/unban system
- User payment display

**Upcoming Features** (v1.1.0)
- Auto-ban via cron job
- Email/SMS notifications
- Payment gateway integration
- Bulk operations
- Advanced reporting

---

**Last Updated**: [Current Date]
**Document Version**: 1.0.0
