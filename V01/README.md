# Personal Creator Website

## What’s This For?
A personal site where you can:
- Show your latest YouTube videos
- Share your merch
- Link your social media
- Let people contact you
- Host it for free on GitHub Pages

---

## ✅ Features

| Feature       | What it Does                                     |
|--------------|--------------------------------------------------|
| 🎬 Videos     | Auto-shows your latest YouTube uploads           |
| 👕 Merch      | Embed merch or link to it                        |
| 📱 Social     | Add links to IG, Twitter, TikTok, etc.           |
| 📬 Contact    | Working form using Formspree or EmailJS          |
| 🌐 Hosting    | Free using GitHub Pages                          |

---

## 🧰 Tools Used

| Part       | Tools                        |
|------------|------------------------------|
| Website    | HTML, CSS, JS                |
| Videos     | YouTube Data API v3          |
| Forms      | Formspree / EmailJS          |
| Hosting    | GitHub Pages                 |
| Versioning | Git + GitHub                 |

---

## 🧱 File Setup

```bash
website/
├── index.html
├── style.css
├── script.js
├── /assets
└── README.md
```

---

## Embed Latest YouTube Videos

1. Get API key: Google Cloud → YouTube Data API v3
2. Use this JS:

```js
const apiKey = 'YOUR_API_KEY';
const channelId = 'YOUR_CHANNEL_ID';

fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6`)
  .then(res => res.json())
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
## 👕 Merch Example (Teespring)

You can embed products or just link to your merch store.

Example embed code:

    <iframe src="https://teespring.com/YOUR-PRODUCT-URL?embed=true"
      width="320" height="420" frameborder="0"></iframe>

Other options:
- **Shopify**: Use their “Buy Button” embed code
- **Simple Links**: If embedding isn’t needed

---

## 📬 Contact Form (Formspree)

GitHub Pages can’t handle forms, so use Formspree:

1. Go to [formspree.io](https://formspree.io)
2. Make a form
3. Use this HTML:

    <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
      <input type="text" name="name" placeholder="Your Name" required />
      <input type="email" name="_replyto" placeholder="Your Email" required />
      <textarea name="message" placeholder="Your Message" required></textarea>
      <button type="submit">Send</button>
    </form>

✅ Spam protection included (honeypots, optional reCAPTCHA)

---

## 📱 Social Media Links

Example HTML block:

    <div class="social-links">
      <a href="https://youtube.com/@yourchannel" target="_blank">YouTube</a>
      <a href="https://instagram.com/yourhandle" target="_blank">Instagram</a>
      <a href="https://twitter.com/yourhandle" target="_blank">Twitter</a>
    </div>

Tip: Add icons with [Font Awesome](https://fontawesome.com)

---

## 🚀 Deploy on GitHub Pages

1. Push your code to GitHub:

    git init  
    git add .  
    git commit -m "First commit"  
    git remote add origin https://github.com/yourusername/your-repo.git  
    git push -u origin main

2. On GitHub:
- Go to **Settings → Pages**
- Set source to `main` and `/ (root)`
- Site will be live at:  
  `https://yourusername.github.io/your-repo/`

---

## 🌐 Custom Domain (Optional)

1. Buy a domain (e.g., Namecheap)
2. Add a `CNAME` file in your repo with:

    yourdomain.com

3. In your domain’s DNS:
- Point **www** to `yourusername.github.io`
- Or use A records for root domain

4. Enable HTTPS in GitHub Pages settings

---

## Extra Ideas

- Blog or news section  


