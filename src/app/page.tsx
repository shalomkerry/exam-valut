import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0c0c10] to-[#1a0f2c] text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <section className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-semibold md:text-4xl">Exam Vault</h1>
          <p className="mt-3 text-3xl font-semibold md:text-4xl">
            A catalog of <span className="text-purple-400">previous</span> year <span className="text-purple-400">exams</span>
          </p>
          <p className="mt-6 text-lg text-white/80 md:text-xl">
            Access hundreds of exam papers which made their way to the internet. Upload exams to increase the catalog.
            Prepare for exams the most efficient way.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-md bg-gray-700 px-5 py-3 text-base font-semibold text-white transition hover:bg-gray-600"
            >
              Browse Exams
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-white px-5 py-3 text-base font-semibold text-black transition hover:bg-gray-100"
            >
              Sign up
            </Link>
          </div>
        </section>

        <section className="mt-14 space-y-12">
          <div className="flex flex-col-reverse items-center gap-5 md:flex-row md:items-center md:gap-8 md:justify-center">
            <div className="max-w-xs text-left text-base leading-6 md:text-lg">
              <p className="text-center">
              Exams Categorized by course, can easily be filtered by type and year
              </p>
            </div>
            <div className="h-40 rounded-md md:h-48">
            <Image
            src="/courses.png"
            width={500}
            height={500}
            alt="Picture"
            />
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 md:flex-row md:items-center md:gap-8 md:justify-center">
            <div className="h-40 rounded-md md:h-48">
            <Image
            src="/copy.png"
            width={400}
            height={400}
            alt="Picture"
            />
            </div>
            <div className="max-w-xs text-left text-base leading-6 md:text-lg">
              <p className="text-center">Text of exams extracted using AI for easy access</p>
            </div>
          </div>

          <div className="flex flex-col-reverse items-center gap-5 md:flex-row md:items-center md:gap-8 md:justify-center">
            <div className="max-w-xs text-left text-base leading-6 md:text-lg">
            <p className="text-center">You can submit exams too! Help build the catalog by uploading your past papers.</p>
            </div>
            <div className="h-40 rounded-md md:h-48">
            <Image
            src="/uploads.png"
            width={400}
            height={400}
            alt="Picture"
            />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Link
              href="/dashboard"
              className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-black transition hover:bg-gray-100"
            >
              Explore Exams
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
