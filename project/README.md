# BookHaven

> A fully functional online bookstore e-commerce platform — *Where Stories Meet Souls.*

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + Bootstrap 5 grid utilities |
| Routing | React Router DOM |
| API | Open Library API (covers, metadata, search) |
| State | React Context API (Cart, Wishlist, Auth) + localStorage |
| Animations | AOS (Animate On Scroll) |
| Icons | Lucide React |
| Backend | Supabase (auth + admin features) |

## Features

### Book Categories
Five clearly separated, browsable category sections:
- **Story Books** — fiction, novels, classics
- **Motivational Books** — self-help, personal development
- **Science Books** — physics, biology, cosmology
- **History Books** — world history, civilizations
- **Technology Books** — software, engineering, computing

### Book Listings
- Responsive grid with real book covers from Open Library Covers API
- Live search with instant dropdown results in the navbar
- Skeleton loaders during API fetches + error states with retry buttons
- 10+ books per category on the homepage, 30+ on category pages

### Book Detail Page
Click any book to see: large cover, title/subtitle, author(s), description, genre, publisher, publish date, page count, ISBN, generated price ($8.99–$34.99 based on page count), star rating, quantity selector, Add to Cart, Buy Now, and Wishlist toggle.

### Shopping Cart
- Add to cart from book cards and detail pages
- Navbar cart icon with live item count badge (pulsing animation)
- Quantity controls (increase, decrease, auto-remove at 0)
- Subtotal, 8% tax, and total calculation
- Persists across page reloads via localStorage

### Wishlist
- Heart icon on every book card and detail page
- Toggle with visual feedback (filled/empty heart)
- Dedicated wishlist page with add-to-cart from wishlist
- Persists via localStorage

### Checkout Flow
- Form: full name, email, shipping address, city, ZIP, country
- Payment section: card number (auto-formatting), expiry (MM/YY), CVV
- Order summary sidebar with all items and totals
- Order confirmation page with unique order ID, items, shipping address

### Additional
- Supabase Auth (email/password) for user accounts
- Admin Dashboard for book management (CRUD) and contact submissions
- Sticky navbar with logo, category links, search bar, wishlist + cart icons
- Hero section with CTA buttons
- Footer with newsletter signup, social icons, category links
- Toast notifications for cart/wishlist actions
- Fully responsive (mobile, tablet, desktop)

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx              # Sticky nav with search, cart, wishlist
│   ├── Hero.tsx                # Full-screen hero section
│   ├── Footer.tsx              # Footer with newsletter + social
│   ├── BookCard.tsx            # Book card with add-to-cart + wishlist
│   ├── BookSkeleton.tsx        # Skeleton loaders for grids + detail
│   ├── CategorySection.tsx     # Reusable category section with API fetch
│   ├── LoadingSpinner.tsx      # Spinner component
│   └── ToastNotification.tsx   # Toast context + UI
├── context/
│   ├── AuthContext.tsx         # Supabase auth state
│   ├── CartContext.tsx         # Cart state + localStorage
│   ├── WishlistContext.tsx     # Wishlist state + localStorage
│   └── ToastContext.tsx        # Toast notifications
├── pages/
│   ├── Home.tsx                # Hero + all category sections
│   ├── CategoryPage.tsx        # Single category with 30+ books
│   ├── BookDetail.tsx          # Full book details + add to cart
│   ├── Cart.tsx                # Cart with quantity controls + totals
│   ├── Wishlist.tsx            # Saved books
│   ├── Checkout.tsx            # Shipping + payment form
│   ├── OrderConfirmation.tsx   # Order success with unique ID
│   ├── SearchResults.tsx       # Search results page
│   ├── Login.tsx               # Sign in
│   ├── Register.tsx            # Sign up
│   └── AdminDashboard.tsx      # Admin book management
├── services/
│   ├── openLibraryApi.ts       # Open Library API integration
│   └── api.ts                  # Supabase client (auth/admin)
├── types.ts                    # TypeScript interfaces
├── App.tsx                     # Routes + providers
└── main.tsx                    # Entry point
```

## Open Library API

The app uses three Open Library endpoints:

| Endpoint | Purpose |
|---|---|
| `/search.json?subject={subject}&limit=N` | Fetch books by category |
| `/search.json?q={query}` | Search books by title/author |
| `/works/{workKey}.json` | Fetch book details (description, pages) |

Cover images: `https://covers.openlibrary.org/b/id/{cover_id}-L.jpg`

## Environment Variables

Pre-configured via Bolt's Supabase integration:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
