import VapiControls from "@/components/VapiControls";
import { getBookBySlug } from "@/lib/actions/book.actions";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, MicOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const BookPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book.success || !("data" in book) || !book.data) redirect("/");

  const { title, author, coverURL, persona } = book.data as {
    title: string;
    author: string;
    coverURL: string;
    persona?: string;
  };

  return (
    <main className="book-page-container">
      {/* Floating back button */}
      <Link href="/" className="back-btn-floating">
        <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
      </Link>

      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
     

       <VapiControls book={book.data} />
      </div>
    </main>
  );
};

export default BookPage;
