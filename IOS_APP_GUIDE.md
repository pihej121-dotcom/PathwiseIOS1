# Pathwise iOS App - Setup & Deployment Guide

This guide will help you build and publish your Pathwise web app as a native iOS application using Capacitor.

## 📱 What's Been Configured

Your Pathwise web app has been successfully wrapped with Capacitor for iOS deployment:

✅ **Capacitor iOS platform installed and configured**
✅ **App icons configured** (using your Pathwise logo)
✅ **iOS permissions added** (Camera, Photo Library, Documents)
✅ **Production build scripts ready**
✅ **Splash screen configured**

## 🛠 Prerequisites

Before you can build and submit your iOS app, you need:

1. **Mac computer** with macOS (required for iOS development)
2. **Xcode** (latest version from Mac App Store)
3. **Apple Developer Account** ($99/year)
   - Sign up at: https://developer.apple.com
4. **CocoaPods** (iOS dependency manager)
   ```bash
   sudo gem install cocoapods
   ```

## 🚀 Building Your iOS App

### Step 1: Sync Your Code to Your Mac

Download or clone this Replit project to your Mac computer.

### Step 2: Install Dependencies on Your Mac

```bash
# Install Node.js dependencies
npm install

# Install iOS native dependencies (CocoaPods)
cd ios/App
pod install
cd ../..
```

### Step 3: Build and Sync

```bash
# Build the web app and sync to iOS
npm run ios:build
```

This command does two things:
1. Builds your production web assets (`npm run build`)
2. Syncs them to the iOS project (`npx cap sync ios`)

### Step 4: Open in Xcode

```bash
npm run ios:open
```

Or manually:
```bash
open ios/App/App.xcworkspace
```

**⚠️ Important:** Always open the `.xcworkspace` file, NOT the `.xcodeproj` file!

## 📝 Xcode Configuration

Once Xcode opens:

### 1. Select Your Development Team

1. Click on **"App"** in the project navigator (left sidebar)
2. Select the **"App"** target under TARGETS
3. Go to **"Signing & Capabilities"** tab
4. Under **"Team"**, select your Apple Developer account
5. Xcode will automatically manage your provisioning profiles

### 2. Configure Bundle Identifier (if needed)

- The bundle ID is set to: `com.pathwise.app`
- You can change it to match your organization:
  - Format: `com.yourcompany.pathwise`
  - This must be unique in the App Store

### 3. Update Version & Build Numbers

- **Version**: Found under "General" → "Identity" → "Version" (e.g., 1.0.0)
- **Build**: Build number (increment for each submission)

### 4. Configure App Store Information

Go to **General** tab and review:
- **Display Name**: Pathwise (shown under the icon)
- **Bundle Identifier**: com.pathwise.app (must be unique)
- **Version**: 1.0.0
- **Build**: 1
- **Deployment Target**: iOS 14.0 or higher recommended

## 🎨 Customizing Icons & Splash Screen

### App Icons

Your Pathwise logo has been set as the app icon. To update:

1. Navigate to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. Replace `AppIcon-512@2x.png` with your 1024x1024 PNG icon
3. Run `npm run ios:build` to sync

**Pro Tip**: Use a tool like [appicon.co](https://appicon.co/) to generate all required sizes.

### Splash Screen

The splash screen can be customized at:
- `ios/App/App/Assets.xcassets/Splash.imageset/`

Or configure it in `capacitor.config.ts`:
```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    backgroundColor: "#ffffff",
    // Add your custom settings
  }
}
```

## 🧪 Testing Your App

### Simulator Testing

1. In Xcode, select a simulator from the device dropdown (e.g., "iPhone 15 Pro")
2. Click the **Play** button (▶️) or press `Cmd + R`
3. The app will build and launch in the simulator

### Physical Device Testing

1. Connect your iPhone via USB
2. Select your device from the device dropdown in Xcode
3. Click the Play button
4. First time: Trust the developer certificate on your iPhone
   - Settings → General → VPN & Device Management → Trust

## 🌐 Server Configuration

### Development Mode

By default, the app points to your Replit development server:
```
https://workspace.[owner].repl.co
```

This is configured in `capacitor.config.ts`:
```typescript
server: {
  url: process.env.REPL_ID 
    ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
    : undefined,
}
```

### Production Mode

Before App Store submission:

1. **Deploy your backend** (use Replit Deploy or your own server)
2. **Update `capacitor.config.ts`**:
   ```typescript
   server: {
     url: undefined, // Use local build
   }
   ```
3. **Rebuild and sync**:
   ```bash
   npm run ios:build
   ```

For a live backend, you can hardcode your production URL:
```typescript
server: {
  url: 'https://your-production-domain.com',
}
```

## 🍎 App Store Submission

### Step 1: Prepare App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **"My Apps"** → **"+"** → **"New App"**
3. Fill in:
   - **Platform**: iOS
   - **Name**: Pathwise
   - **Primary Language**: English
   - **Bundle ID**: com.pathwise.app (must match Xcode)
   - **SKU**: A unique identifier (e.g., pathwise-ios-001)

### Step 2: Prepare App Information

You'll need:
- **App Description** (career development platform for students)
- **Keywords** (resume, career, job matching, AI, students)
- **Screenshots** (required sizes: 6.5" and 5.5" iPhone displays)
- **App Icon** (1024x1024, already configured)
- **Privacy Policy URL** (required)
- **Support URL**
- **Marketing URL** (optional)

### Step 3: Archive Your App

1. In Xcode, select **"Any iOS Device (arm64)"** from the device dropdown
2. Go to **Product** → **Archive**
3. Wait for the build to complete (appears in Organizer)

### Step 4: Upload to App Store Connect

1. In Organizer, select your archive
2. Click **"Distribute App"**
3. Select **"App Store Connect"**
4. Follow the wizard:
   - **Upload**: Yes
   - **Include bitcode**: No (unless needed)
   - **Symbols**: Yes (for crash reports)
   - **Automatic signing**: Yes (recommended)
5. Click **Upload**

### Step 5: Submit for Review

1. Go to App Store Connect
2. Select your app → version
3. Fill in all required fields:
   - Version information
   - Build selection (select uploaded build)
   - Screenshots
   - Description
   - Keywords
   - Support & Privacy URLs
   - Content ratings
4. Click **"Submit for Review"**

### Review Process

- **Time**: 24-48 hours typically
- **Requirements**: Apple reviews for quality, privacy, functionality
- **Common rejections**:
  - Missing privacy policy
  - Broken functionality
  - Missing content ratings
  - Incomplete app description

## 🔄 Updating Your App

When you make changes to your web app:

```bash
# 1. Update your code
# 2. Build and sync
npm run ios:build

# 3. Open Xcode
npm run ios:open

# 4. Increment build number in Xcode
# 5. Archive and upload (repeat Step 3-4 from App Store Submission)
```

## 🔐 Permissions Explained

Your app requests these permissions (configured in `Info.plist`):

- **Camera**: For capturing profile photos and documents
- **Photo Library**: To select images for profile and resume
- **Documents**: To upload and analyze resumes
- **Network**: For API communication with your backend

Users will see permission prompts with the descriptions you've configured.

## 🐛 Troubleshooting

### Build Fails in Xcode

**Issue**: "No such module" or missing dependencies
**Solution**: 
```bash
cd ios/App
pod install
cd ../..
```

### App Shows Blank Screen

**Issue**: Server URL not accessible
**Solution**: Check `capacitor.config.ts` server URL and ensure backend is running

### Signing Issues

**Issue**: "No signing certificate found"
**Solution**: 
1. Open Xcode preferences (Cmd + ,)
2. Go to Accounts
3. Add your Apple ID
4. Download certificates

### CocoaPods Not Found

**Issue**: `pod: command not found`
**Solution**:
```bash
sudo gem install cocoapods
```

## 📚 Additional Resources

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Xcode Documentation](https://developer.apple.com/documentation/xcode)

## ✅ Quick Checklist

Before submitting to App Store:

- [ ] Backend deployed to production server
- [ ] `capacitor.config.ts` updated with production URL (or set to undefined)
- [ ] App tested on physical device
- [ ] All features working correctly
- [ ] Bundle ID is unique and correct
- [ ] Version and build numbers set
- [ ] App icons look good (1024x1024)
- [ ] Privacy policy URL ready
- [ ] Support URL ready
- [ ] Screenshots prepared (all required sizes)
- [ ] App description written
- [ ] Keywords selected
- [ ] Content rating completed
- [ ] Archived and uploaded to App Store Connect
- [ ] All App Store Connect fields filled
- [ ] Submitted for review

## 🎉 Success!

Once approved, your Pathwise app will be live on the App Store for users to download!

---

**Need Help?** Check the [Capacitor Community](https://ionic.io/community) or [Apple Developer Forums](https://developer.apple.com/forums/)
