/**
 * 株式会社イデア - コーポレートサイト
 * main.js - メインJavaScript
 * 2025 Web Design Trends Implementation
 */

(function() {
  'use strict';

  // ========================================
  // DOM Elements
  // ========================================
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-mobile a');

  // PC Mega Menu
  const megaMenuToggle = document.querySelector('.mega-menu-toggle');
  const megaMenu = document.querySelector('.mega-menu');
  const megaMenuLinks = document.querySelectorAll('.mega-menu a');

  // ========================================
  // Loading Animation（ブラー拡散演出）
  // ========================================
  function initLoader() {
    const loader = document.querySelector('.loader');
    const heroVideo = document.getElementById('hero-video');
    if (!loader) return;

    // ヒーロー動画の設定
    const heroEndContent = document.getElementById('hero-end-content');
    const heroReplayBtn = document.getElementById('hero-replay-btn');
    const header = document.querySelector('.header');

    if (heroVideo) {
      // 動画を最初のフレームで停止
      heroVideo.currentTime = 0;
      heroVideo.pause();

      // 動画再生開始時にヘッダーを透過
      heroVideo.addEventListener('play', () => {
        if (header) {
          header.classList.add('video-playing');
        }
      });

      // 動画終了時に指定フレームに戻して停止 + ヒーローテキスト表示 + ヘッダー戻す
      heroVideo.addEventListener('ended', () => {
        // 動画を1秒目のフレームに戻して背景として表示
        heroVideo.currentTime = 1;
        heroVideo.pause();
        // ヘッダーを通常に戻す
        if (header) {
          header.classList.remove('video-playing');
        }
        // ヒーローテキストをフェードイン
        if (heroEndContent) {
          heroEndContent.classList.add('visible');
        }
        // リプレイボタンを表示
        if (heroReplayBtn) {
          heroReplayBtn.classList.add('visible');
        }
      });

      // リプレイボタンのクリック処理
      if (heroReplayBtn) {
        heroReplayBtn.addEventListener('click', () => {
          // テキストとボタンを非表示
          if (heroEndContent) {
            heroEndContent.classList.remove('visible');
          }
          heroReplayBtn.classList.remove('visible');

          // 動画を最初から再生
          heroVideo.currentTime = 0;
          heroVideo.play().catch(() => {});
        });
      }
    }

    // ページ読み込み完了時
    window.addEventListener('load', () => {
      // ロゴ表示時間（1.2秒）
      setTimeout(() => {
        // ブラー拡散アニメーション開始
        loader.classList.add('fade-out');

        // ブラー演出の途中で動画再生開始（間くらいの被せ）
        setTimeout(() => {
          if (heroVideo) {
            heroVideo.play().catch(() => {});
          }
        }, 220); // 間くらいで再生開始

        // ブラーアニメーション完了後に非表示
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.classList.add('loaded');

          // ローダー完全非表示後に削除
          setTimeout(() => {
            loader.remove();
          }, 600);
        }, 1000); // ブラーアニメーション時間
      }, 1200); // ロゴ表示時間
    });

    // フォールバック（5秒後に強制非表示）
    setTimeout(() => {
      if (!loader.classList.contains('hidden')) {
        loader.classList.add('fade-out');
        setTimeout(() => {
          if (heroVideo) {
            heroVideo.play().catch(() => {});
          }
        }, 220);
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.classList.add('loaded');
        }, 1000);
      }
    }, 5000);
  }

  // ========================================
  // Custom Cursor (Mouse Stalker)
  // ========================================
  function initCustomCursor() {
    // モバイルデバイスでは無効化
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    // prefers-reduced-motion対応
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (!cursor || !cursorFollower) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    // マウス座標を追跡
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // アニメーションループ
    function animateCursor() {
      // メインカーソル（即座に追従）
      cursorX += (mouseX - cursorX) * 0.5;
      cursorY += (mouseY - cursorY) * 0.5;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

      // フォロワー（遅延して追従）
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // ホバー時のエフェクト
    const hoverTargets = document.querySelectorAll('a, button, .btn, .card, .gallery-item, input, textarea, select');

    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorFollower.classList.add('hover');
      });

      target.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
      });
    });

    // クリック時のエフェクト
    document.addEventListener('mousedown', () => {
      cursor.classList.add('click');
      cursorFollower.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
      cursor.classList.remove('click');
      cursorFollower.classList.remove('click');
    });

    // カーソルがウィンドウ外に出た時
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorFollower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorFollower.style.opacity = '1';
    });
  }

  // ========================================
  // Header Scroll Effect
  // ========================================
  let lastScrollY = 0;
  let ticking = false;

  function handleScroll() {
    const currentScrollY = window.scrollY;

    // スクロール方向の検出
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // 下スクロール時（ヘッダーを隠す - オプション）
      // header?.classList.add('hidden');
    } else {
      // 上スクロール時
      // header?.classList.remove('hidden');
    }

    // スクロール位置でのスタイル変更
    if (currentScrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  // ========================================
  // Mobile Navigation
  // ========================================
  function toggleMobileNav() {
    const isActive = menuToggle?.classList.contains('active');

    menuToggle?.classList.toggle('active');
    navMobile?.classList.toggle('active');
    navOverlay?.classList.toggle('active');

    // body スクロール制御
    document.body.style.overflow = !isActive ? 'hidden' : '';

    // aria属性の更新
    menuToggle?.setAttribute('aria-expanded', !isActive);
    navMobile?.setAttribute('aria-hidden', isActive);
  }

  function closeMobileNav() {
    menuToggle?.classList.remove('active');
    navMobile?.classList.remove('active');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';

    menuToggle?.setAttribute('aria-expanded', 'false');
    navMobile?.setAttribute('aria-hidden', 'true');
  }

  menuToggle?.addEventListener('click', toggleMobileNav);
  navOverlay?.addEventListener('click', closeMobileNav);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // ESCキーでメニューを閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMobile?.classList.contains('active')) {
      closeMobileNav();
    }
  });

  // リサイズ時にモバイルメニューを閉じる
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768 && navMobile?.classList.contains('active')) {
        closeMobileNav();
      }
      if (window.innerWidth <= 768 && megaMenu?.classList.contains('active')) {
        closeMegaMenu();
      }
    }, 250);
  });

  // ========================================
  // PC Mega Menu
  // ========================================
  function toggleMegaMenu() {
    const isActive = megaMenuToggle?.classList.contains('active');

    megaMenuToggle?.classList.toggle('active');
    megaMenu?.classList.toggle('active');

    // body スクロール制御
    document.body.style.overflow = !isActive ? 'hidden' : '';

    // aria属性の更新
    megaMenuToggle?.setAttribute('aria-expanded', !isActive);
    megaMenu?.setAttribute('aria-hidden', isActive);
  }

  function closeMegaMenu() {
    megaMenuToggle?.classList.remove('active');
    megaMenu?.classList.remove('active');
    document.body.style.overflow = '';

    megaMenuToggle?.setAttribute('aria-expanded', 'false');
    megaMenu?.setAttribute('aria-hidden', 'true');
  }

  megaMenuToggle?.addEventListener('click', toggleMegaMenu);

  // メニュー内リンクをクリックで閉じる
  megaMenuLinks.forEach(link => {
    link.addEventListener('click', closeMegaMenu);
  });

  // ESCキーでメガメニューを閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && megaMenu?.classList.contains('active')) {
      closeMegaMenu();
    }
  });

  // メガメニュー背景クリックで閉じる
  megaMenu?.addEventListener('click', (e) => {
    if (e.target === megaMenu) {
      closeMegaMenu();
    }
  });

  // ========================================
  // Smooth Scroll
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // Scroll Reveal Animation (IntersectionObserver)
  // ========================================
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    if (!reveals.length) return;

    // prefers-reduced-motion対応
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach(el => el.classList.add('active'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // スタガーアニメーション用のディレイ
          const delay = entry.target.dataset.delay || 0;

          setTimeout(() => {
            entry.target.classList.add('active');
          }, delay);

          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    reveals.forEach(el => revealObserver.observe(el));
  }

  // ========================================
  // Stagger Animation for Children
  // ========================================
  function initStaggerAnimation() {
    const staggerContainers = document.querySelectorAll('[data-stagger]');

    staggerContainers.forEach(container => {
      const children = container.children;
      const delay = parseInt(container.dataset.stagger) || 100;

      Array.from(children).forEach((child, index) => {
        child.style.transitionDelay = `${index * delay}ms`;
      });
    });
  }

  // ========================================
  // Gallery 3D Carousel - 立体的なカルーセル
  // ※WordPress連携時: REST APIで画像データを取得可能
  // ========================================
  class Gallery3DCarousel {
    constructor(container) {
      this.container = container;
      this.slider = container?.querySelector('.gallery-3d-slider');
      this.items = container?.querySelectorAll('.gallery-3d-item') || [];
      this.prevBtn = container?.querySelector('.gallery-3d-prev');
      this.nextBtn = container?.querySelector('.gallery-3d-next');
      this.dotsContainer = container?.querySelector('.gallery-3d-dots');

      this.currentIndex = 0;
      this.width = 0;
      this.height = 0;
      this.totalWidth = 0;
      this.margin = 15;
      this.autoplayInterval = null;
      this.autoplayDelay = 4000; // 4秒

      if (this.slider && this.items.length > 0) {
        this.init();
      }
    }

    init() {
      this.resize();
      this.move(Math.floor(this.items.length / 2));
      this.createDots();
      this.bindEvents();
      this.startAutoplay();
    }

    resize() {
      // レスポンシブサイズ計算
      const viewportWidth = window.innerWidth;

      if (viewportWidth <= 480) {
        this.margin = 8;
        this.width = 240 + (this.margin * 2);
        this.height = 165;
      } else if (viewportWidth <= 768) {
        this.margin = 10;
        this.width = 280 + (this.margin * 2);
        this.height = 190;
      } else if (viewportWidth <= 1024) {
        this.margin = 12;
        this.width = 320 + (this.margin * 2);
        this.height = 220;
      } else {
        this.margin = 15;
        this.width = 380 + (this.margin * 2);
        this.height = 260;
      }

      this.totalWidth = this.width * this.items.length;
      this.slider.style.width = this.totalWidth + 'px';

      this.items.forEach(item => {
        item.style.width = (this.width - (this.margin * 2)) + 'px';
        item.style.height = this.height + 'px';
      });

      // 現在位置を再計算
      if (this.currentIndex > 0) {
        this.moveInstant(this.currentIndex);
      }
    }

    move(index) {
      // インデックスの循環処理
      if (index < 1) index = this.items.length;
      if (index > this.items.length) index = 1;
      this.currentIndex = index;

      // 各アイテムの3D変換を適用
      this.items.forEach((item, i) => {
        const frame = item.querySelector('.gallery-3d-frame');

        // アクティブクラスの管理
        item.classList.remove('gallery-3d-item--active');

        if (i === (index - 1)) {
          item.classList.add('gallery-3d-item--active');
          frame.style.transform = 'perspective(1200px)';
        } else {
          // 左側は40度、右側は-40度回転
          const rotateY = i < (index - 1) ? 40 : -40;
          frame.style.transform = `perspective(1200px) rotateY(${rotateY}deg)`;
        }
      });

      // スライダー全体の位置を調整（中央に配置）
      const containerWidth = this.container.offsetWidth;
      const offset = -((index - 1) * this.width) - (this.width / 2) + (containerWidth / 2);
      this.slider.style.transform = `translate3d(${offset}px, 0, 0)`;

      this.updateDots();
    }

    moveInstant(index) {
      // アニメーションなしで即座に移動
      this.slider.style.transition = 'none';
      this.move(index);

      // 強制リフロー後にトランジションを戻す
      void this.slider.offsetHeight;
      this.slider.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
    }

    createDots() {
      if (!this.dotsContainer) return;

      this.dotsContainer.innerHTML = '';

      for (let i = 0; i < this.items.length; i++) {
        const dot = document.createElement('button');
        dot.classList.add('gallery-3d-dot');
        dot.setAttribute('aria-label', `スライド ${i + 1}`);
        dot.addEventListener('click', () => {
          this.move(i + 1);
          this.resetAutoplay();
        });
        this.dotsContainer.appendChild(dot);
      }

      this.dots = this.dotsContainer.querySelectorAll('.gallery-3d-dot');
      this.updateDots();
    }

    updateDots() {
      if (!this.dots) return;

      this.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === (this.currentIndex - 1));
      });
    }

    bindEvents() {
      // ナビゲーションボタン
      this.prevBtn?.addEventListener('click', () => this.prev());
      this.nextBtn?.addEventListener('click', () => this.next());

      // リサイズ対応
      window.addEventListener('resize', debounce(() => this.resize(), 200));

      // キーボード操作
      this.container?.setAttribute('tabindex', '0');
      this.container?.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          this.prev();
        } else if (e.key === 'ArrowRight') {
          this.next();
        }
      });

      // ホバー時にオートプレイを停止
      this.container?.addEventListener('mouseenter', () => this.stopAutoplay());
      this.container?.addEventListener('mouseleave', () => this.startAutoplay());
    }

    prev() {
      this.move(this.currentIndex - 1);
      this.resetAutoplay();
    }

    next() {
      this.move(this.currentIndex + 1);
      this.resetAutoplay();
    }

    startAutoplay() {
      this.stopAutoplay();
      this.autoplayInterval = setInterval(() => {
        this.move(this.currentIndex + 1);
      }, this.autoplayDelay);
    }

    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    }

    resetAutoplay() {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  // ユーティリティ関数
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 3Dギャラリーカルーセルの初期化
  const gallery3DContainer = document.querySelector('.gallery-3d');
  if (gallery3DContainer) {
    new Gallery3DCarousel(gallery3DContainer);
  }

  // ========================================
  // News List - もっと見る
  // ========================================
  const newsMoreBtn = document.querySelector('.news-more');
  const newsItems = document.querySelectorAll('.news-item');
  const initialNewsCount = 5;

  if (newsMoreBtn && newsItems.length > initialNewsCount) {
    newsItems.forEach((item, index) => {
      if (index >= initialNewsCount) {
        item.style.display = 'none';
      }
    });

    newsMoreBtn.addEventListener('click', () => {
      newsItems.forEach((item, index) => {
        if (index >= initialNewsCount) {
          item.style.display = '';
          item.style.animation = 'fadeInUp 0.5s ease forwards';
          item.style.animationDelay = `${(index - initialNewsCount) * 0.1}s`;
        }
      });
      newsMoreBtn.style.display = 'none';
    });
  } else if (newsMoreBtn) {
    newsMoreBtn.style.display = 'none';
  }

  // ========================================
  // Form Validation
  // ========================================
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    // リアルタイムバリデーション
    const inputs = contactForm.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateField(input);
        }
      });
    });

    function validateField(field) {
      const value = field.value.trim();
      let isValid = true;
      let errorMessage = '';

      // 必須チェック
      if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${field.dataset.label || field.name}を入力してください`;
      }

      // メールアドレス形式チェック
      if (isValid && field.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          isValid = false;
          errorMessage = '正しいメールアドレスを入力してください';
        }
      }

      // 電話番号形式チェック
      if (isValid && field.type === 'tel' && value) {
        const telPattern = /^[0-9\-]+$/;
        if (!telPattern.test(value)) {
          isValid = false;
          errorMessage = '正しい電話番号を入力してください';
        }
      }

      // エラー表示
      const errorElement = field.parentElement?.querySelector('.field-error');

      if (!isValid) {
        field.classList.add('error');
        if (errorElement) {
          errorElement.textContent = errorMessage;
          errorElement.style.display = 'block';
        }
      } else {
        field.classList.remove('error');
        if (errorElement) {
          errorElement.textContent = '';
          errorElement.style.display = 'none';
        }
      }

      return isValid;
    }

    contactForm.addEventListener('submit', function(e) {
      let isValid = true;
      const requiredFields = this.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault();
        return;
      }

      // バリデーション通過 → 送信ボタンを「送信中...」に変更し、フォームをそのまま送信
      const submitBtn = this.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = '送信中...';
        submitBtn.disabled = true;
      }
      // FormSubmit.coへPOST送信 → _next で thank-you.html にリダイレクト
    });
  }

  // ========================================
  // Current Year in Footer
  // ========================================
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });

  // ========================================
  // Lazy Loading Images
  // ========================================
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');

      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;

            // フェードイン効果
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';

            img.src = img.dataset.src;
            img.onload = () => {
              img.style.opacity = '1';
            };

            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  // ========================================
  // Page Top Button
  // ========================================
  function initPageTop() {
    const pageTopBtn = document.querySelector('.page-top');
    if (!pageTopBtn) return;

    function togglePageTopBtn() {
      if (window.scrollY > 300) {
        pageTopBtn.classList.add('visible');
      } else {
        pageTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', togglePageTopBtn, { passive: true });

    pageTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ========================================
  // Parallax Effect (Micro)
  // ========================================
  // ========================================
  // Business: ボタンホバー時に全体反応
  // ========================================
  function initBusinessHover() {
    document.querySelectorAll('.business-item-link').forEach(link => {
      const item = link.closest('.business-item');
      if (!item) return;
      link.addEventListener('mouseenter', () => item.classList.add('link-hover'));
      link.addEventListener('mouseleave', () => item.classList.remove('link-hover'));
    });
  }

  function initParallax() {
    // prefers-reduced-motion対応
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (!parallaxElements.length) return;

    function updateParallax() {
      const scrollY = window.scrollY;

      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          const yPos = -(scrollY * speed);
          el.style.transform = `translateY(${yPos}px)`;
        }
      });
    }

    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(() => {
          updateParallax();
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  // ========================================
  // Text Animation (Split Text)
  // ========================================
  function initTextAnimation() {
    const animatedTexts = document.querySelectorAll('[data-text-animate]');

    animatedTexts.forEach(el => {
      const text = el.textContent;
      el.innerHTML = '';

      text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${index * 0.05}s`;
        span.classList.add('char');
        el.appendChild(span);
      });
    });
  }

  // ========================================
  // Counter Animation
  // ========================================
  function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');

    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.counter);
          const duration = parseInt(counter.dataset.duration) || 2000;
          const suffix = counter.dataset.suffix || '';

          animateCounter(counter, target, duration, suffix);
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(element, target, duration, suffix) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // イージング（ease-out）
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);

      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ========================================
  // External Links
  // ========================================
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // ========================================
  // Accessibility: Focus Visible
  // ========================================
  function initFocusVisible() {
    let hadKeyboardEvent = false;
    const keydownHandler = () => {
      hadKeyboardEvent = true;
    };

    document.addEventListener('keydown', keydownHandler);

    document.addEventListener('mousedown', () => {
      hadKeyboardEvent = false;
    });

    document.addEventListener('focusin', (e) => {
      if (hadKeyboardEvent) {
        e.target.classList.add('focus-visible');
      }
    });

    document.addEventListener('focusout', (e) => {
      e.target.classList.remove('focus-visible');
    });
  }

  // ========================================
  // Jet Ski Boost (Easter Egg)
  // ========================================
  function initJetSkiBoost() {
    const jetSki = document.querySelector('.jet-ski');
    if (!jetSki) return;

    let isBoosting = false;
    let boostOffset = 0;

    jetSki.addEventListener('click', (e) => {
      if (isBoosting) return;
      isBoosting = true;

      // 現在の方向を判定
      const computedStyle = window.getComputedStyle(jetSki);
      const transform = computedStyle.transform;
      const isGoingLeft = transform.includes('-1');

      // 加速エフェクト
      jetSki.classList.add('boosting');

      // 進行方向に少しだけ加速（translateXで追加移動）
      const boostAmount = isGoingLeft ? -80 : 80;
      boostOffset += boostAmount;
      jetSki.style.marginLeft = boostOffset + 'px';

      // 水しぶきエフェクト
      const parentRect = jetSki.parentElement.getBoundingClientRect();
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const splash = document.createElement('div');
          splash.className = 'jet-ski-splash';
          const jetRect = jetSki.getBoundingClientRect();
          splash.style.left = (jetRect.left - parentRect.left + 40) + 'px';
          splash.style.top = '-15px';
          jetSki.parentElement.appendChild(splash);
          setTimeout(() => splash.remove(), 600);
        }, i * 100);
      }

      // エフェクト終了
      setTimeout(() => {
        jetSki.classList.remove('boosting');
        isBoosting = false;
      }, 500);
    });
  }

  // ========================================
  // Initialize on DOM Ready
  // ========================================
  document.addEventListener('DOMContentLoaded', () => {
    // 初期化関数を実行
    initLoader();
    initCustomCursor();
    initRevealAnimations();
    initStaggerAnimation();
    initLazyLoading();
    initPageTop();
    initParallax();
    initTextAnimation();
    initCounterAnimation();
    initFocusVisible();
    initJetSkiBoost();
    initBusinessHover();
    initRecruitPopup();

    // ページ読み込み完了
    document.body.classList.add('loaded');
  });

  // ========================================
  // Performance: Debounce & Throttle
  // ========================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // グローバルに公開（必要に応じて）
  window.IDEA = {
    debounce,
    throttle
  };

  // ========================================
  // 採用ポップアップ（recruit.html以外で表示）
  // ========================================
  function initRecruitPopup() {
    // recruit.html / contact.html / thank-you.html では表示しない
    const path = window.location.pathname;
    if (path.includes('recruit') || path.includes('contact') || path.includes('thank-you')) return;

    // スタイルを追加
    const style = document.createElement('style');
    style.textContent = `
      .recruit-popup {
        position: fixed;
        top: 120px;
        right: 20px;
        z-index: 9999;
        animation: recruitPopupBounce 2s ease-in-out infinite;
        transition: opacity 0.5s ease;
      }

      /* 動画再生中は透過（クリックは常に有効） */
      .recruit-popup.video-playing {
        opacity: 0.35;
        animation: none;
      }

      .recruit-popup.video-playing:hover {
        opacity: 0.9;
      }

      .recruit-popup-link {
        display: flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
        color: #fff;
        padding: 18px 28px;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 700;
        font-size: 17px;
        box-shadow: 0 4px 20px rgba(21, 101, 192, 0.5);
        transition: all 0.3s ease;
        white-space: nowrap;
      }

      .recruit-popup-link:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 30px rgba(21, 101, 192, 0.6);
        color: #fff;
      }

      .recruit-popup-icon {
        width: 20px;
        height: 20px;
        animation: recruitIconPulse 1s ease-in-out infinite;
      }

      .recruit-popup-close {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 28px;
        height: 28px;
        background: #333;
        color: #fff;
        border: 2px solid #fff;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        line-height: 1;
        transition: background 0.3s, transform 0.3s;
        z-index: 1;
      }

      .recruit-popup-close:hover {
        background: #e53935;
        transform: scale(1.1);
      }

      @keyframes recruitPopupBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }

      @keyframes recruitIconPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }

      @media (max-width: 768px) {
        .recruit-popup {
          top: auto;
          bottom: 90px;
          right: 20px;
        }

        .recruit-popup-link {
          padding: 12px 18px;
          font-size: 14px;
        }
      }
    `;
    document.head.appendChild(style);

    // ページごとに採用リンク先を切り替え
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    let recruitLink = './recruit.html';
    if (currentPage === 'happiness.html') {
      recruitLink = './recruit-happiness.html';
    } else if (currentPage === 'crankup.html' || currentPage === 'digicare.html' || currentPage === 'marketing.html') {
      recruitLink = './recruit-crankup.html';
    }

    // HTML要素を追加
    const popup = document.createElement('div');
    popup.className = 'recruit-popup';
    popup.innerHTML = `
      <a href="${recruitLink}" class="recruit-popup-link">
        <svg class="recruit-popup-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        採用はコチラ！
      </a>
      <button class="recruit-popup-close" aria-label="閉じる">×</button>
    `;
    document.body.appendChild(popup);

    // 閉じるボタン
    const closeBtn = popup.querySelector('.recruit-popup-close');
    closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
      // セッション中は非表示を維持
      sessionStorage.setItem('recruitPopupClosed', 'true');
    });

    // セッション中に閉じた場合は非表示
    if (sessionStorage.getItem('recruitPopupClosed') === 'true') {
      popup.style.display = 'none';
    }

    // 動画再生中は透過させる
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
      heroVideo.addEventListener('play', () => {
        popup.classList.add('video-playing');
      });

      heroVideo.addEventListener('pause', () => {
        popup.classList.remove('video-playing');
      });

      heroVideo.addEventListener('ended', () => {
        popup.classList.remove('video-playing');
      });

      // 初期状態で再生中かチェック
      if (!heroVideo.paused && !heroVideo.ended) {
        popup.classList.add('video-playing');
      }
    }
  }

})();
