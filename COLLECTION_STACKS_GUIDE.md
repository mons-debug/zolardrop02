# Collection Stacks - Control Your Homepage Collections

## 🎯 What This Feature Does

This feature lets you **control the images** in your three main homepage collections (ESSENCE, FRAGMENT, and RECODE) directly from the admin dashboard. Upload and manage the 4-card stacks that customers see when they visit your site!

---

## 📍 Where to Find It

### Admin Dashboard
1. Go to: `http://localhost:3000/admin`
2. Click **"Collection Stacks"** in the left sidebar
3. You'll see three collection cards: ESSENCE, FRAGMENT, and RECODE

### Homepage Display
- Your collections appear in the main "Three Collections" section
- Each collection has a beautiful 4-card stack that visitors can click/swipe
- The images you upload control what appears in these stacks

---

## 🚀 How to Use

### Setting Up ESSENCE Collection

1. **Navigate to Collection Stacks** in admin sidebar
2. Click **"Setup Collection"** on the ESSENCE card
3. **Upload 4 Images**:
   - Click "Upload Image" button
   - Select image from your computer
   - Repeat 4 times for best stack effect
   - Images stack in the order you upload them

4. **Configure Details**:
   - **Title**: "ESSENCE" (or customize)
   - **Description**: Shown on homepage below collection name
   - **Link URL**: Where customers go when clicking "See Collection"
   - **Status**: Active (shows on site) or Inactive (hidden)

5. Click **"Save Collection"**

6. **View on Homepage** - Refresh your homepage to see the changes!

### Setting Up FRAGMENT Collection

Repeat the same steps above for FRAGMENT:
- Upload 4 images for the stack
- Set description and link URL
- Save and view on homepage

### Setting Up RECODE Collection

Same process for RECODE:
- Upload 4 images
- Configure title, description, link
- Set status and save

---

## 🎨 Image Guidelines

### Recommended Specs
- **Size**: 800x1200px (3:4 aspect ratio)
- **Format**: JPG, PNG, WebP, or GIF
- **Max File Size**: 10MB per image
- **Quantity**: 4 images per collection for best effect

### Visual Tips
- Use high-quality product photos
- Maintain consistent lighting and style
- Mix different angles or products
- Ensure good color coordination
- First image = top of stack (most visible)

---

## ✏️ Managing Your Collections

### Editing a Collection

1. Go to **Admin > Collection Stacks**
2. Click **"Edit Collection"** on any collection card
3. Make your changes:
   - Add/remove images
   - Reorder images using left/right arrows
   - Update text or links
4. Click **"Save Collection"**

### Reordering Images in Stack

- Hover over any image in the edit modal
- Click **left arrow** to move image earlier in stack
- Click **right arrow** to move image later in stack
- Click **trash icon** to remove image
- The first image appears on top of the stack

### Temporarily Hiding a Collection

1. Open collection in edit mode
2. Change **Status** to "Inactive"
3. Save changes
4. Collection won't show on homepage
5. Set back to "Active" when ready

---

## 🎯 Collection Structure

### ESSENCE Collection
- **Theme**: Simple, clean, everyday essentials
- **Default Description**: "Simple. Clean. Easy to wear. Everyday essentials built for your rhythm."
- **Default Link**: `/products?collection=essence`

### FRAGMENT Collection
- **Theme**: Bold graphics, confident style
- **Default Description**: "Bold without trying. Shattered graphics for a confident, effortless look."
- **Default Link**: `/products?collection=fragment`

### RECODE Collection
- **Theme**: Coming soon, next evolution
- **Default Description**: "Coming Soon. The next evolution of style."
- **Default Link**: `/products?collection=recode`

---

## 💡 Best Practices

### Content Strategy
- **Update seasonally** - Refresh images for new collections
- **Feature bestsellers** - Show your most popular items
- **Tell a story** - Each stack should convey the collection's vibe
- **Test on mobile** - Ensure stacks look good on all devices

### Image Composition
- **Product diversity**: Mix different products within each stack
- **Lifestyle shots**: Include styled/worn product images
- **Detail shots**: Show fabric textures and quality
- **Action shots**: Models wearing or using products

### Performance
- **Optimize images** before upload (use TinyPNG, etc.)
- **Use WebP format** when possible for faster loading
- **Check file sizes** - Keep under 500KB per image ideally
- **Test load times** after updating

---

## 🔧 Technical Details

### Database Model
```prisma
model CollectionStack {
  id             String   @id @default(uuid())
  collectionName String   @unique // ESSENCE, FRAGMENT, RECODE
  title          String   
  description    String?  
  images         String   // JSON array of image URLs
  linkUrl        String?  
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

### API Endpoints
- `GET /api/collection-stacks` - Fetch all collections
- `POST /api/collection-stacks` - Create new collection
- `PUT /api/collection-stacks/[id]` - Update collection
- `DELETE /api/collection-stacks/[id]` - Delete collection

### Homepage Integration
The homepage automatically fetches and displays:
- Images from ESSENCE collection in first stack
- Images from FRAGMENT collection in second stack
- Images from RECODE collection in third stack

---

## 🐛 Troubleshooting

### Images Not Showing on Homepage
✅ **Check**: Is the collection status set to "Active"?  
✅ **Check**: Have you uploaded at least 1 image?  
✅ **Check**: Refresh the homepage (clear browser cache if needed)  
✅ **Check**: Are image URLs accessible?

### Upload Failing
✅ **Check**: Is file under 10MB?  
✅ **Check**: Is it a valid image format (JPG, PNG, WebP, GIF)?  
✅ **Check**: Is BLOB_READ_WRITE_TOKEN set in environment variables?

### Stack Looks Different on Mobile
✅ **Solution**: Test with 800x1200px images (3:4 ratio)  
✅ **Solution**: Use portrait-oriented images  
✅ **Solution**: Avoid wide landscape images

### Changes Not Appearing
✅ **Solution**: Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)  
✅ **Solution**: Clear browser cache  
✅ **Solution**: Check browser console for errors

---

## 📊 Example Workflow

### Initial Setup (New Site)

1. **Week 1: ESSENCE**
   - Upload 4 hero product images
   - Set description highlighting simplicity
   - Link to essence products page
   - Set to Active

2. **Week 2: FRAGMENT**
   - Upload 4 bold graphic images
   - Write compelling description
   - Link to fragment collection
   - Activate on site

3. **Week 3: RECODE**
   - Upload teaser/coming soon images
   - Keep status as Inactive for now
   - Plan launch date

### Monthly Updates

- **Review analytics** - Which collection gets most clicks?
- **Rotate images** - Keep content fresh
- **Test variations** - Try different image orders
- **Seasonal updates** - Match current promotions

### Pre-Launch Checklist

Before activating a new collection:
- [ ] 4 high-quality images uploaded
- [ ] Images optimized for web
- [ ] Description written and proofread
- [ ] Link URL tested and working
- [ ] Previewed on mobile and desktop
- [ ] Status set to Active
- [ ] Homepage checked after saving

---

## 🎊 Tips for Success

### Photography
- Use professional product photography when possible
- Maintain consistent lighting across images
- Show products from flattering angles
- Include lifestyle context when appropriate

### Copywriting
- Keep descriptions concise (1-2 sentences)
- Use active, energetic language
- Highlight unique collection features
- Match brand voice and tone

### Timing
- Update collections before major sales
- Refresh seasonally (4x per year minimum)
- Preview changes before publishing
- Schedule updates during low-traffic times

---

## 🆘 Need Help?

### Quick Checks
1. Is the admin logged in and authenticated?
2. Are environment variables properly configured?
3. Has the database migration been applied?
4. Is the internet connection stable?

### Common Questions

**Q: Can I have more than 4 images?**  
A: Yes! Upload as many as you want. The stack will show all of them.

**Q: Can I change the collection names?**  
A: The collection identifiers (ESSENCE, FRAGMENT, RECODE) are fixed, but you can customize the display title.

**Q: Will old product images still work?**  
A: Yes! This system is separate from your product database. You're just controlling the homepage display.

**Q: Can I add a 4th collection?**  
A: Currently supports the three main collections. Contact developer to add more.

---

**Enjoy managing your homepage collections! 🎨✨**
