"use server";

import BookSegment from "@/database/models/book-segments.model";
import Book from "@/database/models/books.model";
import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { escapeRegex, generateSlug, serializeData } from "../utils";

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

export const getBookBySlug = async (slug: string) => {
  try {
    await connectToDatabase();

    const book = await Book.findOne({ slug }).lean();

    if (!book) {
      return { success: false, error: "Book not found" };
    }

    return {
      success: true,
      data: serializeData(book),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error getting book by slug", message);

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

// Searches book segments using MongoDB text search with regex fallback
export const searchBookSegments = async (
  bookId: string,
  query: string,
  limit: number = 5,
) => {
  try {
    await connectToDatabase();

    console.log(`Searching for: "${query}" in book ${bookId}`);

    const bookObjectId = new mongoose.Types.ObjectId(bookId);

    // Try MongoDB text search first (requires text index)
    let segments: Record<string, unknown>[] = [];
    try {
      segments = await BookSegment.find({
        bookId: bookObjectId,
        $text: { $search: query },
      })
        .select("_id bookId content segmentIndex pageNumber wordCount")
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .lean();
    } catch {
      // Text index may not exist — fall through to regex fallback
      segments = [];
    }

    // Fallback: regex search matching ANY keyword
    if (segments.length === 0) {
      const keywords = query.split(/\s+/).filter((k) => k.length > 2);

      if (keywords.length == 0) {
        return {
          success: true,
          data: [],
        };
      }

      const pattern = keywords.map(escapeRegex).join("|");

      segments = await BookSegment.find({
        bookId: bookObjectId,
        content: { $regex: pattern, $options: "i" },
      })
        .select("_id bookId content segmentIndex pageNumber wordCount")
        .sort({ segmentIndex: 1 })
        .limit(limit)
        .lean();
    }

    console.log(`Search complete. Found ${segments.length} results`);

    return {
      success: true,
      data: serializeData(segments),
    };
  } catch (error) {
    console.error("Error searching segments:", error);
    return {
      success: false,
      error: (error as Error).message,
      data: [],
    };
  }
};
