interface Props {
  value: { url: string }[];
  onChange: (newValue: { url: string }[]) => void;
  multiple?: boolean;
}

export default function ImageUploader() {
  return <div>image-uploader</div>;
}
