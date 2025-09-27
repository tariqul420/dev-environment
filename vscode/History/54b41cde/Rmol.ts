import { IProduct } from "@/types/product";
import mongoose from "mongoose";
import slugify from "slugify";

// Define the Product schema
const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    titleBengali: {
      type: String,
      required: [true, "Bengali title is required"],
      trim: true,
    },
    shortDesc: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },
    imageUrls: {
      type: [String],
      required: [true, "At least one image URL is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    regularPrice: {
      type: Number,
      required: [true, "Regular price is required"],
      min: [0, "Regular price cannot be negative"],
    },
    salePrice: {
      type: Number,
      required: [true, "Sale price is required"],
      min: [0, "Sale price cannot be negative"],
    },
    detailedDesc: {
      type: String,
      required: [true, "Detailed description is required"],
    },
    tag: {
      type: String,
    },
    packageDuration: {
      type: String,
      trim: true,
    },
    weight: {
      type: String,
      required: [true, "Weight is required"],
    },
    categoryIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      required: [true, "Category is required"],
    },
  },
  { timestamps: true },
);

// Add indexes
productSchema.index({ slug: 1 }, { unique: true }); // For slug lookups
productSchema.index({ categoryId: 1 }); // For category filtering
productSchema.index({ createdAt: -1 }); // For sorting by date
productSchema.index({ salePrice: 1 }); // For price sorting
productSchema.index({
  title: "text",
  titleBengali: "text",
  shortDescription: "text",
}); // For text search
productSchema.index({ tags: 1 }); // For tag filtering

// Pre-save hook to generate slug for new documents or when title/titleBengali is modified
productSchema.pre("save", async function (next) {
  if (this.isModified("title") || this.isModified("titleBengali")) {
    const nameToSlug = this.title || this.titleBengali;
    let slug = slugify(nameToSlug, { lower: true, strict: true });

    const existingProduct = await mongoose.models.Product.findOne({ slug });
    if (existingProduct) {
      const uniqueSuffix = Date.now().toString(36);
      slug = `${slug}-${uniqueSuffix}`;
    }

    this.slug = slug;
  }
  next();
});

// Pre-update hook to update slug when title or titleBengali is modified during updates
productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as {
    title?: string;
    titleBengali?: string;
    slug?: string;
  };

  if (update.title !== undefined || update.titleBengali !== undefined) {
    const currentProduct = await mongoose.models.Product.findOne(
      this.getQuery(),
    );
    const nameToSlug =
      update.title ||
      update.titleBengali ||
      currentProduct?.title ||
      currentProduct?.titleBengali ||
      "";
    let slug = slugify(nameToSlug, { lower: true, strict: true });

    const existingProduct = await mongoose.models.Product.findOne({
      slug,
      _id: { $ne: this.getQuery()._id },
    });

    if (existingProduct) {
      const uniqueSuffix = Date.now().toString(36);
      slug = `${slug}-${uniqueSuffix}`;
    }

    update.slug = slug;
  }
  next();
});

const Product =
  mongoose.models?.Product ||
  mongoose.model<IProduct>("Product", productSchema);

export default Product;
