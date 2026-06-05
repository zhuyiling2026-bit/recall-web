import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import {
  BookOpen,
  Link2,
  Tag,
  Bell,
  BarChart3,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { getToken } from '../lib/supabase';
import styles from './Landing.module.css';

const BUBBLE_COUNT = 18;
const MOUSE_RADIUS = 150;
const MAX_SPEED = 3;
const BASE_SPEED = 0.8;
const REPEL_STRENGTH = 0.5;
const DECAY = 0.98;

function useBubbles(containerRef) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf;
    let bubbles = [];
    let divs = [];
    let cleanup = false;

    const init = () => {
      const rect = el.getBoundingClientRect();
      const W = rect.width || window.innerWidth;
      const H = rect.height || window.innerHeight;
      if (W === 0 || H === 0) { raf = requestAnimationFrame(init); return; }

      for (let i = 0; i < BUBBLE_COUNT; i++) {
        const size = 40 + Math.random() * 80;
        const b = { x: Math.random() * (W - size), y: Math.random() * (H - size), vx: (Math.random() - 0.5) * BASE_SPEED * 2, vy: (Math.random() - 0.5) * BASE_SPEED * 2, size };
        bubbles.push(b);
        const d = document.createElement('div');
        d.className = styles.bubblePhys;
        d.style.width = `${size}px`;
        d.style.height = `${size}px`;
        d.style.transform = `translate(${b.x}px, ${b.y}px)`;
        d.style.willChange = 'transform';
        el.appendChild(d);
        divs.push(d);
      }

      const mouse = { x: -999, y: -999 };
      const onMove = (e) => { const r = el.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
      const onLeave = () => { mouse.x = -999; mouse.y = -999; };
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseleave', onLeave);

      const tick = () => {
        if (cleanup) return;
        for (let i = 0; i < bubbles.length; i++) {
          const b = bubbles[i];
          const dx = b.x + b.size / 2 - mouse.x;
          const dy = b.y + b.size / 2 - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0.1) { const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * REPEL_STRENGTH; b.vx += (dx / dist) * force; b.vy += (dy / dist) * force; }
          b.vx *= DECAY; b.vy *= DECAY;
          b.vx += (Math.random() - 0.5) * 0.05; b.vy += (Math.random() - 0.5) * 0.05;
          const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
          if (speed > MAX_SPEED) { b.vx = (b.vx / speed) * MAX_SPEED; b.vy = (b.vy / speed) * MAX_SPEED; }
          else if (speed < 0.2) { const a = Math.random() * Math.PI * 2; b.vx += Math.cos(a) * 0.1; b.vy += Math.sin(a) * 0.1; }
          b.x += b.vx; b.y += b.vy;
          if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx); }
          if (b.x > W - b.size) { b.x = W - b.size; b.vx = -Math.abs(b.vx); }
          if (b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy); }
          if (b.y > H - b.size) { b.y = H - b.size; b.vy = -Math.abs(b.vy); }
          divs[i].style.transform = `translate(${b.x}px, ${b.y}px)`;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      const onResize = () => { const r2 = el.getBoundingClientRect(); for (let i = 0; i < bubbles.length; i++) { bubbles[i].x = Math.min(bubbles[i].x, r2.width - bubbles[i].size); bubbles[i].y = Math.min(bubbles[i].y, r2.height - bubbles[i].size); } };
      window.addEventListener('resize', onResize);
    };
    raf = requestAnimationFrame(init);

    return () => {
      cleanup = true;
      cancelAnimationFrame(raf);
      divs.forEach((d) => d.remove());
    };
  }, []);
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function Blobs() {
  return (
    <div className={styles.blobs}>
      <motion.div className={styles.blob1} animate={{ x: [0, 40, -20, 0], y: [0, -30, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />
      <motion.div className={styles.blob2} animate={{ x: [0, -30, 50, 0], y: [0, 20, -40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
    </div>
  );
}

const PLATFORM_ROWS = [
  [
    { name: '小红书', domain: 'xiaohongshu.com', letter: '红' },
    { name: '抖音', domain: 'douyin.com', letter: '抖' },
    { name: 'B站', domain: 'bilibili.com', letter: 'B' },
    { name: 'YouTube', domain: 'youtube.com', letter: 'Y' },
    { name: '微信公众号', domain: 'weixin.qq.com', letter: '微' },
    { name: '知乎', domain: 'zhihu.com', letter: '知' },
  ],
  [
    { name: 'Twitter', domain: 'twitter.com', letter: 'X' },
    { name: '微博', domain: 'weibo.com', letter: '博' },
    { name: '豆瓣', domain: 'douban.com', letter: '豆' },
    { name: '即刻', domain: 'jike.com', letter: '即' },
    { name: '得到', domain: 'dedao.cn', letter: '得' },
    { name: '任意网页', domain: 'any website', letter: '网' },
  ],
];

function Pill({ p }) {
  return (
    <div className={styles.platformPill}>
      <span className={styles.pillIcon}>{p.letter}</span>
      <span className={styles.pillName}>{p.name}</span>
      <span className={styles.pillDomain}>{p.domain}</span>
    </div>
  );
}

function MarqueeRow({ items, reverse }) {
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className={styles.marqueeTrackWrapper}>
      <div
        className={styles.marqueeTrack}
        style={{ animationDuration: reverse ? '50s' : '40s', animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {doubled.map((p, i) => <Pill key={i} p={p} />)}
        {doubled.map((p, i) => <Pill key={`b-${i}`} p={p} />)}
      </div>
    </div>
  );
}

const STEPS = [
  { num: '1', title: '复制链接', desc: '在小红书、抖音、YouTube 看到好内容，复制链接粘进来', phone: 'import' },
  { num: '2', title: 'AI 替你秒懂', desc: '自动提炼要点、生成摘要、智能分类，你不用动一根手指', phone: 'card' },
  { num: '3', title: '到点来提醒你', desc: '三天后 Recall 会提醒你回来，知识从「存过」变成「学会」', phone: 'notify' },
];

function StepShowcase({ inView }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(() => setActive((prev) => (prev + 1) % 3), 2500);
    return () => clearInterval(timer);
  }, [inView]);
  return (
    <div className={styles.stepShowcase}>
      <div className={styles.stepShowInner}>
        {/* Left */}
        <div className={styles.stepShowLeft}>
          <motion.h2 className={styles.stepShowTitle} initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
            从收藏到真正学会，就这三步
          </motion.h2>
          <div className={styles.stepCards}>
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className={`${styles.stepCard} ${active === i ? styles.stepCardActive : ''}`}
                onMouseEnter={() => setActive(i)}
              >
                <div className={styles.stepCardNum}>{s.num}</div>
                <div className={styles.stepCardBody}>
                  <h3 className={styles.stepCardTitle}>{s.title}</h3>
                  <p className={styles.stepCardDesc}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right: phone mockup */}
        <div className={styles.stepShowRight}>
          <div className={styles.phoneFrame}>
            <div className={styles.phoneNotch} />
            <div className={styles.phoneScreen}>
              {/* Step 1: import */}
              <div className={styles.phoneView} style={{ opacity: active === 0 ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                <p className={styles.phoneLabel}>粘贴链接</p>
                <div className={styles.phoneInputRow}>
                  <div className={styles.phoneInput}><Link2 size={12} color="#C07A80" /><span>https://www.bilibili.com/video/...</span></div>
                  <div className={styles.phoneImportBtn}>导入</div>
                </div>
                <p className={styles.phoneLabel}>AI 正在分析…</p>
                <div className={styles.phoneSkel}>
                  <div className={styles.phoneSkelLine} />
                  <div className={styles.phoneSkelLine} style={{ width: '70%' }} />
                  <div className={styles.phoneSkelLine} style={{ width: '45%' }} />
                </div>
              </div>
              {/* Step 2: card */}
              <div className={styles.phoneView} style={{ opacity: active === 1 ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                <div className={styles.phoneCardView}>
                  <span className={styles.phoneCardNum}>01</span>
                  <div>
                    <p className={styles.phoneCardTitle}>深入理解 React 并发模式</p>
                    <p className={styles.phoneCardSum}>并发渲染是 React 18 最重要的更新，让 UI 在渲染过程中保持响应</p>
                    <div className={styles.phoneCardTags}>
                      <span className={styles.phoneTag}>学习</span>
                      <span className={styles.phoneTag}>React</span>
                      <span className={styles.phoneTag}>前端</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Step 3: notify */}
              <div className={styles.phoneView} style={{ opacity: active === 2 ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                <div className={styles.phoneNotifBanner}>
                  <Bell size={14} color="#D4AF37" />
                  <span>你有 3 条内容等待回顾</span>
                </div>
                <div className={styles.phoneNotifList}>
                  <div className={styles.phoneNotifItem}>
                    <span className={styles.phoneNotifDot} style={{ background: '#C07A80' }} />
                    <span className={styles.phoneNotifText}>深入理解 React 并发模式</span>
                    <span className={styles.phoneNotifBadge} style={{ color: '#C07A80', background: '#FDF2F3' }}>3天未读</span>
                  </div>
                  <div className={styles.phoneNotifItem}>
                    <span className={styles.phoneNotifDot} style={{ background: '#D4AF37' }} />
                    <span className={styles.phoneNotifText}>TypeScript 高级类型技巧</span>
                    <span className={styles.phoneNotifBadge} style={{ color: '#D4AF37', background: '#FDF8ED' }}>7天未读</span>
                  </div>
                  <div className={styles.phoneNotifItem}>
                    <span className={styles.phoneNotifDot} style={{ background: '#6DA57C' }} />
                    <span className={styles.phoneNotifText}>设计模式在业务中的应用</span>
                    <span className={styles.phoneNotifBadge} style={{ color: '#6DA57C', background: '#EDF6F0' }}>已读</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, bgClass, title, desc, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={`${styles.featureCard} ${bgClass}`}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8 }}
    >
      <motion.div className={styles.featureIcon} whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }} transition={{ duration: 0.5 }}>
        {icon}
      </motion.div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{desc}</p>
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const authed = !!getToken();
  const [titleChars] = useState(() => 'Recall'.split(''));

  const heroRef = useRef(null);
  const bubbleRef = useRef(null);
  const bubbleRef2 = useRef(null);
  useBubbles(bubbleRef);
  useBubbles(bubbleRef2);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' });
  const platformsRef = useRef(null);
  const platformsInView = useInView(platformsRef, { once: true, margin: '-100px' });
  const stepsRef = useRef(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '-100px' });

  return (
    <div className={styles.page}>

      {/* Top bar */}
      <motion.div className={styles.topBar} initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <a href="/" className={styles.topBrand}><BookOpen size={24} strokeWidth={1.5} /><span>Recall</span></a>
        <div className={styles.topActions}>
          <button className={styles.loginBtn} onClick={() => navigate(authed ? '/app' : '/login')}>{authed ? '进入应用' : '登录'}</button>
        </div>
      </motion.div>

      {/* Hero */}
      <motion.section ref={heroRef} className={styles.hero} style={{ opacity: heroOpacity }}>
        <Blobs />
        <div ref={bubbleRef} className={styles.bubblesLayer} />
        <motion.div className={styles.heroGrid} style={{ y: heroY, zIndex: 1, position: 'relative' }}>

          <div className={styles.heroLeft}>
            <motion.div className={styles.heroPill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} style={{ display: 'inline-flex' }}><Sparkles size={14} color="#D4AF37" /></motion.span>
              <span>你的收藏夹还在吃灰吗</span>
            </motion.div>
            <h1 className={styles.brandName}>
              {titleChars.map((ch, i) => (
                <motion.span key={i} className={styles.brandChar} initial={{ opacity: 0, y: 60, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.6, delay: 0.7 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}>{ch}</motion.span>
              ))}
            </h1>
            <motion.p className={styles.tagline} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.5 }}>
              AI 帮你整理收藏，并在合适的时候提醒你回来看
            </motion.p>
            <motion.p className={styles.taglineSub} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.7 }}>
              收藏、整理、回顾——让你的每一个灵感都有归处
            </motion.p>
            <motion.div className={styles.cta} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 2.0 }}>
              <motion.button className={styles.ctaBtn} onClick={() => navigate(authed ? '/app' : '/login')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <span>粘贴一个链接试试</span>
                <motion.span style={{ display: 'inline-flex', marginLeft: 8 }} animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ArrowRight size={20} /></motion.span>
              </motion.button>
              <motion.div className={styles.ctaGlow} animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.2, 0.4] }} transition={{ duration: 3, repeat: Infinity }} />
            </motion.div>
          </div>

          <motion.div className={styles.heroRight} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <div className={styles.demoCard}>
              <div className={styles.demoCardInner}>
                <div className={styles.demoTitleBar}><div className={styles.demoDots}><span className={styles.demoWinDot} /><span className={styles.demoWinDot} /><span className={styles.demoWinDot} /></div></div>
                <div className={styles.demoImportBar}><div className={styles.demoInput}><Link2 size={12} color="#C07A80" /><span>https://bilibili.com/video/BV1xx…</span></div><div className={styles.demoImportBtn}>导入</div></div>
                <motion.div className={styles.demoProcessing} animate={{ height: [0, 36, 36, 0], opacity: [0, 1, 1, 0], marginBottom: [0, 12, 12, 0] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.1, 0.35, 0.5] }}>
                  <div className={styles.demoProcInner}><motion.span className={styles.demoSpinner} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} /><span>AI 正在解析内容…</span></div>
                </motion.div>
                <div className={styles.demoTabs}>{['全部', '学习', '职业', '兴趣', '生活'].map((t, i) => (<span key={t} className={i === 0 ? styles.demoTabActive : styles.demoTab}>{t}</span>))}</div>
                <motion.div className={styles.demoContentCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: [0, 0, 1], y: [20, 20, 0] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.4, 1] }}>
                  <span className={styles.demoCardNum}>01</span>
                  <div className={styles.demoCardBody}>
                    <div className={styles.demoCardHeaderRow}><h4 className={styles.demoCardTitle}>深入理解 React 并发模式</h4><span className={styles.demoCardBadge}>new</span></div>
                    <p className={styles.demoCardSummary}>并发渲染是 React 18 最重要的更新，让 UI 在渲染过程中保持响应</p>
                    <div className={styles.demoCardMeta}><span className={styles.demoCardCat}>技术</span><span className={styles.demoCardTag}>React</span><span className={styles.demoCardTag}>前端</span></div>
                  </div>
                  <div className={styles.demoCardActions}><span className={styles.demoActionIcon}>&#8599;</span><span className={styles.demoActionIcon}>&#10003;</span></div>
                </motion.div>
                <div className={styles.demoStats}>
                  <div className={styles.demoStat}><span className={styles.demoStatVal}>1</span><span className={styles.demoStatLabel}>未读</span></div>
                  <div className={styles.demoStat}><span className={styles.demoStatVal}>0</span><span className={styles.demoStatLabel}>已读</span></div>
                  <div className={styles.demoStat}><span className={styles.demoStatVal}>0</span><span className={styles.demoStatLabel}>待回顾</span></div>
                  <div className={styles.demoStat}><span className={styles.demoStatVal}>1</span><span className={styles.demoStatLabel}>总计</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className={styles.scrollHint} initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{ opacity: { delay: 3 }, y: { duration: 2, repeat: Infinity } }}><span /></motion.div>
      </motion.section>

      {/* Features */}
      <div className={styles.screenSection}>
      <section ref={featuresRef} className={styles.featuresSection}>
        <motion.div initial="hidden" animate={featuresInView ? 'show' : 'hidden'} variants={stagger}>
          <motion.h2 className={styles.sectionTitle} variants={fadeUp}>收藏夹吃灰，是因为没有人提醒你</motion.h2>
          <motion.p className={styles.sectionSub} variants={fadeUp}>Recall 不只存内容，它会在对的时间推着你去消化</motion.p>
        </motion.div>
        <div className={styles.grid}>
          <FeatureCard index={0} icon={<Link2 size={26} color="#C07A80" />} bgClass={styles.iconPink} title="刷到就存，一秒收藏" desc="复制链接粘贴进来，AI 自动提取标题和摘要" />
          <FeatureCard index={1} icon={<Tag size={26} color="#6DA57C" />} bgClass={styles.iconGreen} title="不用整理，自动归类" desc="学习、职业、娱乐、生活，AI 替你分好" />
          <FeatureCard index={2} icon={<Bell size={26} color="#D4AF37" />} bgClass={styles.iconGold} title="到时间了，轻轻提醒你" desc="3天、7天、30天周期提醒，确保好内容真的被消化" />
          <FeatureCard index={3} icon={<BarChart3 size={26} color="#5B7EB5" />} bgClass={styles.iconBlue} title="一眼看清吸收了多少" desc="未读、已读、待回顾，知识到底进没进大脑" />
        </div>
      </section>
      </div>

      {/* Platforms Marquee */}
      <div className={styles.screenSectionShort}>
      <section ref={platformsRef} className={styles.platformsSectionMarquee}>
        <motion.div initial="hidden" animate={platformsInView ? 'show' : 'hidden'} variants={stagger}>
          <motion.h2 className={styles.sectionTitle} variants={fadeUp}>好内容到处都是，却从来找不到</motion.h2>
          <motion.p className={styles.sectionSub} variants={fadeUp}>小红书的帖子、B站的视频、公众号文章、YouTube教程——Recall 是你唯一的收件箱</motion.p>
        </motion.div>

        {/* Row 1: left to right */}
        <motion.div initial={{ opacity: 0 }} animate={platformsInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.3 }}>
          <MarqueeRow items={PLATFORM_ROWS[0]} />
        </motion.div>

        {/* Row 2: right to left */}
        <motion.div initial={{ opacity: 0 }} animate={platformsInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.5 }}>
          <MarqueeRow items={PLATFORM_ROWS[1]} reverse />
        </motion.div>

        <motion.p className={styles.platformBottom} initial={{ opacity: 0, y: 20 }} animate={platformsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.8 }}>
          <span className={styles.bottomDash} />
          不管内容从哪来，统一进 Recall，AI 自动整理，到点提醒你消化
          <span className={styles.bottomDash} />
        </motion.p>
      </section>
      </div>

      {/* How it works */}
      <div ref={stepsRef} className={styles.screenSection}>
      <StepShowcase inView={stepsInView} />
      </div>

      {/* CTA */}
      <div className={styles.ctaSection}>
        <div ref={bubbleRef2} className={styles.bubblesLayer} />
        <Blobs />
        <motion.div className={styles.ctaContent} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }}>
          <p className={styles.ctaStat}>已有 10,000+ 条内容被从收藏夹里救回来</p>
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} style={{ marginBottom: 24 }}>
            <Sparkles size={40} color="#D4AF37" />
          </motion.div>
          <h2 className={styles.ctaTitleBig}>让每一次收藏，都变成你的知识</h2>
          <motion.button className={styles.ctaBtn} onClick={() => navigate(authed ? '/app' : '/login')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={{ marginTop: 40 }}>
            现在就救它们
            <motion.span style={{ display: 'inline-flex', marginLeft: 8 }} animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ArrowRight size={20} /></motion.span>
          </motion.button>
          <div className={styles.ctaBadges}>
            <span className={styles.ctaBadge}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6DA57C" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> 免费使用</span>
            <span className={styles.ctaBadge}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6DA57C" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> 无需下载</span>
            <span className={styles.ctaBadge}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6DA57C" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> 30秒上手</span>
          </div>
        </motion.div>
      </div>

      <footer className={styles.footer}>Recall &middot; your content companion</footer>
    </div>
  );
}
