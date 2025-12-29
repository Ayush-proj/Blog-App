import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({ name: "John Doe", email: "john@example.com" });
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}   