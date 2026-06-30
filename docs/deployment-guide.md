# WealthSeva AI — AWS Deployment Guide (Beginner-Friendly)

## What We'll Do
Deploy your app on AWS so judges can access it via a public URL like `http://3.110.45.67` (or a custom domain).

## AWS Services Used

| Service | What it does | Why we use it |
|---------|-------------|---------------|
| **EC2** | A virtual server (computer) in the cloud | Runs your Node.js backend + serves the React app |
| **Security Group** | A firewall for your EC2 | Controls who can access your app (open port 80 for public) |
| **Bedrock** | AI service (Claude) | Already configured — Seva's brain |
| **IAM** | User/permission management | Already configured — your AWS credentials |

## Cost Estimate
- EC2 t3.small: ~₹500/month (or free if you have Free Tier)
- Bedrock: Pay per API call (~₹0.5 per chat message)
- Total for hackathon demo: < ₹1,000

---

## Step-by-Step Deployment

### Step 1: Launch an EC2 Instance

1. Go to **AWS Console** → **EC2** → **Launch Instance**
2. Configure:
   - **Name**: `WealthSeva-AI`
   - **OS**: Ubuntu Server 24.04 LTS (Free tier eligible)
   - **Instance type**: `t3.small` (2 vCPU, 2GB RAM — enough for demo)
   - **Key pair**: Create new → name it `wealthseva-key` → Download the `.pem` file (KEEP THIS SAFE!)
   - **Network settings**: 
     - Allow SSH (port 22) — so you can connect
     - Allow HTTP (port 80) — so judges can access
     - Allow Custom TCP port 3001 — backup if port 80 doesn't work
   - **Storage**: 20 GB (default is fine)
3. Click **Launch Instance**
4. Wait 1-2 minutes for it to start

### Step 2: Connect to Your EC2

**From Windows (using PowerShell or CMD):**

```bash
ssh -i "C:\path\to\wealthseva-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
```

Replace `YOUR_EC2_PUBLIC_IP` with the IP shown in EC2 console (e.g., `3.110.45.67`).

**If you get a permission error on Windows:**
- Right-click the .pem file → Properties → Security → Advanced
- Remove all users except your own
- Or use PuTTY (convert .pem to .ppk using PuTTYgen)

### Step 3: Install Node.js on EC2

Once connected via SSH, run these commands one by one:

```bash
# Update the system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x

# Install pm2 (keeps your app running forever)
sudo npm install -g pm2

# Install git (to clone your code)
sudo apt install -y git
```

### Step 4: Upload Your Code to EC2

**Option A — Using Git (recommended):**

If your code is on GitHub:
```bash
cd ~
git clone https://github.com/YOUR_USERNAME/IDBI_Innovate.git
cd IDBI_Innovate
```

**Option B — Using SCP (direct file copy from your PC):**

From your local Windows terminal:
```bash
scp -i "C:\path\to\wealthseva-key.pem" -r "C:\IDBI_Innovate2026\IDBI_Innovate" ubuntu@YOUR_EC2_IP:~/
```

### Step 5: Install Dependencies & Build

On the EC2 server:

```bash
cd ~/IDBI_Innovate

# Install backend dependencies
cd server
npm install

# Install frontend dependencies and build
cd ../client
npm install
npm run build

# Verify build was created
ls dist/   # Should show index.html, assets/ folder
```

### Step 6: Configure Environment Variables

```bash
cd ~/IDBI_Innovate/server

# Edit the .env file
nano .env
```

Set these values (use your actual AWS credentials):
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-actual-key
AWS_SECRET_ACCESS_KEY=your-actual-secret
BEDROCK_MODEL_ID=us.anthropic.claude-3-5-sonnet-20241022-v2:0
PORT=80
JWT_SECRET=wealthseva-hackathon-2026
CLIENT_URL=http://YOUR_EC2_PUBLIC_IP
```

Save: `Ctrl+O` → Enter → `Ctrl+X`

**Important:** Change `PORT=80` so the app runs on the default HTTP port (no `:3001` needed in URL).

### Step 7: Start the App with pm2

```bash
cd ~/IDBI_Innovate/server

# Start with pm2 (needs sudo for port 80)
sudo pm2 start index.js --name wealthseva

# Check it's running
sudo pm2 status

# View logs (to debug if needed)
sudo pm2 logs wealthseva

# Make pm2 restart on server reboot
sudo pm2 startup
sudo pm2 save
```

### Step 8: Test It!

Open your browser and go to:
```
http://YOUR_EC2_PUBLIC_IP
```

You should see the WealthSeva AI login page!

---

## Troubleshooting

### "Connection refused" when accessing the URL
```bash
# Check if app is running
sudo pm2 status

# Check if port 80 is listening
sudo netstat -tlnp | grep 80

# Restart if needed
sudo pm2 restart wealthseva
```

### "502 Bad Gateway" or app not loading
```bash
# Check logs for errors
sudo pm2 logs wealthseva --lines 20

# Most common: .env file has wrong values
nano ~/IDBI_Innovate/server/.env
```

### Security Group issue (can't access from browser)
- Go to EC2 Console → your instance → Security → Security Groups
- Edit inbound rules → Add rule: HTTP (port 80) from 0.0.0.0/0

### Bedrock errors in chat
- Make sure your IAM user has `AmazonBedrockFullAccess` policy
- Make sure you've enabled Claude model access in Bedrock console

---

## Sharing with Judges

Your public URL will be:
```
http://YOUR_EC2_PUBLIC_IP
```

Example: `http://3.110.45.67`

**Tips:**
- This URL works from anywhere — judges just open it in their browser
- Data persists as long as the server runs (pm2 keeps it alive)
- If you want a nicer URL, you can buy a domain and point it to this IP

---

## Commands Cheat Sheet

| Action | Command |
|--------|---------|
| View app status | `sudo pm2 status` |
| View logs | `sudo pm2 logs wealthseva` |
| Restart app | `sudo pm2 restart wealthseva` |
| Stop app | `sudo pm2 stop wealthseva` |
| Update code & restart | `cd ~/IDBI_Innovate && git pull && cd client && npm run build && cd ../server && sudo pm2 restart wealthseva` |
| Check which port is running | `sudo netstat -tlnp | grep LISTEN` |

---

## Architecture on AWS (What Judges See)

```
User's Browser
     |
     | HTTP (port 80)
     ↓
┌─────────────────────────┐
│  EC2 Instance (t3.small) │
│  Ubuntu + Node.js + pm2  │
│                           │
│  Express Server           │
│  ├─ Serves React app     │
│  ├─ /api/chat → Bedrock  │
│  ├─ /api/data → Mock DB  │
│  └─ /api/avatar → Polly  │
└─────────────┬─────────────┘
              |
              | AWS SDK calls
              ↓
┌─────────────────────────┐
│  AWS Bedrock (Claude)    │  ← AI brain
│  Amazon Polly (TTS)      │  ← Voice (optional)
└─────────────────────────┘
```

This is simple, effective, and demonstrates the concept perfectly for a hackathon.
