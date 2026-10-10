import { useEffect, useState } from "react";
import "./App.css";
import ActivityCard from "./components/ActivityCard.jsx";
import Icon from "./components/Icon.jsx";
import MapView from "./views/MapView.jsx";
import artPoster from "./assets/images/当世界名画成为海报_艺术与设计的融合_1_Sunyao_来自小红书网页版.jpg";
import afroPoster from "./assets/images/🔥上海AFRO_派对重磅来袭❗️_1_Fullmoon_SH_来自小红书网页版.jpg";
import salonPoster from "./assets/images/5_17_上海小众活动｜黑灯瞎会vol.31_1_有个局FUNCO_来自小红书网页版.jpg";
import fleaPoster from "./assets/images/跳藻二手七月场｜摊主招募LAST_CALL🎺_1_蚤上好二手（跳藻附.jpg";

const categories = ["休闲文娱", "兴趣派对", "轻社交沙龙", "快闪市集"];
const views = ["home", "map", "publish", "mine"];

const activities = [
  { id: 1, title: "当世界名画成为海报", date: "2026.06.11 — 2026.12.31", city: "上海", venue: "保利时光里 · 艺术空间", category: "休闲文娱", image: artPoster },
  { id: 2, title: "上海 AFRO 派对", date: "2026.07.04 22:30 — 02:30", city: "上海", venue: "Fullmoon Club", category: "兴趣派对", image: afroPoster },
  { id: 3, title: "黑灯瞎会 vol.31", date: "2026.05.17 14:00 — 18:00", city: "上海", venue: "FUNCO 活动空间", category: "轻社交沙龙", image: salonPoster },
  { id: 4, title: "跳藻二手七月场", date: "2026.07.02 — 2026.07.05", city: "上海", venue: "HAI550 · 淮海中路550号", category: "快闪市集", image: fleaPoster },
];

function HomeView({ onViewChange, onActivitySelect }) {
  const [activeCategory, setActiveCategory] = useState("");
  const visibleActivities = activeCategory ? activities.filter((activity) => activity.category === activeCategory) : activities;
  return (
    <>
      <section className="hero"><div><p className="hero__eyebrow">CITY EXPLORER / 2026</p><h1>城市活动地图</h1><p className="hero__subtitle">看看今天附近有什么好玩的</p></div><div className="hero__orb">✦</div></section>
      <section className="category-bar"><p className="section-kicker">你想去哪里玩？</p><div className="category-list">{categories.map((category, index) => <button type="button" key={category} className={`category-button category-button--${index + 1} ${activeCategory === category ? "category-button--active" : ""}`} onClick={() => { setActiveCategory(category); onViewChange("map"); }}>{category}<span>0{index + 1} ↗</span></button>)}</div></section>
      <section className="activity-section"><div className="section-heading"><div><p className="section-kicker">CURATED FOR YOU</p><h2>附近正在发生</h2></div><button type="button" className="text-button" onClick={() => setActiveCategory("")}>查看全部 <Icon name="arrow" /></button></div><div className="activity-list">{visibleActivities.map((activity) => <ActivityCard key={activity.id} activity={activity} onSelect={onActivitySelect} />)}</div></section>
    </>
  );
}

function PublishView() {
  const [tab, setTab] = useState("activity");
  const [activityForm, setActivityForm] = useState({ name: "", time: "", location: "", category: "休闲文娱", allowInteraction: true });
  const [communityForm, setCommunityForm] = useState({ name: "", intro: "", cities: [] });
  const [cityInput, setCityInput] = useState("");
  const [notice, setNotice] = useState("");
  const [activitySubmitted, setActivitySubmitted] = useState(false);

  const showNotice = (message) => { setNotice(message); window.setTimeout(() => setNotice(""), 2600); };

  const submitActivity = (event) => {
    event.preventDefault();
    const { name, time, location } = activityForm;
    if (!name || !time || !location) {
      alert("请填写完整活动名称、时间、地点！");
      return;
    }
    showNotice("提交成功，等待审核");
    setActivitySubmitted(true);
    setActivityForm({ name: "", time: "", location: "", category: "休闲文娱", allowInteraction: true });
    window.setTimeout(() => setActivitySubmitted(false), 3000);
  };

  const submitCommunity = (event) => {
    event.preventDefault();
    const { name, cities } = communityForm;
    if (!name || cities.length === 0) {
      alert("请填写社群名称，并至少选择一个活动城市！");
      return;
    }
    showNotice("社群创建成功，等待审核");
    setCommunityForm({ name: "", intro: "", cities: [] });
    setCityInput("");
  }; // 注意！这里是submitCommunity的结束，下面没有额外的 };

  const addCity = () => {
    const city = cityInput.trim();
    if (city && !communityForm.cities.includes(city)) {
      setCommunityForm({ ...communityForm, cities: [...communityForm.cities, city] });
      setCityInput("");
    }
  };

  const removeCity = (city) => {
    setCommunityForm({ ...communityForm, cities: communityForm.cities.filter((c) => c !== city) });
  };

  // ========== 这里补上 return ！！==========
  return (
    <>
      <section className="form-view">
        <div className="page-heading">
          <p className="section-kicker">SHARE YOUR STORY</p>
          <h1>创建与发布</h1>
          <p>发布活动或创建社群，让更多人发现你。</p>
        </div>
        <div className="publish-tabs">
          <button type="button" className={`publish-tab ${tab === "activity" ? "publish-tab--active" : ""}`} onClick={() => setTab("activity")}>
            <span className="publish-tab__icon">+</span>
            <span className="publish-tab__title">发布活动</span>
            <span className="publish-tab__sub">让更多人找到你的派对</span>
          </button>
          <button type="button" className={`publish-tab ${tab === "community" ? "publish-tab--active" : ""}`} onClick={() => setTab("community")}>
            <span className="publish-tab__icon">+</span>
            <span className="publish-tab__title">创建社群</span>
            <span className="publish-tab__sub">建立你的同城兴趣圈</span>
          </button>
        </div>
        {tab === "activity" ? (
          <form className="publish-form" onSubmit={submitActivity}>
            <label>活动名称<input type="text" value={activityForm.name} onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })} placeholder="例如：周末城市漫步" /></label>
            <label>时间<input type="text" value={activityForm.time} onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })} placeholder="选择活动时间" /></label>
            <label>地点<input type="text" value={activityForm.location} onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })} placeholder="填写活动城市和场地" /></label>
            <label>活动类型<select value={activityForm.category} onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}>{categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}</select></label>
            <label className="checkbox-label"><input type="checkbox" checked={activityForm.allowInteraction} onChange={(e) => setActivityForm({ ...activityForm, allowInteraction: e.target.checked })} /><span>允许用户互评 / 互动</span></label>
            <label>活动海报<div className="upload-box"><Icon name="plus" /><span>点击上传活动海报</span><small>支持 JPG、PNG 格式（非必传）</small></div></label>
            <button type="submit" className={`primary-button ${activitySubmitted ? "primary-button--submitted" : ""}`} disabled={activitySubmitted}>{activitySubmitted ? "已提交，等待审核" : <>创建 <Icon name="arrow" /></>}</button>
          </form>
        ) : (
          <form className="publish-form" onSubmit={submitCommunity}>
            <label>社群名称<input type="text" value={communityForm.name} onChange={(e) => setCommunityForm({ ...communityForm, name: e.target.value })} placeholder="例如：CityBox 城市漫游群" /></label>
            <label>社群简介<input type="text" value={communityForm.intro} onChange={(e) => setCommunityForm({ ...communityForm, intro: e.target.value })} placeholder="一句话介绍，例如：一个面向大学生的城市探索社群" /></label>
            <label>社群头像<div className="upload-box"><Icon name="plus" /><span>点击上传社群图标</span><small>支持 JPG、PNG 格式（非必传）</small></div></label>
            <label>活动城市<div className="city-tag-input"><div className="city-tag-row">{communityForm.cities.map((city) => <span key={city} className="city-tag">{city}<button type="button" onClick={() => removeCity(city)} aria-label={`移除${city}`}>×</button></span>)}</div><div className="city-tag-add"><input type="text" value={cityInput} onChange={(e) => setCityInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCity(); } }} placeholder="输入城市名后回车添加" /><button type="button" onClick={addCity}>添加</button></div></div></label>
            <button type="submit" className="primary-button">创建社群 <Icon name="arrow" /></button>
          </form>
        )}
        {notice && <div className="detail-modal" role="status"><div className="detail-modal__box"><span className="detail-modal__check">✓</span><p>{notice}</p></div></div>}
      </section>
    </>
  )
}

const WEEK_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

const getScheduleDateKey = (activity) => {
  const token = String(activity?.date || "").trim().split(/\s+/)[0] || "";
  return token.replace(/[.]/g, "-").replace(/\//g, "-");
};

const pad2 = (value) => String(value).padStart(2, "0");

function ScheduleCalendar({ schedule }) {
  const eventsByDate = {};
  schedule.forEach((activity) => {
    const key = getScheduleDateKey(activity);
    if (!key) return;
    if (!eventsByDate[key]) eventsByDate[key] = [];
    if (!eventsByDate[key].some((item) => item.id === activity.id)) eventsByDate[key].push(activity);
  });
  const eventKeys = Object.keys(eventsByDate).sort();
  const today = new Date();
  const initialDate = eventKeys.length > 0 ? new Date(`${eventKeys[0]}T00:00:00`) : today;
  const [cursor, setCursor] = useState({ year: initialDate.getFullYear(), month: initialDate.getMonth() });
  const [selectedKey, setSelectedKey] = useState(eventKeys[0] || "");

  const shiftMonth = (delta) => {
    const next = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: next.getFullYear(), month: next.getMonth() });
  };

  const todayKey = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;
  const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay();
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const prevMonthDays = new Date(cursor.year, cursor.month, 0).getDate();
  const cells = [];
  for (let index = firstWeekday - 1; index >= 0; index -= 1) {
    cells.push({ day: prevMonthDays - index, inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, inMonth: true, key: `${cursor.year}-${pad2(cursor.month + 1)}-${pad2(day)}` });
  }
  let trailing = 1;
  while (cells.length < 42) {
    cells.push({ day: trailing, inMonth: false });
    trailing += 1;
  }

  const selectedEvents = selectedKey ? eventsByDate[selectedKey] || [] : [];
  const selectedDate = selectedKey ? new Date(`${selectedKey}T00:00:00`) : null;
  const selectedLabel = selectedDate ? `${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日 · 星期${WEEK_LABELS[selectedDate.getDay()]}` : "";

  return (
    <div className="schedule-calendar">
      <div className="cal-nav">
        <button type="button" className="cal-nav__btn" onClick={() => shiftMonth(-1)} aria-label="上个月"><Icon name="chevron-left" /></button>
        <h3 className="cal-nav__title">{cursor.year}年 {cursor.month + 1}月</h3>
        <button type="button" className="cal-nav__btn" onClick={() => shiftMonth(1)} aria-label="下个月"><Icon name="chevron-right" /></button>
      </div>
      <div className="cal-grid">
        {WEEK_LABELS.map((label) => <span key={label} className="cal-grid__head">{label}</span>)}
        {cells.map((cell, index) => {
          if (!cell.inMonth) return <span key={`muted-${index}`} className="cal-day cal-day--muted">{cell.day}</span>;
          const hasEvent = Boolean(eventsByDate[cell.key]);
          const isSelected = cell.key === selectedKey;
          const isToday = cell.key === todayKey;
          const classNames = ["cal-day", hasEvent ? "cal-day--event" : "", isSelected ? "cal-day--selected" : "", isToday ? "cal-day--today" : ""].filter(Boolean).join(" ");
          return (
            <button type="button" key={cell.key} className={classNames} onClick={() => setSelectedKey(cell.key)}>
              {cell.day}
              {hasEvent && <span className="cal-day__dot" />}
            </button>
          );
        })}
      </div>
      <div className="cal-events">
        <h4 className="cal-events__title">{selectedKey ? selectedLabel : "点击日历中的日期，查看当天安排"}</h4>
        {selectedKey ? (
          selectedEvents.length > 0 ? (
            <div className="cal-events__list">
              {selectedEvents.map((activity) => (
                <article key={activity.id} className="cal-event">
                  <img src={activity.image} alt={activity.title} loading="lazy" />
                  <div>
                    <h5>{activity.title}</h5>
                    <p>{activity.date}</p>
                    <p>{activity.city} · {activity.venue}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="cal-events__empty">当天没有安排</p>
          )
        ) : (
          <p className="cal-events__empty">还没有添加日程，去逛逛吧</p>
        )}
      </div>
    </div>
  );
}

function MineView({ onViewChange, mySchedule }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ account: "", password: "" });
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [ticketModal, setTicketModal] = useState(null);
  const [communityModal, setCommunityModal] = useState(null);
  const handleLogin = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    setShowLogin(false);
    setLoginForm({ account: "", password: "" });
  };
  const myTickets = [
    { id: 1, title: "当世界名画成为海报", date: "2026.06.11", venue: "保利时光里 · 上海", image: activities[0].image, code: "CB20260611A" },
    { id: 2, title: "上海 AFRO 派对", date: "2026.07.04", venue: "Fullmoon Club · 上海", image: activities[1].image, code: "CB20260704B" },
  ];
  const myCommunities = [
    { id: 1, name: "CityBox 城市漫游群", intro: "一个面向大学生的城市探索社群，每周发现新角落。", avatar: "🏙️", members: 1280 },
    { id: 2, name: "夜跑上海滩", intro: "每周三晚沿外滩跑步，用脚步丈量城市夜景。", avatar: "🏃", members: 642 },
  ];
  const drawers = [
    { key: "schedule", name: "我的日程", icon: "calendar", count: mySchedule.length, unit: "个安排" },
    { key: "tickets", name: "我参加的活动", icon: "ticket", count: myTickets.length, unit: "张票根" },
    { key: "communities", name: "我关注的社群", icon: "users", count: myCommunities.length, unit: "个社群" },
  ];
  const activeDrawerMeta = drawers.find((drawer) => drawer.key === activeDrawer);
  return (
    <section className="mine-view">
      <div className="page-heading">
        <p className="section-kicker">YOUR CITY DRAWER</p>
        <h1>我的活动抽屉</h1>
        <p>收藏和参与过的活动，都藏在这里。</p>
      </div>
      <div className="mine-auth">
        {isLoggedIn ? (
          <div className="mine-welcome mine-welcome--user">
            <div className="mine-user">
              <div className="mine-user__avatar"><span>探</span></div>
              <div className="mine-welcome__text">
                <p className="mine-welcome__greeting">City Box 探险家</p>
                <p className="mine-welcome__sub">继续探索这座城市吧</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mine-welcome">
            <div className="mine-welcome__text">
              <p className="mine-welcome__greeting">欢迎来到 City Box</p>
              <p className="mine-welcome__sub">登录后解锁日历、票根和社群</p>
            </div>
            <button type="button" className="mine-login-btn" onClick={() => setShowLogin(true)}>注册 / 登录</button>
          </div>
        )}
      </div>
      <div className="drawer-capsules">
        {drawers.map((drawer) => (
          <button type="button" key={drawer.key} className="drawer-capsule" onClick={() => setActiveDrawer(drawer.key)}>
            <span className="drawer-capsule__icon"><Icon name={drawer.icon} /></span>
            <span className="drawer-capsule__name">{drawer.name}</span>
            <span className="drawer-capsule__count">{drawer.count}{drawer.unit}</span>
          </button>
        ))}
      </div>
      <button type="button" className="primary-button discover-button" onClick={() => onViewChange("home")}>去发现活动 <Icon name="arrow" /></button>
      {showLogin && (
        <div className="mine-modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="login-modal__close" onClick={() => setShowLogin(false)} aria-label="关闭">×</button>
            <h2 className="login-modal__title">登录 City Box</h2>
            <p className="login-modal__subtitle">输入你的账号信息，开启城市探索之旅</p>
            <form className="login-form" onSubmit={handleLogin}>
              <label>手机号 / 邮箱<input type="text" value={loginForm.account} onChange={(e) => setLoginForm({ ...loginForm, account: e.target.value })} placeholder="请输入手机号或邮箱" required /></label>
              <label>密码<input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="请输入密码" required /></label>
              <button type="submit" className="login-modal__submit">登录 / 注册</button>
            </form>
            <p className="login-modal__terms">登录即代表同意<a href="#">《用户协议》</a>和<a href="#">《隐私政策》</a></p>
          </div>
        </div>
      )}
      {ticketModal && (
        <div className="mine-modal-overlay" onClick={() => setTicketModal(null)}>
          <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="login-modal__close" onClick={() => setTicketModal(null)} aria-label="关闭">×</button>
            <div className="ticket-modal__header">
              <img src={ticketModal.image} alt={ticketModal.title} className="ticket-modal__img" />
              <div>
                <h2>{ticketModal.title}</h2>
                <p>{ticketModal.date} · {ticketModal.venue}</p>
              </div>
            </div>
            <div className="ticket-modal__qr">
              <div className="qr-placeholder">
                <div className="qr-grid">
                  {[...Array(64)].map((_, i) => <span key={i} className={Math.random() > 0.5 ? "qr-cell--on" : ""} />)}
                </div>
                <p>电子票二维码</p>
              </div>
              <div className="ticket-modal__info">
                <p><span>票号</span><strong>{ticketModal.code}</strong></p>
                <p><span>状态</span><strong className="ticket-modal__valid">已确认</strong></p>
                <p><span>持票人</span><strong>City Box 探险家</strong></p>
              </div>
            </div>
            <p className="ticket-modal__tip">请在活动现场出示此二维码入场</p>
          </div>
        </div>
      )}
      {communityModal && (
        <div className="mine-modal-overlay" onClick={() => setCommunityModal(null)}>
          <div className="community-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="login-modal__close" onClick={() => setCommunityModal(null)} aria-label="关闭">×</button>
            <div className="community-modal__header">
              <div className="community-modal__avatar"><span>{communityModal.avatar}</span></div>
              <div>
                <h2>{communityModal.name}</h2>
                <p>{communityModal.members} 位成员</p>
              </div>
            </div>
            <p className="community-modal__intro">{communityModal.intro}</p>
            <div className="community-modal__qr">
              <div className="qr-placeholder">
                <div className="qr-grid">
                  {[...Array(64)].map((_, i) => <span key={i} className={Math.random() > 0.5 ? "qr-cell--on" : ""} />)}
                </div>
                <p>扫码加群</p>
              </div>
            </div>
            <button type="button" className="login-modal__submit">加入社群</button>
          </div>
        </div>
      )}
      {activeDrawer && (
        <div className="mine-drawer-overlay" onClick={() => setActiveDrawer(null)}>
          <div className="mine-drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={activeDrawerMeta?.name}>
            <div className="mine-drawer__handle" />
            <header className="mine-drawer__header">
              <h2>{activeDrawerMeta?.name}</h2>
              <button type="button" className="mine-drawer__close" onClick={() => setActiveDrawer(null)} aria-label="关闭">×</button>
            </header>
            <div className="mine-drawer__body">
              {activeDrawer === "schedule" ? (
                <ScheduleCalendar schedule={mySchedule} />
              ) : activeDrawer === "tickets" ? (
                myTickets.length > 0 ? (
                  <div className="ticket-list">
                    {myTickets.map((ticket) => (
                      <article key={ticket.id} className="ticket-card" onClick={() => setTicketModal(ticket)}>
                        <img src={ticket.image} alt={ticket.title} className="ticket-card__img" loading="lazy" />
                        <div className="ticket-card__body">
                          <h3>{ticket.title}</h3>
                          <p className="ticket-card__date">{ticket.date}</p>
                          <p className="ticket-card__venue">{ticket.venue}</p>
                          <span className="ticket-card__stub">查看电子票 →</span>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="schedule-empty">还没有票根，去参加一场活动吧</p>
                )
              ) : (
                myCommunities.length > 0 ? (
                  <div className="community-list">
                    {myCommunities.map((community) => (
                      <article key={community.id} className="community-card" onClick={() => setCommunityModal(community)}>
                        <div className="community-card__avatar"><span>{community.avatar}</span></div>
                        <div className="community-card__body">
                          <h3>{community.name}</h3>
                          <p>{community.intro}</p>
                          <span className="community-card__members">{community.members} 位成员</span>
                        </div>
                        <span className="community-card__arrow">→</span>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="schedule-empty">还没有关注社群，去发现同好吧</p>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ActivityDetail({ activity, onClose, onAddToSchedule }) {
  const [notice, setNotice] = useState("");
  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  };
  const handleAddToSchedule = () => {
    const isNew = onAddToSchedule ? onAddToSchedule(activity) : true;
    showNotice(isNew ? "已添加到我的日程" : "该活动已在我的日程中");
  };
  return <section className="detail-view"><button type="button" className="detail-close" onClick={onClose} aria-label="返回首页">×<span>返回</span></button><img className="detail-hero" src={activity.image} alt={activity.title} /><div className="detail-content"><p className="section-kicker">CITY BOX / ACTIVITY</p><h1>{activity.title}</h1><div className="detail-tags"><span>{activity.date.split(" ")[0]}</span><span>{activity.city}</span><span>{activity.venue}</span></div><p className="detail-description">这是一场值得期待的城市活动。在这里认识有趣的人，体验新鲜的事物，让普通的一天也拥有特别的记忆。活动详情、参与方式和现场安排，将在报名后为你完整呈现。</p><div className="detail-info"><span>活动类型</span><strong>{activity.category}</strong></div></div><div className="detail-actions"><button type="button" className="calendar-button" onClick={handleAddToSchedule}><span className="calendar-icon">□</span>添加到日历</button><button type="button" className="signup-button" onClick={() => showNotice("正在前往主办方页面...")}>去报名 <Icon name="arrow" /></button></div>{notice && <div className="detail-modal" role="status"><div className="detail-modal__box"><span className="detail-modal__check">✓</span><p>{notice}</p></div></div>}</section>;
}

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [mySchedule, setMySchedule] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const addToSchedule = (activity) => {
    if (mySchedule.some((item) => item.id === activity.id)) return false;
    setMySchedule([...mySchedule, activity]);
    return true;
  };
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 16); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  const changeView = (view) => { setSelectedActivity(null); setCurrentView(view); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openActivity = (activity) => { setSelectedActivity(activity); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const closeActivity = () => { setSelectedActivity(null); setCurrentView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return <div className="page"><header className={`nav ${scrolled ? "nav--scrolled" : ""}`}><div className="nav__inner"><button className="nav__logo" type="button" onClick={() => changeView("home")}><span className="nav__logo-mark">c</span><span>city box</span></button></div></header><main className="main">{selectedActivity ? <ActivityDetail activity={selectedActivity} onClose={closeActivity} onAddToSchedule={addToSchedule} /> : currentView === "home" ? <HomeView onViewChange={changeView} onActivitySelect={openActivity} /> : currentView === "map" ? <MapView onActivitySelect={openActivity} activities={activities} /> : currentView === "publish" ? <PublishView /> : <MineView onViewChange={changeView} mySchedule={mySchedule} />}</main>{!selectedActivity && <nav className="bottom-nav" aria-label="底部导航">{views.map((view) => <button type="button" key={view} className={`bottom-nav__item ${currentView === view ? "bottom-nav__item--active" : ""}`} onClick={() => changeView(view)}><Icon name={view === "home" ? "home" : view === "map" ? "map" : view === "publish" ? "plus" : "user"} /><span>{view === "home" ? "首页" : view === "map" ? "地图" : view === "publish" ? "创建" : "我的"}</span></button>)}</nav>}</div>;
}

export default App;
