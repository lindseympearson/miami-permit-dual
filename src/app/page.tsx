import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-8">Miami Permit Wizard</h1>
        <Link href="/wizard" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl">
          Start Your Permit →
        </Link>
      </div>
    </div>
  );
}
