export interface ICategory {
  name: string;
  slug: string;
}

interface ICategory extends Document {
  _id: Types.ObjectId;
  slug: string;
}
