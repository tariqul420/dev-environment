import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";

export default function AddToCard({ courseId }) {
  const [courses, setCourses] = useState();
  const [coursed, setCoursed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedCourses = JSON.parse(
      localStorage.getItem("edu_course") || "{}",
    );
    setCoursed(!!storedCourses[courseId]);
  }, [courseId]);

  const handelSetCourse = () => {
    const storedCourses = JSON.parse(
      localStorage.getItem("edu_course") || "{}",
    );

    if (storedCourses[courseId]) {
    }
  };

  return (
    <Button onClick={handelSetCourse} className="w-full">
      Add to card
    </Button>
  );
}
