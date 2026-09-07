import type { Book, Category } from '../types';

// ═══════════════════════════════════════════════════════════
// BookHaven — Curated Book Catalog
// 30 books across 3 categories, each with real ISBN-based covers
//═══════════════════════════════════════════════════════════

export const CATEGORIES: Category[] = [
  {
    key: 'story',
    label: 'Story Books',
    subject: 'fiction',
    description: 'Immerse yourself in captivating novels, timeless classics, and unforgettable tales that stay with you long after the last page.',
    icon: 'BookOpen',
  },
  {
    key: 'motivational',
    label: 'Motivational Books',
    subject: 'self-help',
    description: 'Fuel your growth with books that inspire action, build powerful habits, and unlock your full potential.',
    icon: 'Flame',
  },
  {
    key: 'educational',
    label: 'Educational Books',
    subject: 'education',
    description: 'Master the foundations of computer science, programming, and engineering with essential academic references.',
    icon: 'GraduationCap',
  },
];

export function getCategoryByKey(key: string): Category {
  const cat = CATEGORIES.find((c) => c.key === key);
  if (!cat) throw new Error(`Category '${key}' not found`);
  return cat;
}

// Helper: build cover URL from ISBN
function cover(isbn: string): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

// Helper: deterministic price from ISBN digits
function priceFromIsbn(isbn: string): number {
  let sum = 0;
  for (const ch of isbn) {
    if (ch >= '0' && ch <= '9') sum += parseInt(ch);
  }
  const base = 8.99;
  const range = 26.0; // $8.99 – $34.99
  return +(base + (sum % 100) / 100 * range).toFixed(2);
}

// Helper: deterministic rating from ISBN
function ratingFromIsbn(isbn: string): number {
  let hash = 0;
  for (let i = 0; i < isbn.length; i++) {
    hash = ((hash << 5) - hash) + isbn.charCodeAt(i);
    hash |= 0;
  }
  return +(3.8 + (Math.abs(hash) % 12) / 10).toFixed(1); // 3.8 – 5.0
}

function makeBook(
  id: string,
  title: string,
  author: string,
  isbn: string,
  category: string,
  description: string,
  extra?: Partial<Book>,
): Book {
  return {
    id,
    title,
    author,
    authors: [author],
    coverId: undefined,
    coverUrl: cover(isbn),
    isbn,
    description,
    category,
    price: extra?.price ?? priceFromIsbn(isbn),
    rating: extra?.rating ?? ratingFromIsbn(isbn),
    pageCount: extra?.pageCount ?? 0,
    publisher: extra?.publisher ?? '',
    publishDate: extra?.publishDate ?? '',
    subtitle: extra?.subtitle ?? '',
    subject: extra?.subject ?? [],
  };
}

// ═══════════════════════════════════════════════════════════
// STORY BOOKS (10)
//═══════════════════════════════════════════════════════════

const STORY_BOOKS: Book[] = [
  makeBook('story-1', 'The Alchemist', 'Paulo Coelho', '9780061122415', 'Story Books',
    'A shepherd boy named Santiago journeys from Spain to the Egyptian desert in search of buried treasure, only to discover that the real treasure lies within himself. A timeless fable about following your dreams and listening to your heart.',
    { price: 14.99, rating: 4.7, pageCount: 208, publisher: 'HarperOne', publishDate: '1988' }),
  makeBook('story-2', "Harry Potter and the Sorcerer's Stone", 'J.K. Rowling', '9780590353427', 'Story Books',
    'An orphaned boy discovers on his eleventh birthday that he is a wizard and is invited to attend Hogwarts School of Witchcraft and Wizardry. The magical adventure begins in this beloved first installment of the Harry Potter series.',
    { price: 12.99, rating: 4.9, pageCount: 320, publisher: 'Scholastic', publishDate: '1997' }),
  makeBook('story-3', 'The Hobbit', 'J.R.R. Tolkien', '9780547928227', 'Story Books',
    'Bilbo Baggins, a comfort-loving hobbit, is swept into an epic quest to reclaim the Lonely Mountain and its treasure from the dragon Smaug. A tale of courage, friendship, and adventure that set the stage for The Lord of the Rings.',
    { price: 13.99, rating: 4.8, pageCount: 310, publisher: 'Houghton Mifflin', publishDate: '1937' }),
  makeBook('story-4', 'To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'Story Books',
    'In the sleepy Southern town of Maycomb, Alabama, attorney Atticus Finch defends a Black man falsely accused of a crime, seen through the eyes of his young daughter Scout. A powerful story of racial injustice and lost innocence.',
    { price: 12.49, rating: 4.8, pageCount: 336, publisher: 'Harper Perennial', publishDate: '1960' }),
  makeBook('story-5', 'The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Story Books',
    'In the Jazz Age of the 1920s, mysterious millionaire Jay Gatsby pursues wealth, status, and the love of his life, Daisy Buchanan. A classic novel about the American Dream, obsession, and the illusion of reinvention.',
    { price: 11.99, rating: 4.5, pageCount: 180, publisher: 'Scribner', publishDate: '1925' }),
  makeBook('story-6', 'Life of Pi', 'Yann Martel', '9780156027328', 'Story Books',
    'A young Indian boy named Pi survives a shipwreck and is stranded on a lifeboat in the Pacific Ocean with a Bengal tiger named Richard Parker. A tale of survival, faith, and the power of storytelling.',
    { price: 14.49, rating: 4.6, pageCount: 336, publisher: 'Mariner Books', publishDate: '2001' }),
  makeBook('story-7', 'The Kite Runner', 'Khaled Hosseini', '9781594480003', 'Story Books',
    'Amir, a young boy from Kabul, witnesses a betrayal that haunts him for decades. A powerful story of guilt, redemption, and the enduring bonds of friendship set against the turmoil of Afghanistan.',
    { price: 15.99, rating: 4.7, pageCount: 371, publisher: 'Riverhead Books', publishDate: '2003' }),
  makeBook('story-8', "Alice in Wonderland", 'Lewis Carroll', '9781503222687', 'Story Books',
    'A curious girl named Alice falls through a rabbit hole into a whimsical world filled with peculiar creatures and absurd logic. A beloved classic of nonsense literature that has enchanted readers for generations.',
    { price: 10.99, rating: 4.4, pageCount: 192, publisher: 'CreateSpace', publishDate: '1865' }),
  makeBook('story-9', 'The Book Thief', 'Markus Zusak', '9780375842207', 'Story Books',
    'Narrated by Death, this novel follows Liesel Meminger, a foster girl living in Nazi Germany who steals books and shares them with neighbors and the Jewish man her family hides. A story about the power of words.',
    { price: 13.49, rating: 4.8, pageCount: 552, publisher: 'Knopf', publishDate: '2005' }),
  makeBook('story-10', 'Percy Jackson & The Lightning Thief', 'Rick Riordan', '9780786838653', 'Story Books',
    'Twelve-year-old Percy discovers he is the son of Poseidon and is accused of stealing Zeus master bolt. He embarks on a quest across America to prevent a war among the Greek gods. A thrilling modern mythology adventure.',
    { price: 11.49, rating: 4.6, pageCount: 384, publisher: 'Disney Hyperion', publishDate: '2005' }),
];

// ═══════════════════════════════════════════════════════════
// MOTIVATIONAL BOOKS (10)
//═══════════════════════════════════════════════════════════

const MOTIVATIONAL_BOOKS: Book[] = [
  makeBook('motiv-1', 'Think and Grow Rich', 'Napoleon Hill', '9780439296543', 'Motivational Books',
    'Based on interviews with 500 wealthy individuals, Napoleon Hill distills 13 principles for achieving riches — both financial and personal. One of the best-selling self-help books of all time.',
    { price: 11.99, rating: 4.6, pageCount: 320, publisher: 'Think & Grow Rich', publishDate: '1937' }),
  makeBook('motiv-2', 'The Power of Positive Thinking', 'Norman Vincent Peale', '9780743234742', 'Motivational Books',
    'A practical guide to achieving happiness and success through faith and optimism. Peale offers affirmations and techniques to overcome self-doubt and build confidence in everyday life.',
    { price: 12.99, rating: 4.5, pageCount: 256, publisher: 'Touchstone', publishDate: '1952' }),
  makeBook('motiv-3', 'Atomic Habits', 'James Clear', '9780735211292', 'Motivational Books',
    'A proven framework for getting 1% better every day. James Clear reveals how tiny changes compound into remarkable results, offering practical strategies for forming good habits and breaking bad ones.',
    { price: 19.99, rating: 4.9, pageCount: 320, publisher: 'Avery', publishDate: '2018' }),
  makeBook('motiv-4', 'Rich Dad Poor Dad', 'Robert Kiyosaki', '9781612680194', 'Motivational Books',
    'The story of two fathers — one rich, one poor — and the financial lessons each taught. Kiyosaki challenges conventional wisdom about money, assets, and building wealth in this personal finance classic.',
    { price: 15.99, rating: 4.7, pageCount: 336, publisher: 'Plata Publishing', publishDate: '1997' }),
  makeBook('motiv-5', 'The 7 Habits of Highly Effective People', 'Stephen R. Covey', '9781982137274', 'Motivational Books',
    'A holistic approach to personal and professional effectiveness built on seven timeless principles — from being proactive to sharpening the saw. A framework for leading a principle-centered life.',
    { price: 16.99, rating: 4.7, pageCount: 384, publisher: 'Simon & Schuster', publishDate: '1989' }),
  makeBook('motiv-6', 'You Can Win', 'Shiv Khera', '9789386383051', 'Motivational Books',
    'A step-by-step blueprint for achieving success in life. Shiv Khera shares practical wisdom on attitude, motivation, and the habits that separate winners from losers. An international bestseller.',
    { price: 13.99, rating: 4.5, pageCount: 288, publisher: 'Macmillan', publishDate: '1998' }),
  makeBook('motiv-7', 'The Secret', 'Rhonda Byrne', '9781582701707', 'Motivational Books',
    'The law of attraction revealed — thoughts become things. Rhonda Byrne presents teachings from doctors, philosophers, and visionaries on how to manifest health, wealth, and happiness.',
    { price: 14.99, rating: 4.3, pageCount: 198, publisher: 'Atria Books', publishDate: '2006' }),
  makeBook('motiv-8', 'Do It Today', 'Darius Foroux', '9781520825718', 'Motivational Books',
    'A practical guide to overcoming procrastination and taking action now. Foroux shares strategies for building focus, managing time, and turning good intentions into real results.',
    { price: 10.99, rating: 4.4, pageCount: 162, publisher: 'CreateSpace', publishDate: '2018' }),
  makeBook('motiv-9', "Can't Hurt Me", 'David Goggins', '9781544512273', 'Motivational Books',
    'Navy SEAL David Goggins shares his journey from an abusive childhood to becoming one of the toughest men alive. A raw, inspiring story of pushing past limits and mastering your mind.',
    { price: 17.99, rating: 4.8, pageCount: 364, publisher: 'Lioncrest Publishing', publishDate: '2018' }),
  makeBook('motiv-10', 'Start with Why', 'Simon Sinek', '9781591846444', 'Motivational Books',
    'Why do some leaders inspire action while others do not? Simon Sinek explores the power of starting with purpose — the WHY — and how it drives loyalty, innovation, and lasting success.',
    { price: 15.49, rating: 4.6, pageCount: 256, publisher: 'Portfolio', publishDate: '2009' }),
];

// ═══════════════════════════════════════════════════════════
// EDUCATIONAL BOOKS (10)
//═══════════════════════════════════════════════════════════

const EDUCATIONAL_BOOKS: Book[] = [
  makeBook('edu-1', 'Introduction to Algorithms', 'Thomas H. Cormen', '9780262033848', 'Educational Books',
    'The definitive textbook on algorithms — covering a broad range from sorting and searching to graph theory and computational geometry. Essential reading for every computer science student and professional.',
    { price: 34.99, rating: 4.7, pageCount: 1312, publisher: 'MIT Press', publishDate: '2009' }),
  makeBook('edu-2', 'Clean Code', 'Robert C. Martin', '9780132350884', 'Educational Books',
    'A handbook of agile software craftsmanship. Robert C. Martin teaches the principles, patterns, and practices for writing code that is clean, maintainable, and truly professional.',
    { price: 29.99, rating: 4.6, pageCount: 464, publisher: 'Prentice Hall', publishDate: '2008' }),
  makeBook('edu-3', 'The Pragmatic Programmer', 'Andrew Hunt', '9780201616224', 'Educational Books',
    'Your journey to mastery. Hunt and Thomas cut through the growing specialization of the software industry to offer practical advice on becoming a better, more adaptable developer.',
    { price: 25.99, rating: 4.7, pageCount: 352, publisher: 'Addison-Wesley', publishDate: '1999' }),
  makeBook('edu-4', 'Computer Networking: A Top-Down Approach', 'James F. Kurose', '9780132856201', 'Educational Books',
    'A modern introduction to computer networking that uses the Internet as the primary example. Kurose and Ross take a top-down approach from the application layer to the physical layer.',
    { price: 27.99, rating: 4.5, pageCount: 800, publisher: 'Pearson', publishDate: '2012' }),
  makeBook('edu-5', 'Artificial Intelligence: A Modern Approach', 'Stuart Russell', '9780136042594', 'Educational Books',
    'The most comprehensive and up-to-date AI textbook available. Covers search algorithms, machine learning, robotics, natural language processing, and the philosophical foundations of AI.',
    { price: 32.99, rating: 4.6, pageCount: 1136, publisher: 'Pearson', publishDate: '2009' }),
  makeBook('edu-6', 'Operating System Concepts', 'Abraham Silberschatz', '9781118063330', 'Educational Books',
    'The classic operating systems textbook covering processes, threads, memory management, file systems, and security. A must-read for understanding how modern operating systems work.',
    { price: 30.99, rating: 4.4, pageCount: 944, publisher: 'Wiley', publishDate: '2012' }),
  makeBook('edu-7', 'Database System Concepts', 'Henry F. Korth', '9780073523323', 'Educational Books',
    'A leading textbook on database management systems. Covers relational algebra, SQL, transaction processing, and database design — from fundamentals to advanced topics.',
    { price: 28.99, rating: 4.4, pageCount: 1376, publisher: 'McGraw-Hill', publishDate: '2019' }),
  makeBook('edu-8', 'Python Crash Course', 'Eric Matthes', '9781593279288', 'Educational Books',
    'A hands-on, project-based introduction to programming using Python. Matthes covers basics, data visualization, and web development — perfect for beginners and self-taught programmers.',
    { price: 22.99, rating: 4.7, pageCount: 544, publisher: 'No Starch Press', publishDate: '2019' }),
  makeBook('edu-9', 'Java: The Complete Reference', 'Herbert Schildt', '9781260463432', 'Educational Books',
    'The definitive guide to Java programming. Schildt covers syntax, keywords, the Java Standard Library, and modern features from a master programmer and bestselling author.',
    { price: 26.99, rating: 4.5, pageCount: 1248, publisher: 'McGraw-Hill', publishDate: '2021' }),
  makeBook('edu-10', 'Data Structures and Algorithms Made Easy', 'Narasimha Karumanchi', '9788193245279', 'Educational Books',
    'A comprehensive guide to data structures and algorithms with practical examples and interview questions. Written for students and professionals preparing for technical interviews.',
    { price: 21.99, rating: 4.3, pageCount: 868, publisher: 'CareerMonk', publishDate: '2017' }),
];

// ═══════════════════════════════════════════════════════════
// Combined Catalog
//═══════════════════════════════════════════════════════════

export const ALL_BOOKS: Book[] = [
  ...STORY_BOOKS,
  ...MOTIVATIONAL_BOOKS,
  ...EDUCATIONAL_BOOKS,
];

const BOOKS_BY_ID = new Map(ALL_BOOKS.map((b) => [b.id, b]));

export function getBooksByCategory(category: Category): Book[] {
  return ALL_BOOKS.filter((b) => b.category === category.label);
}

export function getBookById(id: string): Book | null {
  return BOOKS_BY_ID.get(id) ?? null;
}

export function searchCatalog(query: string): Book[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ALL_BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q),
  );
}

// Keep these async signatures for backward compat with components
export async function fetchBooksByCategory(category: Category): Promise<Book[]> {
  return getBooksByCategory(category);
}

export async function fetchBookByWorkId(id: string, _categoryLabel?: string): Promise<Book | null> {
  return getBookById(id);
}

export async function searchBooks(query: string): Promise<Book[]> {
  return searchCatalog(query);
}
