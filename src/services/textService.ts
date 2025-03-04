export async function getChapterContent(religion: string, bookId: string, chapterNumber: string) {
  // Get metadata from MongoDB
  const metadata = await db.collection('texts').findOne({
    type: religion.toLowerCase(),
    bookId,
    chapterNumber
  });

  if (!metadata) return null;

  // Fetch content from R2
  const response = await fetch(metadata.contentUrl);
  const content = await response.json();

  return {
    ...metadata,
    content
  };
}