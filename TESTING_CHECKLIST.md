# 📋 DAKIRO Admin Portal - Comprehensive Testing Checklist

**Project**: Lipa Mdogo - DAKIRO Admin Dashboard  
**Date Started**: 2026-08-13  
**Status**: Final Testing Phase  

---

## 🎯 Phase 1: Authentication & Access

### Login Flow
- [ ] Load login page (/)
- [ ] Enter valid credentials
- [ ] Verify redirect to dashboard
- [ ] Verify "Welcome, Admin" shows in header
- [ ] Logout button works
- [ ] Unauthorized access returns to login

### Session Persistence
- [ ] Page refresh maintains login
- [ ] localStorage contains auth_token
- [ ] Session remains after tab switch
- [ ] Logout clears session data

---

## 📱 Phase 2: Phone Inventory Management

### Adding Devices
- [ ] Click "Add Device" in Dashboard
- [ ] Modal opens correctly
- [ ] Form fields: Model, IMEI, Serial, Condition
- [ ] IMEI validation (must be 15 digits)
- [ ] Serial number validation (3-30 chars)
- [ ] Submit adds device to inventory
- [ ] Toast notification shows success
- [ ] Device appears in Phone Inventory tab

### Bulk Upload
- [ ] Navigate to Phone Inventory
- [ ] Click "Bulk Upload" button
- [ ] Select CSV file
- [ ] Validate CSV has correct columns
- [ ] Show valid/invalid count
- [ ] Import successful devices
- [ ] Invalid devices shown in error list
- [ ] Download template works

### Viewing Inventory
- [ ] Phone Inventory tab shows all phones
- [ ] Filter by model works (A05, A06, etc.)
- [ ] Sort by status/condition works
- [ ] Search by IMEI works
- [ ] Click phone shows detail view
- [ ] Detail view shows: IMEI, Serial, Condition, Date Added

---

## 👥 Phase 3: Agent Management

### Agent Allocation
- [ ] Navigate to Agent Allocation
- [ ] Click "Allocate Phones to Agent"
- [ ] Search for agent by name works
- [ ] Search by phone number works
- [ ] Search by location works
- [ ] Select phone from dropdown
- [ ] Phone details preview shows
- [ ] Allocate button assigns phone
- [ ] Toast shows success
- [ ] Allocated phone count updates

### Agent Details View
- [ ] Click agent card to open details
- [ ] View agent personal information
- [ ] View performance metrics (allocated, sold, conversion)
- [ ] View all phones assigned to agent
- [ ] Edit agent details (name, phone, email, location)
- [ ] Save agent changes
- [ ] Changes persist after refresh
- [ ] Remove phone from agent works
- [ ] Assign new phone in modal works

### Agent Stock View
- [ ] Shows each agent with their phones
- [ ] Filter by agent
- [ ] See in-stock vs sold phones
- [ ] View agent performance metrics
- [ ] Allocated count matches database

---

## 💼 Phase 4: Sales Approval Workflow

### Pending Sales
- [ ] Sales Approval tab loads
- [ ] Shows pending sales correctly
- [ ] Display: Customer, Agent, Phone, Amount
- [ ] Click to open review modal
- [ ] Modal shows complete sale details
- [ ] Monthly payment calculation correct

### Approve Sale
- [ ] Click "Generate Note" button
- [ ] AI generates thank you message
- [ ] Message is personalized (customer name, phone model)
- [ ] Can edit generated message
- [ ] Click "Approve" button
- [ ] Toast shows approval success
- [ ] Phone marked as SOLD
- [ ] Moved to approved sales list
- [ ] Receipt generated (with ID)

### Reject Sale
- [ ] Click "Reject Sale" button
- [ ] Require rejection reason
- [ ] Save rejection with reason
- [ ] Status changes to "rejected"
- [ ] Toast shows rejection
- [ ] Moved to rejected list

---

## 📥 Phase 5: E-Receipts & Downloads

### Agent Receipt Access
- [ ] Navigate to "My E-Receipts"
- [ ] Show all approved sales
- [ ] Display stats: Total Sales, Revenue, Down Payments
- [ ] Click "Download E-Receipt" for each sale
- [ ] Receipt downloads as text file
- [ ] Filename includes receipt ID
- [ ] Content includes all transaction details

### Receipt Content
- [ ] Receipt ID present
- [ ] Customer name and phone
- [ ] Phone model, IMEI, serial
- [ ] Payment breakdown (total, down payment, balance)
- [ ] Monthly payment amount
- [ ] Terms & conditions included
- [ ] DAKIRO company info present
- [ ] Professional formatting

### Batch Downloads
- [ ] "Download All Receipts" button works
- [ ] Downloads summary file
- [ ] Includes all approved sales
- [ ] Properly formatted

---

## 📊 Phase 6: Reports & Exports

### Report Generation
- [ ] Navigate to Reports & Exports
- [ ] Category tabs work: General, Phone Models, Agents
- [ ] Select export format: PDF or Excel
- [ ] Click report card to generate

### PDF Reports
- [ ] PDF downloads successfully
- [ ] DAKIRO watermark present (diagonal text)
- [ ] Company header with contact info
- [ ] Report title and date
- [ ] Summary statistics correct
- [ ] Table data displays properly
- [ ] Multiple pages if needed
- [ ] Professional formatting

### Excel Reports
- [ ] Excel file downloads
- [ ] DAKIRO company info at top
- [ ] Headers and data rows correct
- [ ] Proper column widths
- [ ] Multiple sheets if needed
- [ ] Currency formatting correct

### Phone Model Reports
- [ ] Show all phone models
- [ ] Each model has report button
- [ ] Generate by model works
- [ ] PDF/Excel for each model
- [ ] Correct filtering by model

### Agent Reports
- [ ] Show all agents
- [ ] Agent performance stats displayed
- [ ] Generate individual agent report
- [ ] Downloads with agent name
- [ ] Data specific to agent

---

## 🤖 Phase 7: AI Assistant

### Opening & Closing
- [ ] Floating button visible (bottom-right)
- [ ] Click button opens chat window
- [ ] Close button (X) works
- [ ] Window opens/closes smoothly

### Commands & Responses
- [ ] Type "add device" → shows instructions
- [ ] Type "add customer" → explains agent-only policy
- [ ] Type "create sale" → explains agent-only policy
- [ ] Type "help" → shows capabilities
- [ ] Type "info" → shows company info
- [ ] Type "manage agents" → helpful response

### Quick Command Buttons
- [ ] Quick command buttons appear initially
- [ ] Buttons: Add Device, Manage Agents, View Reports, etc.
- [ ] Click button executes command
- [ ] Form modal opens when needed

### Message History
- [ ] Messages persist in conversation
- [ ] User messages appear on right
- [ ] Agent messages appear on left
- [ ] Scrolling works smoothly
- [ ] Latest message at bottom

---

## ✅ Phase 8: Form Validations

### Device Form
- [ ] IMEI must be 15 digits
- [ ] Serial number 3-30 chars
- [ ] Model is required
- [ ] Error messages display
- [ ] Border turns red on error
- [ ] Error clears when corrected
- [ ] Submit disabled with errors

### Sales Approval
- [ ] Cannot approve without form check
- [ ] Generate note validates
- [ ] Edit note field editable
- [ ] Approve/Reject buttons work

### Phone Allocation
- [ ] Agent required
- [ ] Phone required
- [ ] Error messages clear
- [ ] Validation prevents bad data

---

## 🎨 Phase 9: UI & User Experience

### Toast Notifications
- [ ] Success toast (green) appears
- [ ] Error toast (red) appears
- [ ] Warning toast (yellow) appears
- [ ] Auto-dismiss after 3 seconds
- [ ] Manual close (X) works
- [ ] Multiple toasts stack
- [ ] Position fixed (bottom-right)

### Loading States
- [ ] Buttons show loading text
- [ ] Disabled during processing
- [ ] Processing indicator visible
- [ ] Restore normal state after

### Responsive Design
- [ ] Desktop view (1920px) works
- [ ] Tablet view (768px) responsive
- [ ] Mobile view (375px) functional
- [ ] Tables scroll horizontally if needed
- [ ] Modals readable on small screens

### Navigation
- [ ] Sidebar collapses/expands
- [ ] Active tab highlighted
- [ ] Tab switching smooth
- [ ] No layout shifts
- [ ] All sections accessible

---

## 💾 Phase 10: Data Persistence

### localStorage
- [ ] auth_token saved
- [ ] activeTab saved and restored
- [ ] agentAllocations persisted
- [ ] agentDetails persisted
- [ ] pendingSales persisted
- [ ] soldPhones persisted

### Page Refresh
- [ ] After adding device → refresh → device still there
- [ ] After allocating phone → refresh → allocation persists
- [ ] After approving sale → refresh → status maintained
- [ ] Tab selection maintained
- [ ] No data loss

---

## 🔍 Phase 11: Search & Filter

### Agent Search
- [ ] Search by agent name works
- [ ] Search by phone number works
- [ ] Search by location works
- [ ] Results update in real-time
- [ ] No results message shows
- [ ] Case-insensitive search
- [ ] Partial matching works

### Customer Search
- [ ] Search customers by name works
- [ ] Search by phone works
- [ ] Filter by status works
- [ ] Results update instantly

### Inventory Search
- [ ] Search by IMEI works
- [ ] Filter by model works
- [ ] Filter by status works

---

## 📈 Phase 12: Data Accuracy

### Calculations
- [ ] Allocation count accurate
- [ ] Sold count accurate
- [ ] Available count correct (total - allocated)
- [ ] Conversion rate calculated correctly
- [ ] Monthly payment calculated (total - down) / months
- [ ] Revenue totals accurate

### Reporting
- [ ] Sales count matches database
- [ ] Customer count matches
- [ ] Agent count matches
- [ ] Revenue figures accurate
- [ ] Payment history complete

---

## 🔐 Phase 13: Security & Access

### Role-Based Access
- [ ] Admin cannot add customers
- [ ] Admin cannot create sales
- [ ] Admin cannot log payments
- [ ] Admin cannot generate receipts
- [ ] Admin can manage agents
- [ ] Admin can view reports

### Data Visibility
- [ ] Only assigned phones visible to agent
- [ ] Customer details properly displayed
- [ ] No sensitive data in console
- [ ] No unencrypted data in localStorage

---

## 📋 Phase 14: Edge Cases

### Empty States
- [ ] No pending sales → show message
- [ ] No approved sales → show message
- [ ] No customers → show message
- [ ] No agents → show message

### Large Datasets
- [ ] 100+ phones load
- [ ] 50+ agents searchable
- [ ] 1000+ sales queries work
- [ ] Performance acceptable

### Duplicate Handling
- [ ] Cannot allocate same phone twice
- [ ] Cannot add duplicate customer
- [ ] Cannot approve sale twice

---

## 🎉 Final Sign-Off

| Area | Status | Notes |
|------|--------|-------|
| Authentication | ✓/✗ | |
| Inventory | ✓/✗ | |
| Agents | ✓/✗ | |
| Sales Approval | ✓/✗ | |
| E-Receipts | ✓/✗ | |
| Reports | ✓/✗ | |
| AI Assistant | ✓/✗ | |
| Validation | ✓/✗ | |
| UI/UX | ✓/✗ | |
| Persistence | ✓/✗ | |
| Search | ✓/✗ | |
| Accuracy | ✓/✗ | |
| Security | ✓/✗ | |
| Edge Cases | ✓/✗ | |

**Overall Status**: [ ] READY FOR PRODUCTION | [ ] NEEDS FIXES

**Tested By**: ________________  
**Date Completed**: ________________  
**Notes/Issues Found**:
