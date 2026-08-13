# 🧾 Receipt Request System - Complete Guide

## Overview

The **Receipt Request System** allows agents from an external point-of-sale system to submit screenshots for receipt generation in the DAKIRO portal. This bridges two systems and ensures all transactions are properly documented in DAKIRO's system.

---

## 🔄 Workflow

### Agent Side: Submit Receipt Request

```
Agent in External System
    ↓
Makes a sale / registers customer
    ↓
Generates receipt/confirmation
    ↓
Takes screenshot of receipt
    ↓
Logs into DAKIRO Agent Portal
    ↓
Navigates to "Request Receipt" section
    ↓
Fills form:
  - Customer Name
  - Customer Phone
  - Amount (KES)
  - Description (device model)
  - Uploads screenshot image
    ↓
Clicks "Submit Request"
    ↓
Toast: "Receipt request submitted! Admin will review shortly."
    ↓
Request appears in list with "Pending" status
```

### Admin Side: Process Request

```
Admin logs in
    ↓
Navigates to "Receipt Requests" tab
    ↓
Sees agent submissions with status:
  - ⏳ Pending Review (yellow)
  - 👀 Processing (blue)
  - ✅ Receipt Generated (green)
    ↓
Clicks "Review" on pending request
    ↓
Modal opens showing:
  - Customer details
  - Amount
  - Description
  - Screenshot preview
    ↓
Admin reviews screenshot
    ↓
Clicks "Generate & Send Receipt"
    ↓
System creates receipt:
  - Generates Receipt ID (RCP-{timestamp})
  - Professional DAKIRO format
  - Sends notification to agent
    ↓
Status changes to "Ready"
```

### Agent: Download Receipt

```
Agent gets notification:
"Receipt for [Customer] approved. Receipt RCP-123456 generated."
    ↓
Navigates to "Request Receipt" section
    ↓
Finds request with status "Ready ✅"
    ↓
Clicks "Download Receipt [ID]"
    ↓
Receipt downloads as text file
    ↓
Receipt includes:
  - DAKIRO header
  - Customer details
  - Amount
  - Receipt ID
  - Agent name
  - Professional footer
```

---

## 📱 Agent Portal: Request Receipt

### Access
**URL**: http://localhost:3000/agent/dashboard → "Request Receipt" section

### Form Fields

| Field | Type | Required | Details |
|-------|------|----------|---------|
| Customer Name | Text | ✅ | Full name of customer |
| Customer Phone | Phone | ✅ | Customer contact number |
| Amount (KES) | Number | ✅ | Total transaction amount |
| Description | Text | ❌ | Device model or item description |
| Screenshot | File | ✅ | PNG/JPG/GIF (max 5MB) |

### Request Status

- **⏳ Pending**: Awaiting admin review
- **👀 In Review**: Admin is processing
- **✅ Ready**: Receipt generated and ready to download

### Actions

- ✅ **Submit Screenshot**: Upload and submit request
- 📥 **Download Receipt**: Get generated receipt (when ready)
- 👀 **View Status**: Check request status in real-time

### Stats Dashboard

- **Pending**: Requests awaiting admin
- **In Review**: Requests being processed
- **Ready**: Completed receipts available

---

## 🛡️ Admin Portal: Receipt Requests

### Access
**URL**: http://localhost:3000/dashboard → "Receipt Requests" tab

### Request List View

Shows three sections:
1. **Pending Review** (yellow) - Requires action
2. **Processing** (blue) - Being worked on
3. **Receipt Generated** (green) - Complete

### Review Modal

**Displays:**
- 📋 Request details (customer, amount, description, agent, date)
- 📸 Screenshot preview (full image)
- 🧾 Receipt ID (auto-generated upon approval)

**Actions:**
- ✓ **Generate & Send Receipt**
  - Creates professional DAKIRO receipt
  - Generates unique Receipt ID (RCP-{timestamp})
  - Sends notification to agent
  - Updates status to "Ready"

- ✕ **Reject**
  - Removes request from system
  - Can resubmit later

### Stats

| Metric | Meaning |
|--------|---------|
| Pending Review | New submissions needing action |
| Processing | Requests being reviewed |
| Ready | Receipts generated and sent |

---

## 📲 Notifications

### Agent Gets Notified When:

1. **Receipt Generated** 🧾
   - Message: "Receipt for [Customer] approved. Receipt RCP-123456 generated."
   - Action: Download receipt from "Request Receipt" section

2. **Receipt Ready** ✅
   - Status updates in real-time
   - Download button becomes active

### Admin Gets Notified When:

1. **New Request Submitted**
   - Appears immediately in "Pending Review" section
   - Bell icon updates with count

---

## 💾 Data Structure

### ReceiptRequest Object

```javascript
{
  id: "req-1692432000000",           // Unique request ID
  agentId: "agent-1",                 // Agent who submitted
  agentName: "Michael Kipchoge",      // Agent name
  customerName: "John Mwangi",        // Customer name
  customerPhone: "+254712345678",     // Customer phone
  amount: 18000,                      // Amount in KES
  description: "Samsung Galaxy A05",  // Item description
  screenshot: "data:image/png;base64,...", // Base64 image
  status: "pending|approved|ready",   // Status
  receiptId: "RCP-1692432000000",    // Generated ID (when ready)
  createdDate: "2026-08-13T10:00:00", // Submission time
  approvedDate: "2026-08-13T10:15:00" // Approval time (when ready)
}
```

### Storage
- **Location**: Browser `localStorage`
- **Key**: `receiptRequests`
- **Format**: JSON array of request objects

---

## 🎯 Use Cases

### Scenario 1: Simple Transaction
```
1. Agent sells phone in POS system
2. POS generates receipt
3. Agent takes screenshot
4. Submits screenshot in DAKIRO portal
5. Admin reviews (5 minutes)
6. Admin generates receipt
7. Agent downloads receipt
8. Transaction complete in both systems
```

### Scenario 2: Complex Transaction
```
1. Agent registers customer in POS
2. Enters payment details
3. POS confirms transaction
4. Takes screenshot showing:
   - Customer name
   - Device/product
   - Amount
   - Transaction ID
5. Uploads to DAKIRO
6. Admin verifies details match
7. Generates matching receipt
8. Both systems now in sync
```

### Scenario 3: Issue Resolution
```
1. Agent submits screenshot
2. Admin reviews and questions details
3. Admin rejects request
4. Agent adjusts details in POS
5. Takes new screenshot
6. Resubmits with corrections
7. Admin approves
8. Receipt issued
```

---

## 🔐 Security Features

✅ **Agent-Specific Data**
- Agents only see their own requests
- Cannot view other agent submissions

✅ **Screenshot Validation**
- Admin reviews before receipt generation
- Receipt ID not created until approved

✅ **Audit Trail**
- Submission time recorded
- Approval time recorded
- Receipt ID links to request

✅ **Notifications**
- Both parties notified of status changes
- Clear audit of all actions

---

## 📊 Receipt Format

When admin generates receipt, it includes:

```
                            CASH SALE
                DAKIRO GENERAL ELECTRONICS
                P.O BOX 46, KERICHO. Tel: 0720 049 708
            Opposite Kapsoit Guest House - Kapsoit Town

Date: DD/MM/YY

M/S [CUSTOMER NAME]

Dealers in: TV's, DVD, Phone, Phone Accessories, Players, Batteries,
            Solar Panels, Wiring Materials, D Lights, Cameras etc.

┌─────┬──────────────────────────────────────┬──────────┬─────┐
│ Qty │ Particulars                          │  Kshs.   │ Cts │
├─────┼──────────────────────────────────────┼──────────┼─────┤
│  1  │ [DESCRIPTION]                        │[AMOUNT]  │     │
│     │ Customer: [PHONE]                    │          │     │
├─────┼──────────────────────────────────────┼──────────┼─────┤
│     │ TOTAL                                │[AMOUNT]  │     │
└─────┴──────────────────────────────────────┴──────────┴─────┘

Receipt ID: RCP-1692432000000
Sales Agent: [AGENT NAME]
Customer Phone: [PHONE]

═══════════════════════════════════════════════════════════════════
                Goods once sold cannot be re-accepted
═══════════════════════════════════════════════════════════════════

Generated: [DATE TIME]
```

---

## 🧪 Testing the System

### As Agent:
1. Login: michael.kipchoge@dakiro.ke / Agent@123
2. Go to "Request Receipt"
3. Click "+ Submit Screenshot"
4. Fill form with test data
5. Upload any image
6. Click "Submit Request"
7. See request appear with "Pending" status

### As Admin:
1. Login: http://localhost:3000
2. Go to "Receipt Requests"
3. See agent's submission
4. Click "Review"
5. Check screenshot
6. Click "Generate & Send Receipt"
7. Receipt ID created
8. Agent notified

### Back as Agent:
1. Refresh dashboard
2. Get notification bell update
3. See request status change to "Ready"
4. Click "Download Receipt [ID]"
5. Receipt downloads

---

## 🚀 Future Enhancements

- [ ] Multiple screenshot uploads per request
- [ ] Payment breakdown capture from screenshot
- [ ] OCR to auto-fill form from screenshot
- [ ] Receipt template customization
- [ ] Email delivery of receipts
- [ ] SMS notification to customer
- [ ] Approval workflows (manager review before admin)
- [ ] Analytics: request processing time
- [ ] Bulk operations (approve multiple)
- [ ] Receipt archival and search

---

## 📋 Troubleshooting

**Issue**: Agent screenshot not uploading
- **Solution**: Check file size (max 5MB), ensure PNG/JPG/GIF format

**Issue**: Admin doesn't see receipt request
- **Solution**: Refresh page, check localStorage is enabled

**Issue**: Receipt not downloading
- **Solution**: Browser popup blocker may be active, allow downloads

**Issue**: Notification not received
- **Solution**: Check bell icon in TopBar for unread count

---

## 💡 Tips

1. **Screenshot Best Practices**
   - Show complete transaction details
   - Include customer info
   - Show amount clearly
   - Include timestamp if available

2. **Admin Review Tips**
   - Verify customer info matches
   - Confirm amount is accurate
   - Check for duplicate submissions
   - Process pending requests daily

3. **Agent Tips**
   - Use clear, readable screenshots
   - Provide accurate customer phone numbers
   - Include item descriptions
   - Monitor notification bell for approval

---

**System Status**: ✅ Active and Ready  
**Last Updated**: 2026-08-13  
**Version**: 1.0
