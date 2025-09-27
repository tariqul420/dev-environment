# ImageUploaderField - Selectable Images Feature

## Usage Example

The `ImageUploaderField` component now supports a `selectableImages` prop where you can provide an array of image URLs that users can select from.

```tsx
import ImageUploaderField from '@/components/global/form-field/image-uploader-field';

function MyForm() {
  // Array of predefined image URLs
  const availableImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
    'https://example.com/image4.jpg',
  ];

  return (
    <Form>
      {/* Single image selection */}
      <ImageUploaderField
        name="profileImage"
        label="Profile Image"
        selectableImages={availableImages}
      />

      {/* Multiple image selection */}
      <ImageUploaderField
        name="galleryImages"
        label="Gallery Images"
        multiple
        selectableImages={availableImages}
      />
    </Form>
  );
}
```

## Features

1. **Select Images Button**: When `selectableImages` is provided, a "Select Images" button appears
2. **Image Grid**: Users can browse and select from predefined images
3. **Visual Feedback**: Selected images are highlighted with a checkmark
4. **Multiple Selection**: Works with both single and multiple selection modes
5. **Drag & Drop**: Selected images can still be reordered using drag and drop
6. **Upload & Select**: Users can both upload new images and select from predefined ones

## Props

```tsx
type Props = {
  name: string;
  label: string;
  multiple?: boolean;
  className?: string;
  viewClass?: string;
  selectableImages?: string[]; // NEW: Array of image URLs to select from
};
```

## Behavior

- **Empty State**: Shows both "Upload" and "Select Images" buttons
- **With Files**: Shows "Add more/Replace", "Select Images", and existing files
- **Selection**: Clicking on selectable images adds/removes them from the form
- **Integration**: Selected images are treated the same as uploaded images in the form state