import { IProject } from '@/types/project';
import mongoose from 'mongoose';
import slugify from 'slugify';

const projectSchema = new mongoose.Schema<IProject>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    liveUrl: { type: String, required: true },
    github: { type: String },
    technologies: { type: [String], required: true },
    features: { type: [String], default: [] },
    keyHighlights: { type: [String], default: [] },
    launchDate: { type: Date, required: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    tags: { type: [String], default: [] },
    impact: { type: String },
    futurePlans: { type: [String], default: [] },
    slug: {
      type: String,
      trim: true,
    },
    screenshots: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Indexes
projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });

// Pre-save: slug generator
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

// Pre-update: slug updater
projectSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as Partial<IProject>;

  if (update?.title) {
    let slug = slugify(update.title, { lower: true });

    const existing = await mongoose.models.Project.findOne({
      slug,
      _id: { $ne: this.getQuery()?._id },
    });

    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    update.slug = slug;
    this.setUpdate(update);
  }

  next();
});

// Export model
const ProjectModel = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);

export default ProjectModel;
