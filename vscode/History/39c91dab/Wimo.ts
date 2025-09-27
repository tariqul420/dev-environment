import { ICategory } from '@/types/category';
import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

// Add indexes
categorySchema.index({ name: 1 }, { unique: true }); // For name lookups
categorySchema.index({ slug: 1 }, { unique: true }); // For slug lookups
categorySchema.index({ createdAt: -1 }); // For sorting by date

// Pre-save hook to generate slug for new documents or when name is modified
categorySchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    let slug = slugify(this.name, { lower: true });
    const existingCategory = await mongoose.models.Category.findOne({ slug });

    if (existingCategory) {
      const uniqueSuffix = Date.now().toString(36);
      slug = `${slug}-${uniqueSuffix}`;
    }

    this.slug = slug;
  }
  next();
});

// Pre-update hook to update slug when name is modified during updates
categorySchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as { name?: string; slug?: string };
  if (update.name) {
    let slug = slugify(update.name, { lower: true });
    const existingCategory = await mongoose.models.Category.findOne({
      slug,
      _id: { $ne: this.getQuery()._id }, // Exclude the current document
    });

    if (existingCategory) {
      const uniqueSuffix = Date.now().toString(36);
      slug = `${slug}-${uniqueSuffix}`;
    }

    update.slug = slug;
  }
  next();
});

const Category = mongoose.models?.Category || mongoose.model<ICategory>('Category', categorySchema);

export default Category;
