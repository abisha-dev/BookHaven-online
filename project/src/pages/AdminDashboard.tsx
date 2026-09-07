import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilLine, Trash2, Plus, BookOpen, MessageSquare, X, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  fetchBooks,
  fetchContacts,
  createBook,
  updateBook,
  deleteBook,
  type Book,
  type BookInput,
  type ContactSubmission,
} from '../services/api';

const CATEGORIES = ['Story Books', 'Motivational Books', 'Science Books', 'History Books', 'Technology Books', 'Non-Fiction Books'];

const emptyForm: BookInput = {
  title: '',
  author: '',
  price: 0,
  image: '',
  description: '',
  category: 'Story Books',
  rating: 0,
  stock: 0,
};

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'books' | 'contacts'>('books');

  // Books state
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);

  // Contacts state
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form, setForm] = useState<BookInput>(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const loadBooks = useCallback(async () => {
    setBooksLoading(true);
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch {
      showToast('Failed to load books.', 'error');
    } finally {
      setBooksLoading(false);
    }
  }, [showToast]);

  const loadContacts = useCallback(async () => {
    setContactsLoading(true);
    try {
      const data = await fetchContacts();
      setContacts(data);
    } catch {
      showToast('Failed to load contact submissions.', 'error');
    } finally {
      setContactsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (user && isAdmin) loadBooks();
  }, [user, isAdmin, loadBooks]);

  useEffect(() => {
    if (activeTab === 'contacts' && user && isAdmin) loadContacts();
  }, [activeTab, user, isAdmin, loadContacts]);

  // ── Modal helpers ─────────────────────────────────────
  const openCreate = () => {
    setEditingBook(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (book: Book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      price: book.price,
      image: book.image,
      description: book.description,
      category: book.category,
      rating: book.rating,
      stock: book.stock,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBook(null);
    setForm(emptyForm);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.author) {
      showToast('Title and Author are required.', 'error');
      return;
    }
    setFormLoading(true);
    try {
      if (editingBook) {
        await updateBook(editingBook.id, form);
        showToast('Book updated successfully.', 'success');
      } else {
        await createBook(form);
        showToast('Book added successfully.', 'success');
      }
      closeModal();
      loadBooks();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Operation failed.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id);
      showToast('Book deleted.', 'info');
      setDeleteId(null);
      loadBooks();
    } catch {
      showToast('Failed to delete book.', 'error');
    }
  };

  const setF = (key: keyof BookInput, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (authLoading) return <LoadingSpinner message="Verifying access…" />;
  if (!user || !isAdmin) return null;

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="container d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h1 className="section-title mb-0" style={{ fontSize: '1.6rem' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 0 }}>
              Manage your BookHaven store
            </p>
          </div>
          {activeTab === 'books' && (
            <button className="btn btn-gold d-flex align-items-center gap-2" onClick={openCreate}>
              <Plus size={16} />
              Add New Book
            </button>
          )}
        </div>
      </div>

      <div className="container py-4">
        {/* Tabs */}
        <div className="admin-tab">
          <ul className="nav nav-tabs-dark" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'books' ? 'active' : ''}`}
                onClick={() => setActiveTab('books')}
              >
                <BookOpen size={16} />
                Manage Books
                <span
                  style={{
                    background: 'rgba(244,162,97,0.15)',
                    color: 'var(--accent)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '1px 7px',
                    borderRadius: '10px',
                  }}
                >
                  {books.length}
                </span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'contacts' ? 'active' : ''}`}
                onClick={() => setActiveTab('contacts')}
              >
                <MessageSquare size={16} />
                Contact Submissions
              </button>
            </li>
          </ul>

          {/* Books Tab */}
          {activeTab === 'books' && (
            <div>
              {booksLoading ? (
                <LoadingSpinner message="Loading books…" />
              ) : books.length === 0 ? (
                <div className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
                  <BookOpen size={40} style={{ marginBottom: '1rem', color: 'var(--border)' }} />
                  <p>No books yet. Add your first book!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark-custom mb-0">
                    <thead>
                      <tr>
                        <th>Cover</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Rating</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((book) => (
                        <tr key={book.id}>
                          <td>
                            <img
                              src={book.image || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=80'}
                              alt={book.title}
                              style={{ width: 40, height: 52, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)' }}
                            />
                          </td>
                          <td>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                              {book.title}
                            </span>
                          </td>
                          <td>{book.author}</td>
                          <td>
                            <span className="badge-category" style={{ fontSize: '0.7rem' }}>
                              {book.category}
                            </span>
                          </td>
                          <td style={{ color: 'var(--accent)', fontWeight: 600 }}>
                            ${book.price.toFixed(2)}
                          </td>
                          <td>
                            <span style={{ color: 'var(--accent)' }}>★</span> {book.rating.toFixed(1)}
                          </td>
                          <td>
                            <span style={{ color: book.stock > 0 ? 'var(--success)' : 'var(--error)', fontWeight: 500 }}>
                              {book.stock}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <button
                                className="action-btn action-btn-edit"
                                onClick={() => openEdit(book)}
                                title="Edit"
                              >
                                <PencilLine size={14} />
                              </button>
                              <button
                                className="action-btn action-btn-delete"
                                onClick={() => setDeleteId(book.id)}
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div>
              {contactsLoading ? (
                <LoadingSpinner message="Loading submissions…" />
              ) : contacts.length === 0 ? (
                <div className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
                  <MessageSquare size={40} style={{ marginBottom: '1rem', color: 'var(--border)' }} />
                  <p>No contact submissions yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark-custom mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((c) => (
                        <tr key={c.id}>
                          <td style={{ color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                            {c.name}
                          </td>
                          <td style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{c.email}</td>
                          <td>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              {c.message.length > 80 ? c.message.slice(0, 80) + '…' : c.message}
                            </span>
                          </td>
                          <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {new Date(c.submitted_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Book Form Modal ─────────────────────────────── */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: 620,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h5>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} style={{ padding: '1.5rem' }}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label-dark">Title *</label>
                  <input
                    type="text"
                    className="form-control form-control-dark"
                    placeholder="Book title"
                    value={form.title}
                    onChange={(e) => setF('title', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-8">
                  <label className="form-label-dark">Author *</label>
                  <input
                    type="text"
                    className="form-control form-control-dark"
                    placeholder="Author name"
                    value={form.author}
                    onChange={(e) => setF('author', e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label-dark">Category</label>
                  <select
                    className="form-control form-control-dark"
                    value={form.category}
                    onChange={(e) => setF('category', e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label-dark">Price ($) *</label>
                  <input
                    type="number"
                    className="form-control form-control-dark"
                    min={0}
                    step={0.01}
                    value={form.price}
                    onChange={(e) => setF('price', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label-dark">Rating (0–5)</label>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="number"
                      className="form-control form-control-dark"
                      min={0}
                      max={5}
                      step={0.1}
                      value={form.rating}
                      onChange={(e) => setF('rating', parseFloat(e.target.value) || 0)}
                    />
                    <Star size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label-dark">Stock</label>
                  <input
                    type="number"
                    className="form-control form-control-dark"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setF('stock', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label-dark">Cover Image URL</label>
                  <input
                    type="url"
                    className="form-control form-control-dark"
                    placeholder="https://…"
                    value={form.image}
                    onChange={(e) => setF('image', e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label-dark">Description</label>
                  <textarea
                    className="form-control form-control-dark"
                    rows={3}
                    placeholder="Brief description of the book…"
                    value={form.description}
                    onChange={(e) => setF('description', e.target.value)}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  type="button"
                  className="btn btn-outline-gold"
                  onClick={closeModal}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold d-flex align-items-center gap-2"
                  disabled={formLoading}
                >
                  {formLoading && <span className="spinner-border spinner-border-sm" />}
                  {formLoading ? 'Saving…' : editingBook ? 'Save Changes' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ─────────────────────────── */}
      {deleteId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 1060,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              width: '100%',
              maxWidth: 400,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'rgba(229,115,115,0.1)',
                border: '1px solid rgba(229,115,115,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <Trash2 size={22} style={{ color: 'var(--error)' }} />
            </div>
            <h5 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Delete Book?
            </h5>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              This action cannot be undone. The book will be permanently removed.
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <button
                className="btn btn-outline-gold"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{ background: 'var(--error)', color: '#fff', fontWeight: 600, borderRadius: 'var(--radius)', padding: '0.6rem 1.6rem' }}
                onClick={() => handleDelete(deleteId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
