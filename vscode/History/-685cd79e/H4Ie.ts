import { IProject } from '@/types/project';
import mongoose from 'mongoose';
import slugify from 'slugify';

const projectSchema = new mongoose.Schema<IProject>(
  {
    order: Number,
    title: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    images: { type: [String], required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    projectType: { type: String, required: true },
    launchDate: { type: Date, required: true },
    author: { type: String, required: true },
    platforms: { type: [String], required: true },
    technologies: { type: [String], required: true },
    challenges: { type: [String], required: true },
    futurePlans: { type: [String] }, // ✅ Optional in Schema
    liveUrl: { type: String, required: true },
    github: String, // ✅ Optional in Schema
    details: { type: String, required: true },
    features: { type: [String], required: true },
    achievements: { type: [String], required: true },
    keyHighlights: { type: [String], required: true },
    developmentTime: { type: String, required: true },
    teamSize: { type: Number, required: true },
    impact: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

// Indexes
projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ title: 'text' });

// Slug generation on save
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

// Slug update on update
projectSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

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

const Project = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);
export default Project;
