# Resume Save Debugging Guide

## Current Status
The resume save functionality has been enhanced with comprehensive logging to identify the exact issue.

## Server-Side Changes
Added detailed logging to `/api/resumes` endpoint (server/routes.ts line ~1100):
- Logs when the endpoint is called
- Logs the user ID making the request
- Logs request body details (fileName, filePath, text length)
- Logs successful resume creation with the new resume ID
- Logs any errors during the process

## Client-Side Logging
Enhanced ResumeUpload.tsx with console logs:
- Text extraction status
- State updates (resumeText length)
- Submit button clicks
- Mutation execution

## How to Test

### Prerequisites
1. Make sure you're signed in (auth required)
2. Open browser developer console (F12)
3. Navigate to Resume Upload page

### Testing Steps
1. **Upload a resume file** (PDF or DOCX)
   - Expected: Console shows "Text extracted: { length: XXXX, fileName: '...' }"
   - Expected: Console shows "State updated - resumeText length: XXXX"
   - Expected: Blue alert appears: "Resume text extracted (XXXX characters). Ready to save!"

2. **Click "Save Resume" button**
   - Expected: Console shows "Submit clicked - resumeText length: XXXX"
   - Expected: Console shows "Submitting resume..."
   - Expected: Button changes to "Saving..." with spinner

3. **Check server logs** (workflow console)
   - Expected: "=== POST /api/resumes CALLED ==="
   - Expected: "User ID: ..."
   - Expected: "Request body: { fileName: ..., extractedTextLength: ... }"
   - Expected: "=== Resume created successfully ==="
   - Expected: "Resume ID: ..."

4. **Check result**
   - Expected: Green success alert appears
   - Expected: Resume appears in "Your Resumes" list below
   - Expected: Resume queries are invalidated and refetched

## Common Failure Scenarios

### Scenario 1: Button is Disabled
**Symptom:** Can't click "Save Resume" button
**Cause:** `resumeText` state is empty
**Debug:** Check if "Text extracted" console log appears
**Fix:** File extraction failed - check FileUploadExtractor component

### Scenario 2: 401 Unauthorized
**Symptom:** Error toast: "Session Expired" or "Upload failed"
**Cause:** Not authenticated or session expired
**Console:** "Upload error:" followed by error details
**Fix:** Sign in again

### Scenario 3: 400 Bad Request
**Symptom:** Error toast: "extractedText is required"
**Cause:** Empty resume text sent to server
**Server Log:** "ERROR: extractedText is missing or empty"
**Fix:** Text extraction failed

### Scenario 4: 500 Server Error
**Symptom:** Error toast: "Failed to create resume"
**Server Log:** "Resume creation error:" with error details
**Fix:** Database or storage issue - check server error logs

### Scenario 5: Network Error
**Symptom:** Generic network error toast
**Cause:** Request didn't reach server
**Fix:** Check if server is running, check network tab in devtools

### Scenario 6: No Logs At All
**Symptom:** Clicking button does nothing
**Cause:** Event handler not firing or mutation not configured
**Fix:** Check if `handleSubmit` is properly bound to form

## Network Debugging

Open Network tab in DevTools:
1. Filter by "Fetch/XHR"
2. Click "Save Resume"
3. Look for POST request to `/api/resumes`
4. Check request payload (should contain fileName, filePath, extractedText)
5. Check response (should be 201 with resume object, or error code with message)

## File Locations
- Frontend: `client/src/pages/ResumeUpload.tsx`
- Backend: `server/routes.ts` (line ~1100)
- File Extractor: `client/src/components/FileUploadExtractor.tsx`
- API Client: `client/src/lib/queryClient.ts`
