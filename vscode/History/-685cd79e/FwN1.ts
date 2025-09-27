import { IProject } from '@/types/project';
import mongoose, { Document } from 'mongoose';
import slugify from 'slugify';

interface IProjectDocument extends IProject, Document {}

const projectSchema = new mongoose.Schema<IProjectDocument>(
  {
    title: { type: String, required: true, text: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    screenshots: [String],
    liveUrl: { type: String, required: true },
    github: String,
    technologies: { type: [String], required: true },
    features: [String],
    keyHighlights: [String],
    impact: String,
    futurePlans: [String],
    launchDate: { type: Date, required: true },
    category: String,
    tags: [String],
    testimonial: {
      quote: { type: String, required: false },
      author: String,
      role: String,
    },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

// Indexes
projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ title: 'text' });

// Slug generation hooks (same pattern as before)...

projectSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    let slug = slugify(this.title, { lower: true });
    const existing = await mongoose.models.Project.findOne({ slug });
    if (existing && existing._id.toString() !== this._id.toString()) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }
    this.slug = slug;
  }
  next();
});

projectSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update && typeof update === 'object' && !Array.isArray(update)) {
    const u = update as mongoose.UpdateQuery<IProjectDocument>;
    if (u.title) {
      let slug = slugify(u.title, { lower: true });
      const existing = await mongoose.models.Project.findOne({
        slug,
        _id: { $ne: this.getQuery()?._id },
      });
      if (existing) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
      u.slug = slug;
      this.setUpdate(u);
    }
  }
  next();
});

const Project = mongoose.models.Project || mongoose.model<IProjectDocument>('Project', projectSchema);
export default Project;
