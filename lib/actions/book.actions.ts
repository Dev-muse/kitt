"use server";

import BookSegment from "@/database/models/book-segments.model";
import Book from "@/database/models/books.model";
import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "../utils";
import { auth } from "@clerk/nextjs/server";

export const createBook = async (data: CreateBook) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized: User not authenticated" };
    }

    await connectToDatabase();
    const slug = generateSlug(data.title);
    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        success: true,
        data: serializeData(existingBook),
        alreadyExists: true,
      };
    }

    // TODO: Check subscription limits before creating a book

    const book = await Book.create({
      ...data,
      clerkId: userId,
      slug,
      totalSegments: 0,
    });
    return {
      success: true,
      data: serializeData(book),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Error creating book", message);
    return {
      success: false,
      error: message,
    };
  }
};

export const saveBookSegments = async (
  bookId: string,
  segments: TextSegment[],
) => {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized: User not authenticated" };
  }

  try {
    await connectToDatabase();

    // Ownership check: verify the book exists and belongs to the authenticated user
    const book = await Book.findById(bookId).lean();
    if (!book) {
      return { success: false, error: "Book not found" };
    }
    if (book.clerkId !== userId) {
      return { success: false, error: "Forbidden: You do not own this book" };
    }

    console.log("Saving book segement...");

    const segementsToInsert = segments.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        bookId,
        clerkId: userId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
      }),
    );

    await BookSegment.insertMany(segementsToInsert);

    await Book.findByIdAndUpdate(bookId, {
      totalSegments: segments.length,
    });

    console.log("Book segments saved successfully...");
    return {
      success: true,
      data: { segementCreated: segments.length },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Error saving book segements", message);

    // Rollback: only delete segments and book owned by the authenticated user
    try {
      const book = await Book.findById(bookId).lean();
      if (book && book.clerkId === userId) {
        await BookSegment.deleteMany({ bookId });
        await Book.findByIdAndDelete(bookId);
        console.log(
          "Deleted book segements and book due to inability to save book segement",
        );
      }
    } catch (rollbackError) {
      console.error("Rollback failed", rollbackError);
    }

    return {
      success: false,
      error: message,
    };
  }
};

export const checkBookExists = async (title: string) => {
  try {
    await connectToDatabase();
    const slug = generateSlug(title);
    const existingBook = await Book.findOne({ slug }).lean();
    if (existingBook) {
      return {
        book: serializeData(existingBook),
        exists: true,
      };
    }
    return {
      exists: false,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error checking if book exists", message);
    return {
      success: false,
      error: message,
    };
  }
};

export const getAllBooks = async () => {
  try {
    await connectToDatabase();

    const books = await Book.find().sort({ createdAt: -1 }).lean();

    return {
      success: true,
      data: serializeData(books),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error getting all books", message);

    return {
      success: false,
      error: message,
    };
  }
};
