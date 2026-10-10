import Icon from "./Icon.jsx";

function ActivityCard({ activity, highlighted = false, onSelect }) {
  const openActivity = () => onSelect?.(activity);
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openActivity();
    }
  };

  return (
    <article
      id={`activity-${activity.id}`}
      className={`activity-card ${highlighted ? "activity-card--highlighted" : ""}`}
      onClick={openActivity}
      onKeyDown={handleKeyDown}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <img src={activity.image} alt={activity.title} className="activity-card__poster" loading="lazy" />
      <div className="activity-card__body">
        <div className="activity-card__topline">
          <span>{activity.category}</span>
          <span>0{activity.id}</span>
        </div>
        <h3>{activity.title}</h3>
        <dl className="activity-meta">
          <div>
            <dt>时间</dt>
            <dd>{activity.date}</dd>
          </div>
          <div>
            <dt>地点</dt>
            <dd>{activity.city} · {activity.venue}</dd>
          </div>
        </dl>
        <a href="#" className="detail-button">
          查看详情 <Icon name="arrow" />
        </a>
      </div>
    </article>
  );
}

export default ActivityCard;
