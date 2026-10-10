import { useRef, useState } from "react";
import ActivityCard from "../components/ActivityCard.jsx";
import Icon from "../components/Icon.jsx";
import RealMap, { AMAP_PLUGINS, SHANGHAI_CENTER, mapPins } from "../components/RealMap.jsx";
import "./MapView.css";

function stripCitySuffix(name = "") {
  return String(name).replace(/市$/, "");
}

function formatCityLabel(name) {
  const city = stripCitySuffix(name);
  return city ? `${city}市` : "";
}

function toLngLat(location) {
  if (!location) return null;
  if (Array.isArray(location) && location.length >= 2) {
    return [Number(location[0]), Number(location[1])];
  }
  const lng = typeof location.getLng === "function" ? location.getLng() : location.lng;
  const lat = typeof location.getLat === "function" ? location.getLat() : location.lat;
  if (lng == null || lat == null || Number.isNaN(Number(lng)) || Number.isNaN(Number(lat))) return null;
  return [Number(lng), Number(lat)];
}

function isAmapSuccess(status, result) {
  if (status !== "complete" || !result) return false;
  const info = String(result.info || "").toUpperCase();
  return !info || info === "OK" || info === "1" || info === "SUCCESS";
}

// 修复后的平滑移动函数
function flyTo(map, lnglat, zoom = 12) {
  if (!map || !lnglat) return;
  map.panTo(lnglat, 600);
  setTimeout(() => {
    map.setZoom(zoom);
  },600);
}

function MapView({ onActivitySelect, activities = [] }) {
  const [search, setSearch] = useState("");
  const [activePin, setActivePin] = useState(null);
  const [currentCity, setCurrentCity] = useState("");
  const [toast, setToast] = useState("");
  const mapRef = useRef(null);
  const amapRef = useRef(null);
  const geocoderRef = useRef(null);
  const geolocationRef = useRef(null);
  const myMarkerRef = useRef(null);
  const pluginsReadyRef = useRef(false);
  const toastTimerRef = useRef(0);
  const pendingActionRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(""), 2600);
  };

  const addMyMarker = (lnglat) => {
    const AMap = amapRef.current;
    const map = mapRef.current;
    if (!AMap || !map) return;
    if (myMarkerRef.current) myMarkerRef.current.setMap(null);
    myMarkerRef.current = new AMap.Marker({
      position: lnglat,
      content: '<div class="amap-my-pin"><span></span></div>',
      offset: new AMap.Pixel(-12, -12),
      zIndex: 200,
    });
    myMarkerRef.current.setMap(map);
  };

  const reverseGeocode = (lnglat, callback) => {
    if (!geocoderRef.current) {
      callback(null);
      return;
    }
    geocoderRef.current.getAddress(lnglat, (status, result) => {
      if (isAmapSuccess(status, result) && result.regeocode) {
        const component = result.regeocode.addressComponent || {};
        const city = stripCitySuffix(component.city || component.province || result.regeocode.formattedAddress || "");
        callback(city || null);
        return;
      }
      console.error("逆地理编码失败:", status, result);
      callback(null);
    });
  };

  const applyCityView = (lnglat, cityName, { marker = false, toastText } = {}) => {
    const city = stripCitySuffix(cityName);
    setCurrentCity(city);
    if (marker) addMyMarker(lnglat);
    flyTo(mapRef.current, lnglat, 12);
    if (toastText) showToast(toastText);
  };

  const fallbackToShanghai = (reason) => {
    if (reason) console.warn("定位失败:", reason);
    applyCityView(SHANGHAI_CENTER, "上海", { toastText: "无法获取定位，已默认显示上海" });
  };

  const locateWithAMap = () => {
    const geolocation = geolocationRef.current;
    if (!geolocation) {
      fallbackToShanghai("Geolocation 插件未加载");
      return;
    }

    const onLocated = (lnglat, maybeCity) => {
      if (maybeCity) {
        applyCityView(lnglat, maybeCity, { marker: true, toastText: `已定位到：${formatCityLabel(maybeCity)}` });
        return;
      }
      reverseGeocode(lnglat, (city) => {
        if (city) {
          applyCityView(lnglat, city, { marker: true, toastText: `已定位到：${formatCityLabel(city)}` });
        } else {
          fallbackToShanghai("逆地理编码未返回城市名");
        }
      });
    };

    geolocation.getCurrentPosition((status, result) => {
      if (isAmapSuccess(status, result) && result.position) {
        const lnglat = toLngLat(result.position);
        const city = stripCitySuffix(result.addressComponent?.city || result.addressComponent?.province || result.city || "");
        if (lnglat) {
          onLocated(lnglat, city);
          return;
        }
      }

      geolocation.getCityInfo((cityStatus, cityResult) => {
        if (isAmapSuccess(cityStatus, cityResult)) {
          const lnglat = toLngLat(cityResult.position || cityResult.center);
          const city = stripCitySuffix(cityResult.city || cityResult.province || "");
          if (lnglat) {
            onLocated(lnglat, city);
            return;
          }
        }
        fallbackToShanghai(result?.message || cityResult?.message || `status=${status}`);
      });
    });
  };

  const handleGeolocation = () => {
    if (!pluginsReadyRef.current) {
      pendingActionRef.current = locateWithAMap;
      showToast("地图加载中，请稍后再试");
      return;
    }
    locateWithAMap();
  };

  const searchCity = (keyword) => {
    const query = keyword.trim();
    if (!query) {
      showToast("请输入城市名称");
      return;
    }
    if (!geocoderRef.current) {
      showToast("地图加载中，请稍后再试");
      return;
    }

    const tryQuery = (address, next) => {
      geocoderRef.current.getLocation(address, (status, result) => {
        const geocode = result?.geocodes?.[0];
        if (isAmapSuccess(status, result) && geocode) {
          const lnglat = toLngLat(geocode.location);
          const cityName = stripCitySuffix(
            geocode.addressComponent?.city || geocode.addressComponent?.province || geocode.formattedAddress || query,
          );
          if (lnglat) {
            applyCityView(lnglat, cityName || query);
            return;
          }
        }
        if (next) {
          next();
          return;
        }
        console.error("Geocoder 搜索失败:", status, result);
        showToast(`未找到城市：${query}`);
      });
    };

    const withCitySuffix = query.endsWith("市") ? query : `${query}市`;
    tryQuery(query, () => tryQuery(withCitySuffix));
  };

  const handleSearch = (event) => {
    event?.preventDefault();
    const city = search.trim();
    if (!city) {
      showToast("请输入城市名称");
      return;
    }
    if (!pluginsReadyRef.current) {
      pendingActionRef.current = () => searchCity(city);
      showToast("地图加载中，请稍后再试");
      return;
    }
    searchCity(city);
  };

  const handleMapReady = (map, AMap) => {
    mapRef.current = map;
    amapRef.current = AMap;
    if (!map || !AMap) {
      showToast("高德地图加载失败");
      return;
    }

    const initPlugins = () => {
      geocoderRef.current = new AMap.Geocoder({ city: "全国", radius: 1000, extensions: "all" });
      geolocationRef.current = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 12000,
        GeoLocationFirst: false,
        noIpLocate: 0,
        getCityWhenFail: true,
        needAddress: true,
        zoomToAccuracy: false,
        showButton: false,
        panToLocation: false,
      });
      pluginsReadyRef.current = true;
      const pending = pendingActionRef.current;
      pendingActionRef.current = null;
      if (pending) pending();
    };

    if (AMap.Geocoder && AMap.Geolocation) {
      initPlugins();
      return;
    }

    AMap.plugin(AMAP_PLUGINS, initPlugins);
  };

  const handlePinClick = (pin) => {
    setActivePin(pin.id);
    window.setTimeout(() => {
      document.getElementById(`activity-${pin.activityId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const subtitle = currentCity ? `正在查看：${formatCityLabel(currentCity)}的活动` : "看看附近正在发生什么";

  return (
    <section className="map-view">
      <div className="page-heading">
        <p className="section-kicker">LIVE IN THE CITY</p >
        <h1>城市活动地图</h1>
        <p>{subtitle}</p >
      </div>
      <form className="map-search" onSubmit={handleSearch}>
        <label className="search-field">
          <span>⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="输入城市名称，如：上海"
            aria-label="搜索城市"
          />
        </label>
        <button type="submit" className="search-button">搜索</button>
        <button type="button" className="locate-button" onClick={handleGeolocation}>
          <Icon name="map" />
          <span>定位</span>
        </button>
      </form>
      {toast && <div className="locate-toast" role="status">{toast}</div>}
      <div className="map-card">
        <RealMap onPinClick={handlePinClick} onReady={handleMapReady} />
        <div className="map-legend">
          <span className="legend-live-dot" />
          <span>实时地图 · {currentCity ? formatCityLabel(currentCity) : "上海市"}</span>
        </div>
      </div>
      <div className="map-filters">
        <button type="button">全部时间 <span>⌄</span></button>
        <button type="button">全部城市 <span>⌄</span></button>
        <button type="button">全部标签 <span>⌄</span></button>
      </div>
      <div className="map-list-heading">
        <h2>地图上的活动</h2>
        <span>5 个活动地点</span>
      </div>
      <div className="activity-list">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onSelect={onActivitySelect}
            highlighted={activePin !== null && mapPins.find((pin) => pin.id === activePin)?.activityId === activity.id}
          />
        ))}
      </div>
    </section>
  );
}

export default MapView;