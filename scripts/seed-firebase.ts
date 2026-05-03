import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';
import { TOOL_CONTENT } from '../src/lib/constants';

// Load variables from .env
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const COMPANY_CONTENT = {
  about: {
    title: 'About ImageToolLab',
    seoTitle: 'About Us - ImageToolLab',
    seoDescription: 'Learn more about ImageToolLab\'s mission to provide fast, secure, and completely private browser-based image editing tools.',
    body: `
ImageToolLab was born out of a simple observation: most online image editing tools are either too complex, filled with intrusive ads, or compromise user privacy by uploading sensitive data to remote servers.

We decided to build a better alternative. A tool that is powerful yet simple, beautiful yet functional, and most importantly, 100% private.

### Blazing Fast
By leveraging modern browser APIs and hardware acceleration, we process your images instantly right on your device.

### Privacy First
Your images never leave your computer. We don't have servers that store your data, because we don't need them.

## Our Mission
Our mission is to democratize high-quality image editing. We believe that everyone should have access to professional-grade tools without having to worry about their privacy or paying expensive subscriptions.
`
  },
  privacy: {
    title: 'Privacy Policy',
    seoTitle: 'Privacy Policy - ImageToolLab',
    seoDescription: 'Read the ImageToolLab Privacy Policy. Discover how we protect your data by processing images entirely inside your browser without external servers.',
    body: `
*Last updated: April 12, 2026*

At ImageToolLab, your privacy is not just a feature—it's our core philosophy. Because our application runs entirely in your web browser, we do not collect, store, or transmit any of the images you edit.

## 1. Data Collection
We do not collect any personally identifiable information (PII). We do not use tracking cookies to follow you across the web. The only data we might see is anonymous, aggregated usage statistics (like which tools are most popular) to help us improve the app.

## 2. Image Processing
All image processing is performed locally on your device using JavaScript and the Canvas API. When you "upload" an image, it is simply loaded into your browser's memory. It is never sent to our servers or any third-party service.

## 3. Third-Party Services
We may use third-party CDNs to serve our application's code and assets. These providers may log your IP address as part of standard web server logs, but they do not have access to the data you process within the app.
`
  },
  terms: {
    title: 'Terms of Service',
    seoTitle: 'Terms of Service - ImageToolLab',
    seoDescription: 'Review the Terms of Service for using ImageToolLab.',
    body: `
By using ImageToolLab, you agree to the following terms. Please read them carefully.

## 1. Use of Service
ImageToolLab is provided "as is" and "as available". You are free to use our tools for personal or commercial purposes. You are responsible for ensuring you have the rights to the images you edit.

## 2. Prohibited Activities
You may not use ImageToolLab to process illegal content or engage in activities that violate the rights of others. Since processing happens on your device, you are solely responsible for your actions.

## 3. Limitation of Liability
ImageToolLab and its creators shall not be liable for any damages arising from the use or inability to use our services, including but not limited to data loss or image corruption.
`
  },
  contact: {
    title: 'Contact Us',
    seoTitle: 'Contact Us - ImageToolLab',
    seoDescription: 'Get in touch with the ImageToolLab team. Reach out via email or connect with us on social media for support and feedback.',
    body: `
Have a question, feedback, or a feature request? We'd love to hear from you! Since ImageToolLab is a community-driven project, your input is invaluable.

### Email Us
General inquiries and support: [hello@imagetoollab.com](mailto:hello@imagetoollab.com)

### Social
Follow us for updates:
- Twitter
- GitHub

### Open Source
ImageToolLab is an open-source project. If you're a developer and want to contribute or report a bug, please visit our GitHub repository.
`
  }
};

async function seed() {
  if (!firebaseConfig.projectId || firebaseConfig.projectId === "YOUR_PROJECT_ID") {
    console.error("❌ Firebase configuration not found in .env");
    console.error("Please add your Firebase project details to the .env file before seeding.");
    process.exit(1);
  }

  console.log(`Connecting to Firebase project: ${firebaseConfig.projectId}...`);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  let successCount = 0;
  let errorCount = 0;

  for (const [toolId, content] of Object.entries(TOOL_CONTENT)) {
    try {
      const docRef = doc(db, 'pages', toolId);
      
      await setDoc(docRef, {
        title: content.title,
        desc: content.desc,
        benefits: content.benefits,
        seoTitle: `${content.title} - ImageToolLab`,
        seoDescription: content.desc,
        updatedAt: new Date().toISOString()
      });
      
      console.log(`✅ Seeded page: ${toolId}`);
      successCount++;
    } catch (err) {
      console.error(`❌ Error seeding ${toolId}:`, err);
      errorCount++;
    }
  }

  for (const [pageId, content] of Object.entries(COMPANY_CONTENT)) {
    try {
      const docRef = doc(db, 'pages', pageId);
      
      await setDoc(docRef, {
        title: content.title,
        seoTitle: content.seoTitle,
        seoDescription: content.seoDescription,
        body: content.body.trim(),
        updatedAt: new Date().toISOString()
      });
      
      console.log(`✅ Seeded company page: ${pageId}`);
      successCount++;
    } catch (err) {
      console.error(`❌ Error seeding ${pageId}:`, err);
      errorCount++;
    }
  }

  // Seed sample article
  try {
    const articleId = "how-to-resize-images-without-losing-quality";
    const articleRef = doc(db, 'articles', articleId);
    
    await setDoc(articleRef, {
      title: "How to Resize Images Without Losing Quality",
      slug: "how-to-resize-images-without-losing-quality",
      excerpt: "Learn the secrets of maintaining crisp, high-resolution images even when scaling them down for your website or social media. We cover aspect ratios, algorithms, and more.",
      body: `
Resizing images is a common task, but doing it without losing quality can be tricky. Whether you are preparing photos for a website, a presentation, or social media, maintaining clarity is crucial.

## Understanding Aspect Ratios
The most important rule of resizing is to maintain the original aspect ratio. If you change the width without proportionally changing the height, your image will stretch and distort.

## Interpolation Algorithms
When you resize an image, the software has to guess what the new pixels should look like. This process is called interpolation.
- **Bicubic Interpolation**: Best for smooth gradients and photographs.
- **Nearest Neighbor**: Best for pixel art and hard edges.

## Why Browser-Side Processing is Better
Traditionally, resizing required uploading your images to a server. This is slow and raises privacy concerns. With tools like ImageToolLab, the resizing happens entirely in your browser using the Canvas API. This means zero upload time and 100% privacy.

> Always keep a backup of your original high-resolution image before resizing!
      `,
      seoTitle: "How to Resize Images Without Losing Quality - Guide",
      seoDescription: "Learn the secrets of maintaining crisp, high-resolution images even when scaling them down for your website or social media.",
      imageUrl: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=2067&auto=format&fit=crop",
      publishedAt: new Date().toISOString()
    });
    
    console.log(`✅ Seeded sample article: ${articleId}`);
    successCount++;
  } catch (err) {
    console.error(`❌ Error seeding article:`, err);
    errorCount++;
  }

  console.log(`\n🎉 Seeding complete!`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
  
  process.exit(0);
}

seed();
