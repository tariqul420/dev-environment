import { translateToEnglish } from '@/lib/translator';
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
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    coverImage: {
      type: String,
    },
    categories: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    readTime: {
      type: Number,
      default: 5,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String,
    },
  },
  { timestamps: true },
);

// Indexes
blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ title: 'text', description: 'text', content: 'text' });

// Slug generator on save
blogSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    const englishTitle = await translateToEnglish(this.title);
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

// Slug generator on update
blogSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as { title?: string; slug?: string };
  if (update.title) {
    const englishTitle = await translateToEnglish(update.title);
    let slug = slugify(englishTitle, { lower: true });
    const existingBlog = await mongoose.models.Blog.findOne({
      slug,
      _id: { $ne: this.getQuery()._id },
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
