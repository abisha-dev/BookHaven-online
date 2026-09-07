
/*
# BookHaven — Update categories and book covers

## Changes
1. Re-seeds books with new category taxonomy:
   - 'Story Books' (replaces Fiction/Mystery/Biography)
   - 'Motivational Books' (replaces Self-Help)
   - 'Science Books' (replaces Science)
   - 'History Books' (replaces History)
   - 'Technology Books' (replaces Technology)
   - 'Non-Fiction Books' (replaces Non-Fiction)
2. Replaces generic Pexels images with real book covers from Open Library Covers API (ISBN-based)
3. Truncates existing books first, then re-inserts — safe because books are seeded sample data

## Notes
- All image URLs use https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg which returns the actual book cover
- 18 books total: 3 per category across 6 categories
*/

TRUNCATE public.books;

INSERT INTO public.books (title, author, price, image, description, category, rating, stock) VALUES
  -- Story Books
  ('The Great Gatsby', 'F. Scott Fitzgerald', 14.99, 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg', 'A portrait of the Jazz Age in all of its decadence and excess, The Great Gatsby is the classic novel of the American Dream gone awry. Jay Gatsby pursues wealth, status, and the love of his life, Daisy Buchanan, in one of the most celebrated works of American literature.', 'Story Books', 4.5, 42),
  ('To Kill a Mockingbird', 'Harper Lee', 13.99, 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg', 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. To Kill A Mockingbird became both an instant bestseller and a critical success when it was first published in 1960.', 'Story Books', 4.9, 48),
  ('1984', 'George Orwell', 12.99, 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg', 'A chilling dystopian novel about totalitarianism, surveillance, and the fight for freedom. Winston Smith works at the Ministry of Truth, rewriting history until he dares to rebel against the Party.', 'Story Books', 4.8, 55),

  -- Motivational Books
  ('Atomic Habits', 'James Clear', 19.99, 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg', 'A proven framework for getting 1% better every day. James Clear reveals how tiny changes can lead to remarkable results, offering practical strategies for forming good habits and breaking bad ones.', 'Motivational Books', 4.9, 60),
  ('The Power of Now', 'Eckhart Tolle', 15.99, 'https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg', 'A spiritual guide to enlightenment and the practice of living in the present moment. Eckhart Tolle teaches how to free yourself from anxiety and find true peace and joy in the Now.', 'Motivational Books', 4.4, 38),
  ('Think and Grow Rich', 'Napoleon Hill', 11.99, 'https://covers.openlibrary.org/b/isbn/9780439296543-L.jpg', 'Napoleon Hill studied the habits, attitudes, and philosophies of the wealthy and successful. This timeless classic reveals 13 principles that can lead to riches, both financial and personal.', 'Motivational Books', 4.6, 70),

  -- Science Books
  ('A Brief History of Time', 'Stephen Hawking', 16.99, 'https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg', 'Stephen Hawking explores the cosmos — from the Big Bang to black holes, from the nature of light to the fabric of spacetime — in a way that makes complex physics accessible to all readers.', 'Science Books', 4.7, 25),
  ('Cosmos', 'Carl Sagan', 17.99, 'https://covers.openlibrary.org/b/isbn/9780345539434-L.jpg', 'Carl Sagan takes readers on a personal voyage through the wonders of the universe and the history of science. A beautifully written journey through space, time, and human discovery.', 'Science Books', 4.6, 20),
  ('The Selfish Gene', 'Richard Dawkins', 18.99, 'https://covers.openlibrary.org/b/isbn/9780198575191-L.jpg', 'Richard Dawkins revolutionary work reframes evolution through the perspective of genes, changing how we understand natural selection and the very nature of life itself.', 'Science Books', 4.5, 28),

  -- History Books
  ('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 18.99, 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg', 'A sweeping narrative of human history from the first humans to the present day, exploring how Homo sapiens came to dominate the planet through cooperation, imagination, and shared myths.', 'History Books', 4.8, 30),
  ('Guns, Germs, and Steel', 'Jared Diamond', 17.99, 'https://covers.openlibrary.org/b/isbn/9780393317558-L.jpg', 'A fascinating account of how environmental and geographical factors — not racial or cultural superiority — shaped the fates of human societies across continents and millennia.', 'History Books', 4.6, 24),
  ('The Silk Roads', 'Peter Frankopan', 21.99, 'https://covers.openlibrary.org/b/isbn/9781101912379-L.jpg', 'A major reassessment of world history that reframes our understanding of the past, showing how the Silk Roads connecting East and West shaped civilizations, trade, and culture.', 'History Books', 4.4, 18),

  -- Technology Books
  ('Clean Code', 'Robert C. Martin', 29.99, 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg', 'A handbook of agile software craftsmanship. Robert C. Martin teaches the principles, patterns, and practices for writing code that is clean, maintainable, and truly professional.', 'Technology Books', 4.6, 40),
  ('The Pragmatic Programmer', 'Andy Hunt & Dave Thomas', 25.99, 'https://covers.openlibrary.org/b/isbn/9780201616224-L.jpg', 'Your journey to mastery. The Pragmatic Programmer cuts through the growing specialization of the software industry to offer practical advice on becoming a better, more adaptable developer.', 'Technology Books', 4.7, 35),
  ('Design Patterns', 'Erich Gamma et al.', 34.99, 'https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg', 'The seminal text on object-oriented design patterns. Four top-tier design experts offer proven solutions to common software design challenges, cataloguing 23 classic patterns.', 'Technology Books', 4.3, 22),

  -- Non-Fiction Books
  ('Thinking, Fast and Slow', 'Daniel Kahneman', 21.99, 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg', 'Daniel Kahneman takes us on a groundbreaking tour of the mind, explaining the two systems that drive the way we think — the fast, intuitive System 1 and the slow, deliberate System 2.', 'Non-Fiction Books', 4.7, 35),
  ('Educated', 'Tara Westover', 18.99, 'https://covers.openlibrary.org/b/isbn/9780393635286-L.jpg', 'A memoir about a woman who, kept out of school by her radical family, taught herself enough to leave home and eventually earn a PhD from Cambridge University. A story of transformation.', 'Non-Fiction Books', 4.8, 32),
  ('The Immortal Life of Henrietta Lacks', 'Rebecca Skloot', 16.99, 'https://covers.openlibrary.org/b/isbn/9781400052189-L.jpg', 'The story of Henrietta Lacks, whose cells — taken without her knowledge — became one of the most important tools in medicine. A riveting tale of science, ethics, and family.', 'Non-Fiction Books', 4.7, 26);
