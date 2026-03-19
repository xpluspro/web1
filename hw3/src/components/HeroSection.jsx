import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection({ books }) {
  const hasLoop = books.length > 1;
  const carouselBooks = hasLoop ? [books[books.length - 1], ...books, books[0]] : books;
  const [currentIndex, setCurrentIndex] = useState(hasLoop ? 1 : 0);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const resetFrameRef = useRef(0);

  useEffect(() => {
    if (!hasLoop) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      if (isAnimating) {
        return;
      }

      setIsAnimating(true);
      setEnableTransition(true);
      setCurrentIndex((current) => current + 1);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [hasLoop, isAnimating]);

  useEffect(() => {
    setCurrentIndex(hasLoop ? 1 : 0);
    setEnableTransition(true);
    setIsAnimating(false);
  }, [hasLoop, books.length]);

  useEffect(() => () => window.cancelAnimationFrame(resetFrameRef.current), []);

  function resetWithoutAnimation(targetIndex) {
    setEnableTransition(false);
    setCurrentIndex(targetIndex);

    resetFrameRef.current = window.requestAnimationFrame(() => {
      resetFrameRef.current = window.requestAnimationFrame(() => {
        setEnableTransition(true);
        setIsAnimating(false);
      });
    });
  }

  function showPrev() {
    if (!hasLoop || isAnimating) {
      return;
    }

    setIsAnimating(true);
    setEnableTransition(true);
    setCurrentIndex((current) => current - 1);
  }

  function showNext() {
    if (!hasLoop || isAnimating) {
      return;
    }

    setIsAnimating(true);
    setEnableTransition(true);
    setCurrentIndex((current) => current + 1);
  }

  function handleTransitionEnd() {
    if (!hasLoop) {
      return;
    }

    if (currentIndex === 0) {
      resetWithoutAnimation(books.length);
      return;
    }

    if (currentIndex === books.length + 1) {
      resetWithoutAnimation(1);
      return;
    }

    setIsAnimating(false);
  }

  const activeIndex = !hasLoop
    ? 0
    : currentIndex === 0
      ? books.length - 1
      : currentIndex === books.length + 1
        ? 0
        : currentIndex - 1;

  return (
    <section className="mb-10">
      <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
        <div
          className={`flex ${enableTransition ? 'transition-transform duration-700 ease-out' : ''}`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {carouselBooks.map((book, index) => (
            <article
              key={`${book.id}-${index}`}
              className="min-w-full"
              aria-hidden={index !== currentIndex}
            >
              <div className="grid min-h-[420px] lg:grid-cols-[1.02fr_0.98fr]">
                <div className="flex flex-col justify-center px-7 py-8 sm:px-10 sm:py-10 lg:px-12">
                  <p className="mb-4 text-sm font-black uppercase tracking-[0.4em] text-primary-600">
                    {book.eyebrow}
                  </p>
                  <h2 className="mb-5 max-w-[11ch] text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
                    {book.title}
                  </h2>
                  <p className="mb-4 text-lg text-slate-500">{book.author}</p>
                  <p className="mb-8 max-w-2xl text-lg leading-9 text-slate-600">{book.summary}</p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/books/${book.slug}`}
                      state={{ bookId: book.id }}
                      className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-primary-700"
                    >
                      {book.cta}
                    </Link>
                    <a
                      href="#book-grid"
                      className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      浏览全部图书
                    </a>
                  </div>
                </div>

                <div className="flex min-h-[320px] flex-col justify-between bg-gradient-to-br from-primary-600 via-primary-700 to-slate-900 p-7 text-white sm:p-8 lg:p-10">
                  <div className="max-w-sm rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-primary-100">
                      推荐理由
                    </p>
                    <p className="text-base leading-8 text-primary-50">{book.summary}</p>
                  </div>

                  <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-primary-200">
                        {book.eyebrow === '本周推荐' ? '本周主打' : '经典必读'}
                      </p>
                      <h3 className="max-w-sm text-3xl font-bold leading-10">{book.title}</h3>
                      <p className="mt-3 text-base text-primary-100">{book.author}</p>
                    </div>

                    <div className="flex h-72 w-52 flex-shrink-0 items-center justify-center self-center rounded-[1.75rem] bg-white/95 p-5 shadow-2xl shadow-slate-950/30 sm:self-auto">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {hasLoop ? (
          <>
            <button
              type="button"
              onClick={showPrev}
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-950/35 text-xl font-semibold text-white backdrop-blur transition hover:bg-slate-950/55"
              aria-label="查看上一张推荐"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-950/35 text-xl font-semibold text-white backdrop-blur transition hover:bg-slate-950/55"
              aria-label="查看下一张推荐"
            >
              ›
            </button>

            <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-white/78 px-3 py-2 shadow-sm backdrop-blur">
              {books.map((book, index) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => {
                    if (isAnimating || index === activeIndex) {
                      return;
                    }

                    setIsAnimating(true);
                    setEnableTransition(true);
                    setCurrentIndex(index + 1);
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex ? 'w-8 bg-primary-600' : 'w-2.5 bg-gray-300'
                  }`}
                  aria-label={`跳转到第 ${index + 1} 张推荐`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

    </section>
  );
}
