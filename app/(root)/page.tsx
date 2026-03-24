import BookCard from "@/components/BookCard";
import HeroSection from "@/components/HeroSection";
import { getAllBooks } from "@/lib/actions/book.actions";
import { sampleBooks } from "@/lib/constants";

const Home = async () => {
  const bookResults = await getAllBooks();
  const books = bookResults.success ? bookResults.data ??[] : [];
  return (
    <main className="wrapper container ">
      <HeroSection />
      <div className="library-books-grid ">
        {books.map(({ author, title, coverURL, slug, _id }) => (
              <BookCard
                key={_id}
                title={title}
                author={author}
                coverURL={coverURL}
                slug={slug}
              />
            ))}
      </div>
    </main>
  );
};

export default Home;
