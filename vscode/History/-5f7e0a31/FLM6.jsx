import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "../ui/button";

export default function AddToCard({ courseId }) {
  const [courses, setCourses] = useState();
  const [course, setCourse] = useState(false);
  const pathname = usePathname();

  const handelAddToCard = () => {};

  return (
    <Button onClick={handelAddToCard} className="w-full">
      Add to card
    </Button>
  );
}
