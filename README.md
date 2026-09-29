# WhatsFlow

WhatsFlow is a WhatsApp automation project built with **Next.js** and
the **Meta WhatsApp Cloud API**.

The project allows a business to create simple automation rules for
incoming WhatsApp messages. Depending on the incoming message, WhatsFlow
can match a rule and send a text response, buttons, or an interactive
menu. It also supports media headers such as images and PDFs for
supported interactive responses.

This project was built as a practical full-stack project to learn and
implement:

-   Next.js App Router
-   React
-   Node.js API routes
-   MongoDB with Mongoose
-   Google OAuth
-   JWT-based authentication
-   Meta WhatsApp Cloud API
-   Webhooks
-   QStash for background processing
-   Cloudinary for media storage
-   Rule-based message automation

------------------------------------------------------------------------

## Demo

> **Live Demo:** \[\]

> **Demo Video:** \[]

### Demo Login

The following credentials can be added here if you provide a demo
account for recruiters.

``` text
Email:    
Password: 
```



``` text
Demo Login:
Use the "Continue with Google" button.

Demo account:
YOUR_DEMO_GOOGLE_ACCOUNT
```

------------------------------------------------------------------------

## Screenshots

 screenshots of the important parts of the application here.

### Dashboard

![WhatsFlow Dashboard](./docs/images/dashboard.png)

### Automation Rules

![WhatsFlow Automations](./docs/images/automations.png)

### Create Rule

![WhatsFlow Rule Modal](./docs/images/create-rule.png)

### Settings

![WhatsFlow Settings](./docs/images/settings.png)

> Replace the image paths above with your actual screenshots.

------------------------------------------------------------------------

## Demo Video


For example:

``` text
docs/
└── video/
    └── whatsflow-demo.mp4
```



A better option is to upload the demo video to a platform such as
YouTube or use a GitHub-hosted video/asset and link it from the README.

Example:

``` markdown
[Watch the WhatsFlow Demo](YOUR_VIDEO_URL)
```

------------------------------------------------------------------------

# What WhatsFlow Does

A business can create automation rules such as:

``` text
Incoming message:
"price"

        ↓

Find matching rule

        ↓

Rule response:
"Here is our pricing information."

        ↓

Send WhatsApp message
```

It can also handle button replies and interactive list selections.

Example:

``` text
User
  ↓
Clicks "Pricing"
  ↓
Meta WhatsApp Webhook
  ↓
WhatsFlow
  ↓
Find matching button rule
  ↓
Send configured response
```

------------------------------------------------------------------------

# Main Features

-   Google login
-   JWT-based authentication
-   WhatsApp webhook integration
-   Keyword-based automation rules
-   Button-based automation rules
-   Interactive menu/list rules
-   Text responses
-   WhatsApp interactive buttons
-   Interactive list menus
-   Image/PDF media headers for supported interactive messages
-   Rule activation/deactivation
-   Cloudinary media uploads
-   MongoDB data storage
-   Background processing using QStash
-   Dashboard for managing automations
-   WhatsApp business information/settings
-   Server-side Meta access token handling

------------------------------------------------------------------------

# Tech Stack

  Technology                Purpose
  ------------------------- -------------------------------
  Next.js                   Full-stack React framework
  React                     User interface
  Tailwind CSS              Styling
  MongoDB                   Database
  Mongoose                  MongoDB ODM
  Meta WhatsApp Cloud API   WhatsApp messaging
  Google OAuth              Authentication
  JWT                       Session authentication
  QStash                    Background message processing
  Cloudinary                Media storage
  Axios                     HTTP requests
  React Hook Form           Form handling
  Lucide React              Icons

------------------------------------------------------------------------

# How the Project Works

The main message flow is:

``` text
User sends WhatsApp message
            │
            ▼
Meta WhatsApp Cloud API
            │
            ▼
WhatsFlow Webhook
            │
            ▼
processIncomingMessage()
            │
            ▼
Clean message object
            │
            ▼
QStash
            │
            ▼
Worker
            │
            ▼
processRules()
            │
            ▼
Find matching Rule
            │
            ▼
handleRuleResponse()
            │
            ▼
sendWhatsAppMessage()
            │
            ▼
Meta WhatsApp Cloud API
            │
            ▼
User receives response
```

The webhook returns quickly after receiving the message and the
rule-processing work is handled separately through QStash.

------------------------------------------------------------------------

# Project Architecture

The project uses a simple separation between the UI, API routes,
database models, and message-processing logic.

``` text
WhatsFlow
│
├── app/
│   ├── api/
│   │   ├── auth/google/
│   │   │           ├──callback/
│   │   │           ├──login/
│   │   ├── client-data/
│   │   ├── clients/
│   │   ├── logout/
│   │   ├── rules/
│   │   ├── webhook/
│   │   ├── whatsapp/
│   │   │           ├──callback/
│   │   │           ├──connect/
│   │   └── worker/handle-logic
│   │
│   ├── dashboard/
│   │   └── ...
│   │
│   ├
│   │   
│   │
│   └── ...
│
├── components/
│   ├── dashboard/
│   ├── rules/
│   ├── settings/
│   └── ui/
│
├── lib/
│   ├── db.js
│   ├── messageProcessor.js
│   ├── processRules.js
│   ├── handleRuleResponse.js
│   └── ruleValidator.js
│
├── model/
│   ├── User.js
│   ├── Client.js
│   ├── Rule.js
│   └── Template.js  // Will compolete this in future
│
├── utils/
│   └── whatsappSender.js
│
├── public/
│   └── ...
│
├── .env
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package.json
└── README.md
```

> The exact folders may change as the project continues to grow. The
> structure above represents the main parts of the current project.

------------------------------------------------------------------------

# Important Folders

## `app/`

Contains the Next.js application pages and API routes.

The UI pages are built using the Next.js App Router.

The `api` directory contains backend endpoints used by the application.

Examples:

``` text
/api/rules
/api/client-data
/api/webhook
/api/worker/handle-logic
```

------------------------------------------------------------------------

## `components/`

Contains reusable React components used by the dashboard.

Examples include:

-   Sidebar
-   Rule modal
-   Dashboard sections
-   Settings UI
-   Automation/rule views

Keeping these components separate makes the pages easier to manage.

------------------------------------------------------------------------

## `lib/`

This folder contains the main application logic.

### `db.js`

Creates the MongoDB connection.

### `messageProcessor.js`

Receives the Meta webhook body and converts it into a smaller object
that the worker can process.

For example:

``` js
{
  from: "...",
  name: "...",
  messageId: "...",
  type: "text",
  text: "hello",
  metadata: {
    clientId: "...",
    timestamp: "..."
  }
}
```

### `processRules.js`

Looks for a rule matching the incoming message.

It currently handles:

-   Text/keyword matching
-   Button replies
-   Interactive list replies
-   Fallback rules

### `handleRuleResponse.js`

Builds the WhatsApp response payload based on the selected rule.

### `ruleValidator.js`

Validates rule data before it is saved.

------------------------------------------------------------------------

# Database Models

The project currently uses MongoDB with Mongoose.

## User

Stores application users.

Example fields:

``` text
_id
email
googleId
isSubscribed
```

------------------------------------------------------------------------

## Client

Stores the WhatsApp business connection information.

Example fields:

``` text
_id
userId
clientId
wabaId
accessToken
whatsappNumber
active
createdAt
```

`clientId` in this project represents the **Meta WhatsApp Phone Number
ID**.

The access token is kept on the server side.

------------------------------------------------------------------------

## Rule

Stores the automation rules.

A rule can contain information such as:

``` text
clientId
ruleName
triggerType
keywords
buttonId
responseType
responseText
buttons
menuItems
mediaUrl
mediaType
active
```

------------------------------------------------------------------------

## Template

Stores WhatsApp template-related information used by the application.
This will be implemented in future

------------------------------------------------------------------------

# WhatsApp Webhook

Meta sends incoming WhatsApp events to the webhook.

The webhook first checks whether the event belongs to a WhatsApp
Business Account.

It then extracts the incoming message and passes it to:

``` js
processIncomingMessage(body)
```

The processor extracts the important information and returns a clean
object.

The important identifier is:

``` js
value.metadata.phone_number_id
```

This is used as the project's `clientId` so the application can identify
which WhatsApp number received the message.

------------------------------------------------------------------------

# Rule Matching

WhatsFlow currently supports multiple types of triggers.

## Keyword

For a text message:

``` text
User:
"price"
```

The system searches active keyword rules and checks whether the incoming
text matches a configured keyword.

------------------------------------------------------------------------

## Button

For a WhatsApp button reply, the button ID is used to find the matching
rule.

``` text
Button ID
   ↓
button_click rule
   ↓
Response
```

------------------------------------------------------------------------

## Interactive List

Interactive list selections are handled through the same incoming
interactive message processing flow.

------------------------------------------------------------------------

## Fallback

If no matching rule is found, WhatsFlow can use an active fallback rule.

Example:

``` text
User:
"Something unexpected"

        ↓

No keyword match

        ↓

Fallback rule

        ↓

"Sorry, I didn't understand that."
```

------------------------------------------------------------------------

# Background Processing with QStash

The webhook should respond quickly to Meta.

Instead of doing all rule processing directly inside the webhook
request, WhatsFlow sends the cleaned message to QStash.

``` text
Meta
 ↓
Webhook
 ↓
QStash
 ↓
Worker
 ↓
Rule Processing
 ↓
WhatsApp Response
```

This keeps the webhook handler lightweight and moves the processing work
to the worker.

------------------------------------------------------------------------

# Sending a WhatsApp Response

After a rule is matched:

``` text
processRules()
      ↓
handleRuleResponse()
      ↓
sendWhatsAppMessage()
      ↓
Meta Graph API
```

The sender builds a request to the WhatsApp Cloud API:

``` text
https://graph.facebook.com/{VERSION}/{PHONE_NUMBER_ID}/messages
```

The Meta access token is sent in the server-side authorization header.

The token should never be exposed in frontend code.

------------------------------------------------------------------------

# Authentication

WhatsFlow uses Google OAuth for login.

The basic flow is:

``` text
User
 ↓
Google Login
 ↓
Google OAuth Callback
 ↓
Verify Google ID Token
 ↓
Find/Create User
 ↓
Create JWT
 ↓
Store JWT in HTTP-only cookie
 ↓
Dashboard
```

The JWT contains the application's user ID.

------------------------------------------------------------------------

# Environment Variables

Create a local environment file:

``` text
.env.local
```

Example:

``` env
MONGODB_URI=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

JWT_SECRET=

NEXT_PUBLIC_SITE_URL=

VERIFY_TOKEN=

QSTASH_TOKEN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

NEXT_PUBLIC_META_APP_ID=
NEXT_PUBLIC_META_CONFIG_ID=
```

Fill in the values for your own development environment.

### Important

Do **not** commit `.env.local` or other files containing real secrets to
GitHub.

Your `.gitignore` should include environment files such as:

``` gitignore
.env
.env.local
.env.production
.env*.local
```

For deployment, add the same environment variables through your hosting
provider's environment-variable settings.

------------------------------------------------------------------------

# Meta WhatsApp Setup

To run the WhatsApp part of the project, you need a Meta developer
application configured for the WhatsApp Cloud API.

You will need:

-   Meta Developer account
-   WhatsApp Business setup
-   WhatsApp test/business phone number
-   Phone Number ID
-   Access token
-   Webhook verification token
-   Webhook URL

The webhook needs to be configured in the Meta Developer dashboard.

Example:

``` text
Webhook URL:
https://YOUR_DOMAIN.com/api/webhook
```

Verification uses the `VERIFY_TOKEN` environment variable.

------------------------------------------------------------------------

# QStash Setup

Create a QStash account and obtain your token.

Add it to:

``` env
QSTASH_TOKEN=
```

The webhook publishes the cleaned message to the worker endpoint.

Your deployed application URL should be configured correctly so QStash
can reach the worker.

------------------------------------------------------------------------

# Cloudinary Setup

Cloudinary is used for storing rule media such as images/PDFs.

Add:

``` env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

The actual Cloudinary credentials should only exist on the server.

------------------------------------------------------------------------

# Running the Project Locally

## 1. Clone the repository

``` bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Then:

``` bash
cd whatsflow
```

------------------------------------------------------------------------

## 2. Install dependencies

``` bash
npm install
```

------------------------------------------------------------------------

## 3. Create environment variables

Create:

``` text
.env.local
```

and add the required values.

------------------------------------------------------------------------

## 4. Start the development server

``` bash
npm run dev
```

The application should be available at:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# Useful Commands

### Start development server

``` bash
npm run dev
```

### Create production build

``` bash
npm run build
```

### Start production server

``` bash
npm start
```

### Run linting

``` bash
npm run lint
```

> Available commands depend on the scripts defined in `package.json`.

------------------------------------------------------------------------

# Testing the Application

A simple testing flow is:

### 1. Login

Open the application and log in using Google.

### 2. Open Dashboard

Check that the WhatsApp client information is available.

### 3. Create an Automation

Create a rule such as:

``` text
Rule Name:
Pricing

Trigger:
Keyword

Keyword:
price

Response:
Our pricing starts from ₹...
```

### 4. Send a WhatsApp Message

Send:

``` text
price
```

to the connected WhatsApp number.

### 5. Check the Response

The message should follow this flow:

``` text
WhatsApp
 ↓
Meta Webhook
 ↓
WhatsFlow
 ↓
QStash
 ↓
Worker
 ↓
Rule
 ↓
WhatsApp Response
```

------------------------------------------------------------------------

# Test Credentials

> Replace these placeholders before publishing the repository if you
> want recruiters to test the application.

``` text
Demo URL:
YOUR_DEMO_URL

Email:
YOUR_TEST_EMAIL

Password:
YOUR_TEST_PASSWORD
```

### WhatsApp Test Number

``` text
Phone Number:
YOUR_TEST_WHATSAPP_NUMBER
```

### Notes

``` text
Meta test environment:
YOUR_INSTRUCTIONS_HERE

Any special setup required:
YOUR_INSTRUCTIONS_HERE
```

**Do not put a real Meta access token, Google client secret, JWT secret,
Cloudinary secret, or other private credential in this README.**

------------------------------------------------------------------------

# Screenshots / Media Folder

A simple structure for project media is:

``` text
docs/
├── images/
│   ├── dashboard.png
│   ├── automations.png
│   ├── create-rule.png
│   └── settings.png
│
└── video/
    └── whatsflow-demo.mp4
```

You can keep your screenshots inside the repository and reference them
from the README:

``` markdown
![Dashboard](./docs/images/dashboard.png)
```

For videos, it is usually better to keep the actual video hosted
separately and put the link in the README rather than committing a large
`.mp4` file to the repository.

------------------------------------------------------------------------

# Project Limitations

This project is currently designed as a practical portfolio project and
has some limitations.

-   The current setup is focused on a single WhatsApp connection per
    user.
-   WhatsApp onboarding is currently configured around the project's
    test/demo setup.
-   A full customer-facing Meta Embedded Signup flow can be added later.
-   Subscription/billing functionality is not the main focus of the
    current version.
-   The automation system is rule-based rather than an AI-powered agent.
-   More advanced analytics and monitoring can be added later.

------------------------------------------------------------------------

# What I Learned From This Project

While building WhatsFlow, I worked with several parts of a real
full-stack application:

-   Building a Next.js application
-   Designing MongoDB/Mongoose models
-   Creating backend API routes
-   Authentication with Google OAuth
-   JWT and HTTP-only cookies
-   Working with third-party APIs
-   Working with Meta webhooks
-   Processing asynchronous jobs
-   Using QStash for background processing
-   Uploading files to Cloudinary
-   Handling API errors
-   Building reusable React components
-   Deploying a full-stack application
-   Managing environment variables and secrets

The project also helped me understand how different parts of a backend
application communicate with each other instead of keeping everything
inside a single API request.

------------------------------------------------------------------------

# Future Improvements

Some features I would like to add in future versions:

-   Meta Embedded Signup for easier customer onboarding
-   Multiple WhatsApp numbers per user
-   Subscription and billing
-   Better analytics
-   Message logs
-   More automation conditions
-   Scheduled broadcasts
-   Improved role-based access
-   More detailed error monitoring
-   AI-powered automation

------------------------------------------------------------------------

# Author

**Vivek Kumar Yadav**

Computer Science Engineering student specializing in AI & ML.

-   GitHub: \[YOUR_GITHUB_PROFILE\]
-   LinkedIn: \[YOUR_LINKEDIN_PROFILE\]
-   Portfolio: \[YOUR_PORTFOLIO_URL\]

------------------------------------------------------------------------

## License

This project is currently available for learning and portfolio purposes.

Add your preferred license here if you decide to open-source the
project.
