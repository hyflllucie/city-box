import { useEffect, useRef } from "react";

export const AMAP_KEY = "ceff3b352f73e815ac131d5f7c845180";
export const SHANGHAI_CENTER = [121.4737, 31.2304];
export const AMAP_PLUGINS = ["AMap.Geocoder", "AMap.Geolocation"];
export const mapPins = [
  { id: 1, label: "徐汇", activityId: 1, position: [121.4375, 31.1883] },
  { id: 2, label: "静安", activityId: 2, position: [121.449, 31.229] },
  { id: 3, label: "黄浦", activityId: 3, position: [121.4905, 31.2222] },
  { id: 4, label: "浦东", activityId: 4, position: [121.544, 31.221] },
  { id: 5, label: "虹桥", activityId: 1, position: [121.325, 31.197] },
];

export function loadAMap() {
  if (window.AMap) return Promise.resolve(window.AMap);
  if (window.__cityBoxAMap) return window.__cityBoxAMap;

  window.__cityBoxAMap = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=${AMAP_PLUGINS.join(",")}`;
    script.async = true;
    script.onload = () => resolve(window.AMap);
    script.onerror = () => reject(new Error("高德地图加载失败"));
    document.head.appendChild(script);
  });

  return window.__cityBoxAMap;
}

function RealMap({ onPinClick, onReady }) {
  const containerRef = useRef(null);
  const onPinClickRef = useRef(onPinClick);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onPinClickRef.current = onPinClick;
  }, [onPinClick]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    let map;
    let cancelled = false;

    const onResize = () => map?.resize?.() ?? map?.setSize?.(map.getSize());

    loadAMap()
      .then((AMap) => {
        if (cancelled || !containerRef.current) return;
        map = new AMap.Map(containerRef.current, {
          zoom: 11,
          center: SHANGHAI_CENTER,
          viewMode: "2D",
          resizeEnable: true,
          animateEnable: true,
        });
        mapPins.forEach((pin) => {
          const marker = new AMap.Marker({
            position: pin.position,
            content: `<button class="amap-drop-pin" aria-label="查看${pin.label}活动"><span></span></button>`,
            offset: new AMap.Pixel(-18, -36),
            title: pin.label,
          });
          marker.on("click", () => onPinClickRef.current(pin));
          marker.setMap(map);
        });
        onReadyRef.current?.(map, AMap);
        window.addEventListener("resize", onResize);
        map.on?.("resize", onResize);
      })
      .catch((err) => {
        console.error("高德地图加载失败:", err);
        onReadyRef.current?.(null, null);
      });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      map?.destroy();
    };
  }, []);

  return <div ref={containerRef} className="real-map" aria-label="高德城市地图" />;
}

export default RealMap;
