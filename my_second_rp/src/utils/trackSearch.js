import { databases, ID, Query } from './appwriteconfig';
import { fetchMovieByTitle } from './omdb'; // ✅ REQUIRED

const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

export const trackMovieSearch = async (movieTitle) => {
  try {
    const response = await databases.listDocuments(DB_ID, COLLECTION_ID, [
      Query.equal('movieTitle', movieTitle),
    ]);

    if (response.total > 0) {
      const doc = response.documents[0];
      await databases.updateDocument(DB_ID, COLLECTION_ID, doc.$id, {
        searchCount: doc.searchCount + 1,
      });
    } else {
      await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), {
        movieTitle,
        searchCount: 1,
      });
    }
  } catch (error) {
    console.error("Error tracking search:", error);
  }
};

export const getTop3SearchedMovies = async () => {
  try {
    const result = await databases.listDocuments(DB_ID, COLLECTION_ID, [
      Query.orderDesc("searchCount"),
      Query.limit(3),
    ]);

    const topTitles = result.documents.map(doc => doc.movieTitle);
    console.log("🔥 Top titles from Appwrite:", topTitles);

    const topMovies = await Promise.all(
      topTitles.map(title => fetchMovieByTitle(title))
    );

    console.log("🎥 Full movie details for top titles:", topMovies);
    return topMovies.filter(movie => movie !== null);
  } catch (error) {
    console.error("❌ Error fetching top searches:", error);
    return [];
  }
};
