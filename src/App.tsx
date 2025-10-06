import { useState, useEffect, useRef } from "react";
import { clockFont } from "./clockFont";
import "./App.css";

const normalizeAngle = (next: number, prev: number) => {
  const delta = (((next - prev) % 360) + 360) % 360;
  return prev + delta;
};

function Hand({ angle, initial }: { angle: number; initial: boolean }) {
  const randomAngle = () => Math.floor(Math.random() * 360);
  return (
    <div
      className="absolute origin-left bg-gray-600 rounded-full h-1 w-[1.4vw] top-[1.4vw] left-[2.1vw] -translate-x-1/2 -translate-y-1/2"
      style={{
        rotate: `${initial ? randomAngle() : angle}deg`,
        transitionDuration: `${initial ? 1 : 0.4}s`,
      }}
    ></div>
  );
}

function Clock({ h, m, initial }: { h: number; m: number; initial: boolean }) {
  const prev = useRef({ h: 0, m: 0 });
  const hourAngle = normalizeAngle(h, prev.current.h);
  const minuteAngle = normalizeAngle(m, prev.current.m);
  prev.current = { h: hourAngle, m: minuteAngle };

  return (
    <div className="relative rounded-full bg-gradient-to-br from-gray-300 to-white shadow-lg border-sky-50 border-2 h-[3vw] w-[3vw]">
      <Hand angle={hourAngle} initial={initial} />
      <Hand angle={minuteAngle} initial={initial} />
    </div>
  );
}

const getTimeDigits = () => {
  const now = new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()]
    .flatMap((val) => String(val).padStart(2, "0").split(""))
    .map(Number);
};

export default function App() {
  const [time, setTime] = useState(Array(6).fill(0));
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitial(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let updateTimer: ReturnType<typeof setTimeout>;

    const updateTime = () => {
      setTime(getTimeDigits());
      const now = Date.now();
      const delay = 1000 - (now % 1000);
      updateTimer = setTimeout(updateTime, delay);
    };

    updateTime();

    return () => clearTimeout(updateTimer);
  }, []);

  const clockSize = "3vw";
  const gap = `calc(${clockSize} * 0.05)`;
  const clockW = `calc(${clockSize} * 4 + ${gap} * 5)`;
  const clockH = `calc(${clockSize} * 6 + ${gap} * 5)`;

  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{
        gap: gap,
        paddingLeft: `calc(${clockSize} + ${gap} * 2)`,
      }}
    >
      {time.map((digit, i) => (
        <div
          key={i}
          className="flex flex-wrap"
          style={{
            gap: gap,
            width: clockW,
            height: clockH,
            marginRight: i % 2 === 1 ? clockSize : "0px",
          }}
        >
          {clockFont[digit].map(({ h, m }, j) => (
            <Clock key={j} h={h} m={m} initial={initial} />
          ))}
        </div>
      ))}
    </div>
  );
}
