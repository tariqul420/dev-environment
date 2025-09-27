import { IBlog } from '@/types/blog';
import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    slug: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

// Add indexes
blogSchema.index({ slug: 1 }, { unique: true }); // For slug lookups
blogSchema.index({ createdAt: -1 }); // For sorting by date
blogSchema.index({ title: 'text' }); // For text search

// Pre-save hook to generate slug for new documents or when title is modified
blogSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    // Translate title to English before creating slug
    const englishTitle = await this.title;
    let slug = slugify(englishTitle, { lower: true });
    const existingBlog = await mongoose.models.Blog.findOne({ slug });

    if (existingBlog) {
      const uniqueSuffix = Date.now().toString(36);
      slug = `${slug}-${uniqueSuffix}`;
    }

    this.slug = slug;
  }
  next();
});

// Pre-update hook to update slug when title is modified during updates
blogSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as { title?: string; slug?: string };
  if (update.title) {
    // Translate title to English before creating slug
    const englishTitle = await update.title;
    let slug = slugify(englishTitle, { lower: true });
    const existingBlog = await mongoose.models.Blog.findOne({
      slug,
      _id: { $ne: this.getQuery()._id }, // Exclude the current document
    });

    if (existingBlog) {
      const uniqueSuffix = Date.now().toString(36);
      slug = `${slug}-${uniqueSuffix}`;
    }

    update.slug = slug;
  }
  next();
});

const Blog = mongoose.models?.Blog || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;
