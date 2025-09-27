"use client";

import Image from "next/image";
import ReactPlayer from "react-player";

export default function CourseVideo({ course }) {
  const { thumbnail, firstVideo, title } = course;
  return (
    <>
      {firstVideo.videoUrl ? (
        <ReactPlayer
          url={firstVideo?.videoUrl}
          width="100%"
          height="400px"
          controls
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
              },
            },
          }}
        />
      ) : (
        <Image
          src={thumbnail}
          alt={title}
          width={600}
          height={500}
          className="h-[400px] w-full rounded object-cover"
        />
      )}
    </>
  );
}
