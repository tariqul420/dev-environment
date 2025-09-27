import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";

import { cn } from "@/lib/utils";

export default function AddToCard({ courseId, course, user }) {
  const [courses, setCourses] = useState();
  const [coursed, setCoursed] = useState(false);
  const pathname = usePathname();

  const alreadyPayment = course?.students?.includes(user?.userId);

  const notStudent = !(user?.role === "student");

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

    if (alreadyPayment) {
      toast.error("You already purchase this course.");
      return;
    } else if (storedCourses[courseId]) {
      setCourses((prev) => prev - 1);
      delete storedCourses[courseId];
      setCoursed(false);
    } else {
      setCourses((prev) => prev - 1);
      storedCourses[courseId] = true;
      setCoursed(true);
    }

    localStorage.setItem("edu_course", JSON.stringify(storedCourses));
  };

  return (
    <Button
      onClick={handelSetCourse}
      variant={notStudent ? "secondary" : "outline"}
      disabled={notStudent}
      className={cn(
        notStudent
          ? "dark:bg-dark-hover mt-5 inline-block cursor-not-allowed rounded bg-gray-400 px-4 py-1.5 text-white transition-colors"
          : "bg-main hover:bg-main mt-5 inline-block cursor-pointer rounded px-4 py-1.5 text-white transition-colors",
      )}
    >
      Add to card
    </Button>
  );
}
