# Admin Panel Setup & User Guide

## Overview

The InvestPlatform Admin Panel is a comprehensive management system for administrators to oversee users, investments, funds, and transactions. This guide explains how to set up, connect, and use the admin panel.

---

## 🔐 Admin Access

### Login Credentials

Admin accounts require special permissions. To log in as admin:

1. Go to `/login`
2. Enter admin email and password
3. You'll be redirected to `/admin` on successful login
4. Navigate to the admin panel

### Creating Admin Accounts

Admin accounts must be created by the Super Admin through the database:

```sql
INSERT INTO users (id, email, password_hash, fullName, phone, profilePhoto, role)
VALUES (
  uuid_generate_v4(),
  'admin@investplatform.com',
  -- Use bcrypt for password hashing
  'bcrypt_hashed_password_here',
  'Admin User',
  '+233 24 123 4567',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  'admin'
);
```

---

## 📊 Dashboard View

The main dashboard provides key metrics:

### Statistics Cards
- **Total Users** - All registered users count
- **Active Investments** - Currently active investment plans
- **Funds Managed** - Total funds under management
- **Pending Payments** - Awaiting member confirmation

### Dashboard Sections
1. **Recent Users** - Last 5 registered users
   - User name, email, and account status
   - Quick action: View full profile

2. **Investment Plans** - All available plans
   - Plan name, amount, ROI, and duration
   - Modification options

---

## 👥 User Management

### Accessing User Management
1. Click **"Users"** in sidebar
2. View complete user table with filters

### User Information Display
| Column | Description |
|--------|-------------|
| User | Profile photo, name |
| Email | User email address |
| Phone | Contact number |
| Status | Active Plan / No Plan |
| Joined | Account creation date |
| Action | View/Edit profile |

### User Operations
- **View Profile** - Click "View" to see detailed user info
- **Edit User** - Modify user information
- **Suspend Account** - Temporarily disable account
- **Delete User** - Permanently remove user (requires confirmation)
- **Reset Password** - Force password reset at next login

### User Search & Filter
```
Filter by:
- Status (Active Plan / No Plan)
- Join Date Range
- VIP Status
- Verification Status
```

---

## 💼 Investment Management

### Accessing Investments
1. Click **"Investments"** in sidebar
2. View all active investments

### Investment Card Layout
- User photo and name
- Plan type (Bronze, Silver, Gold, Platinum)
- Investment amount
- Expected ROI
- Status indicator
- View Details button

### Investment Actions
- **View Details** - Complete investment information
- **View Timeline** - Investment progress and timeline
- **View Payment Status** - Member payment confirmation
- **Extend Period** - Add extra days to investment
- **Process ROI** - Manually trigger ROI disbursement
- **Cancel Investment** - End investment early
- **Dispute Resolution** - Handle investment disputes

### Investment Status Updates
Monitor investment status:
- **Active** - Investment in progress
- **Matched** - Member matched and payment expected
- **In Review** - Pending verification
- **Pending Payment** - Awaiting member transfer
- **Completed** - Investment finished, ROI disbursed
- **Disputed** - Under investigation

---

## 💰 Fund Management

### Accessing Fund Management
1. Click **"Fund Management"** in sidebar
2. View fund distribution and allocations

### Fund Overview
Display:
- **Total Available Funds** - Unallocated funds
- **Allocated to Investments** - Funds in active investments
- **Reserved for ROI** - ROI payouts ready
- **System Reserve** - Emergency funds

Visual progress bars show:
- Fund allocation percentage
- Available vs. allocated ratio
- Reserve ratio

### Fund Actions

#### Deposit Funds
```
1. Click "Deposit Funds"
2. Select payment method
3. Enter amount (GHS)
4. Confirm transaction
5. Upload proof of deposit
6. Submit for verification
```

#### Fund Allocation
- Allocate funds to investment pool
- Set aside reserve funds
- Create emergency fund allocation

#### Generate Financial Report
```
1. Click "Generate Report"
2. Select report type:
   - Monthly Statement
   - Quarterly Report
   - Annual Report
   - Custom Date Range
3. Choose format (PDF/Excel)
4. Download or email report
```

#### Fund Settings
Configure:
- Minimum reserve percentage
- ROI payout frequency
- Automatic reallocation settings
- Alert thresholds

### Fund History Table
Shows all fund movements:
- Transaction date
- Type (Deposit/Allocation/ROI)
- Amount
- Balance after transaction
- Status

---

## 💳 Transaction Management

### Accessing Transactions
1. Click **"Transactions"** in sidebar
2. View all system transactions

### Transaction Table Columns
| Column | Description |
|--------|-------------|
| ID | Unique transaction ID |
| Type | Deposit / Withdrawal / ROI / Fee |
| Amount | Transaction amount (GHS) |
| Status | Pending / Completed / Failed |
| Date | Transaction timestamp |
| User | Associated user |
| Description | Transaction details |

### Transaction Filtering
```
Filter by:
- Date range
- Transaction type
- Status
- Amount range
- User
```

### Transaction Operations
- **View Details** - Complete transaction information
- **Mark as Completed** - Update pending transactions
- **Retry Failed** - Retry failed transactions
- **Refund** - Reverse transaction
- **Export** - Download transaction records
- **Dispute** - Flag transaction for investigation

### Transaction Statuses
- **Pending** - Awaiting processing
- **Processing** - Currently being processed
- **Completed** - Successfully processed
- **Failed** - Transaction failed
- **Disputed** - Under investigation
- **Refunded** - Money returned to user

---

## 📈 Analytics & Reports

### Available Reports
1. **User Growth** - Monthly active users
2. **Investment Performance** - ROI statistics
3. **Fund Allocation** - Distribution breakdown
4. **Transaction Volume** - Daily/monthly volume
5. **Platform Health** - System metrics
6. **Compliance Report** - Regulatory requirements

### Generating Reports
```
1. Navigate to Reports section
2. Select report type
3. Choose date range
4. Apply filters (optional)
5. Generate report
6. Download (PDF/Excel) or email
```

---

## ⚙️ System Configuration

### Admin Settings
Navigate to Settings to configure:

#### General Settings
- Platform name
- Logo and branding
- Contact information
- Support email/phone

#### Investment Settings
- Enable/disable new investments
- Minimum/maximum investment amounts
- ROI calculation method
- Investment duration limits
- Approval requirements

#### User Settings
- Registration requirements
- Email verification
- Phone verification
- KYC requirements
- Suspension policies

#### Payment Settings
- Supported payment methods
- Transaction limits
- Payout frequency
- Fee structure
- Bank details

#### Security Settings
- Two-factor authentication
- IP whitelisting
- Session timeout
- Password requirements
- Activity logging

---

## 🔔 Notifications & Alerts

### Alert Types
1. **User Alerts**
   - New registration
   - Account suspension
   - Verification status
   - Password reset requests

2. **Investment Alerts**
   - New investment request
   - Investment matched
   - Payment pending (overdue)
   - Investment complete
   - ROI disbursed

3. **Fund Alerts**
   - Low reserve warning
   - Fund threshold exceeded
   - Large transaction alert
   - Failed transaction
   - Suspicious activity

4. **System Alerts**
   - System downtime
   - High error rate
   - Backup completion
   - Security issues

### Managing Alerts
```
Settings → Notifications
- Enable/disable alert types
- Set notification channels (Email/SMS/In-app)
- Configure alert thresholds
- Set quiet hours
```

---

## 📋 Compliance & Audit

### Audit Logs
Access complete audit trail of all admin actions:
- Admin name
- Action performed
- User affected
- Date/time
- IP address
- Status

### Compliance Reports
Generate compliance reports for:
- Customer Due Diligence (CDD)
- Know Your Customer (KYC)
- Anti-Money Laundering (AML)
- Transaction Monitoring
- Suspicious Activity Reporting (SAR)

### Data Export
Export user/transaction data:
```
1. Select data to export
2. Choose format (CSV/Excel/JSON)
3. Apply filters (optional)
4. Download
5. Data includes all metadata
```

---

## 🔗 Connecting to Backend API

### API Configuration

1. **Set Environment Variables**
```env
VITE_API_URL=https://api.investplatform.com
VITE_API_KEY=your_admin_api_key
VITE_ADMIN_TOKEN=your_jwt_token
```

2. **Configure Axios Instance**
```typescript
// services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    'Content-Type': 'application/json'
  }
});
```

3. **Implement API Calls**
```typescript
// In AdminPanel.tsx - Replace mock data with API calls

const fetchUsers = async () => {
  try {
    const { data } = await apiClient.get('/admin/users');
    setUsers(data);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

const fetchInvestments = async () => {
  try {
    const { data } = await apiClient.get('/admin/investments');
    setInvestments(data);
  } catch (error) {
    console.error('Failed to fetch investments:', error);
  }
};

const fetchFunds = async () => {
  try {
    const { data } = await apiClient.get('/admin/funds');
    setFunds(data);
  } catch (error) {
    console.error('Failed to fetch funds:', error);
  }
};
```

---

## 🚨 Common Admin Tasks

### Adding a New Investment Plan
```
1. Admin Dashboard → Investment Settings
2. Click "Add New Plan"
3. Fill plan details:
   - Plan name
   - Amount (GHS)
   - ROI percentage
   - Duration (days)
   - Benefits list
4. Click "Create Plan"
5. Plan appears in user selection
```

### Processing ROI Payments
```
1. Users → Select completed investment
2. Click "Process ROI"
3. Verify calculations
4. Select payout method
5. Confirm and process
6. Transaction created automatically
```

### Handling Disputes
```
1. Transactions → Filter "Disputed"
2. Click dispute to view details
3. Review transaction and evidence
4. Make decision:
   - Approve refund
   - Deny refund
   - Request more info
5. Update transaction status
6. Notify user
```

### Generating Monthly Report
```
1. Reports → Financial Report
2. Select "Monthly"
3. Choose month/year
4. Apply filters if needed
5. Generate
6. Download as PDF/Excel
7. Email to stakeholders
```

---

## 📞 Technical Support

For backend integration issues:
- API Documentation: `/api/docs`
- Support Email: `admin-support@investplatform.com`
- Slack Channel: #admin-support
- Response Time: 1-2 hours during business hours

---

## 📚 Additional Resources

- [Main Documentation](./DOCUMENTATION.md)
- [API Reference](./API_REFERENCE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Security Guidelines](./SECURITY.md)

---

## Version History

- **v1.0.0** (Current) - Initial admin panel release
- Future: Advanced analytics, automated reporting, AI-powered fraud detection

---

## 💡 Best Practices

1. **Regular Backups** - Daily database backups
2. **Audit Logs** - Review admin logs weekly
3. **User Verification** - Manually verify suspicious accounts
4. **Fund Safety** - Maintain 20%+ emergency reserve
5. **Communication** - Notify users of platform changes
6. **Security** - Change admin passwords monthly
7. **Compliance** - Keep compliance reports up-to-date

---

**Last Updated**: January 23, 2024
**Admin Panel Version**: 1.0.0
