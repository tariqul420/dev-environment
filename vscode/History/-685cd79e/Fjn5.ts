import { IProject } from '@/types/project';
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema<IProject>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['frontend', 'backend', 'fullstack', 'other'],
      default: 'fullstack',
    },
    projectCategory: {
      type: String,
      required: true,
    },
    launchDate: {
      type: Date,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    projectType: {
      type: [String],
      required: true,
    },
    platforms: {
      type: [String],
      required: true,
    },
    technologies: {
      type: [String],
      required: true,
    },
    challenges: {
      type: [String],
      required: true,
    },
    futurePlans: {
      type: [String],
      required: true,
    },
    live: {
      type: String,
      required: true,
    },
    github: {
      type: String,
    },
    details: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    achievements: {
      type: [String],
      required: true,
    },
    keyHighlights: {
      type: [String],
      required: true,
    },
    developmentTime: {
      type: String,
      required: true,
    },
    teamSize: {
      type: Number,
      required: true,
    },
    impact: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Add indexes
blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ title: 'text' });

// Pre-save hook to generate slug for new documents or when title is modified
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

// Pre-update hook to update slug when title is modified during updates
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

// Prevent model overwrite by checking if the model exists
const Project = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);

export default Project;
