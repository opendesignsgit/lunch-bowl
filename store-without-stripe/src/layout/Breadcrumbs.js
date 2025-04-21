import React from 'react';
import Link from "next/link";
import { useRouter } from "next/router";

const Breadcrumbs = () => {
    const router = useRouter();
    const pathnames = router.asPath.split("/").filter((x) => x);
  return ( <nav className="breadcrumbs" aria-label="Breadcrumb">
    <ol className="list-reset flex text-gray-600">
      <li>
        <Link href="/" className="text-blue-600 hover:underline">
          Home
        </Link>
      </li>
      {pathnames.map((segment, index) => {
        const href = "/" + pathnames.slice(0, index + 1).join("/");
        const label = decodeURIComponent(segment.replace(/-/g, " "));

        const isLast = index === pathnames.length - 1;

        return (
          <li key={index} className="flex items-center">
            <span className="mx-2 nolink"> - </span>
            {isLast ? (
              <span className="nolink capitalize">{label}</span>
            ) : (
              <Link href={href} className="text-blue-600 hover:underline capitalize">
                {label}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
  )
}

export default Breadcrumbs