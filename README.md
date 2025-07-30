# 🎥 Personal Creator Website – Project Plan

## 📌 Overview

This project is a personal website for a content creator. It serves as a central hub to:

- Showcase YouTube videos (automatically updated via YouTube Data API)
- Display links or embedded merchandise from an external store
- Provide social media links
- Include a working contact form using a static-site-friendly service
- Be hosted on **GitHub Pages** for free and easy deployment

---

## ✅ Core Features

| Feature                | Description                                                                 |
|----------------------- |-----------------------------------------------------------------------------|
| 🎬 YouTube Embed       | Fetch and embed latest uploads automatically from your channel              |
| 👕 Merchandise         | Show off merch via links or embed widgets (e.g., Teespring, Shopify)        |
| 📱 Social Media Links  | Easy access to your Instagram, Twitter, TikTok, etc.                        |
| 📬 Contact Form        | Static-site compatible form using Formspree or EmailJS                      |
| 🌐 Free Hosting        | Deployed on GitHub Pages with optional custom domain                        |

---

## 🧰 Tech Stack

| Layer       | Tools                            |
|-------------|----------------------------------|
| Frontend    | HTML, CSS, JavaScript            |
| API         | YouTube Data API v3              |
| Form        | Formspree or EmailJS             |
| Hosting     | GitHub Pages                     |
| Versioning  | Git + GitHub                     |

---

## 🧱 Project Structure

```
personal-website/
│
├── index.html           # Main HTML file
├── style.css            # Custom styling
├── script.js            # YouTube API + interactivity
├── /assets              # Images, icons, etc.
│
└── README.md            # Project documentation (this file)
```

---

## 🎬 YouTube Video Integration

### 🔗 API Used:
[YouTube Data API v3](https://developers.google.com/youtube/v3)

### 🛠 Setup Instructions:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project and enable **YouTube Data API v3**
3. Generate an **API key**
4. Use JavaScript to fetch latest uploads and embed them dynamically:

### ✅ Example JavaScript Snippet:

```javascript
const apiKey = 'YOUR_API_KEY';
const channelId = 'YOUR_CHANNEL_ID';
const maxResults = 6;

fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`)
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('videos');
    data.items.forEach(item => {
      if (item.id.kind === 'youtube#video') {
        container.innerHTML += `
          <iframe width="300" height="180"
            src="https://www.youtube.com/embed/${item.id.videoId}"
            frameborder="0" allowfullscreen></iframe>`;
      }
    });
  });
```

---

## 👕 Merchandise Integration

### Options:
- **Teespring/Spring**: Use their embed iframe
- **Shopify**: Use "Buy Button" embed code
- **Simple external links** if you don’t need embedding

### 🔧 Example Embed:

```html
<iframe src="https://teespring.com/YOUR-PRODUCT-URL?embed=true"
  width="320" height="420" frameborder="0" scrolling="no"></iframe>
```

---

## 📬 Contact Form Setup

Since GitHub Pages is static-only, use a third-party service.

### ✉️ Option: Formspree

1. Sign up at [https://formspree.io](https://formspree.io)
2. Create a new form
3. Use the provided form action in your HTML:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="text" name="name" placeholder="Your Name" required />
  <input type="email" name="_replyto" placeholder="Your Email" required />
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send</button>
</form>
```

> 🛡️ Formspree automatically protects against spam with honeypots and reCAPTCHA (optional).

---

## 📱 Social Media Links

### Example HTML Block:

```html
<div class="social-links">
  <a href="https://youtube.com/@yourchannel" target="_blank">YouTube</a>
  <a href="https://instagram.com/yourhandle" target="_blank">Instagram</a>
  <a href="https://twitter.com/yourhandle" target="_blank">Twitter</a>
</div>
```

You can enhance this using icons from Font Awesome or inline SVGs.

---

## 🚀 Deployment: GitHub Pages

### 🔧 Steps:

1. Push your project to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

2. On GitHub:
   - Go to your repository
   - Click **Settings** → **Pages**
   - Under **Source**, select `main` branch and `/ (root)`
   - Your website will be live at:  
     `https://yourusername.github.io/your-repo-name/`

---

## 🌐 Optional: Custom Domain

You can connect a custom domain (e.g., `yourname.com`):

1. Purchase a domain from a provider (Namecheap, Google Domains, etc.)
2. In your repo, create a `CNAME` file:
   ```
   yourdomain.com
   ```
3. Update your domain's DNS records:
   - Add a CNAME pointing `www` to `yourusername.github.io`
   - Or use A records if configuring root domain

4. Enable HTTPS in GitHub Pages settings

---

## 🧩 Future Ideas

- Add a blog section or news feed
- Add analytics (e.g., Google Analytics or Plausible)
- Create a dark mode toggle
- Add a newsletter sign-up (via Mailchimp or Buttondown)
- Add animations with libraries like AOS.js or GSAP

---

## ✍️ Credits

Built and maintained by **[Your Name]**

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
