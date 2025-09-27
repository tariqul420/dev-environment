import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";

export default function AddToCard({ courseId }) {
  const [courses, setCourses] = useState();
  const [coursed, setCoursed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedCourse = JSON.parse(localStorage.getItem("edu_course") || "{}");
    setCoursed(!!storedCourse);
  }, []);

  const handelAddToCard = () => {};

  return (
    <Button onClick={handelAddToCard} className="w-full">
      Add to card
    </Button>
  );
}
