import UploadForm from "@/components/UploadForm";

const NewBookPage = () => {
  return (
    <main className="container wrapper">
      <div className="mx-auto max-w-180 space-y-10">
        <section className="flex flex-col gap-5">
          <h1 className="page-title-xl">Add New Book</h1>
          <p className="subtitle">
            Upload new pdf to generate your interactive session
          </p>
        </section>
        <UploadForm />
      </div>
    </main>
  );
};

export default NewBookPage;
