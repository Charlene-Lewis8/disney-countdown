"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Star,
  CheckCircle2,
  Luggage,
  PartyPopper,
  Volume2,
  VolumeX,
} from "lucide-react";
import { DAILY_SURPRISES, PACKING_ITEMS } from "@/lib/disneyData";
import { soundFX } from "@/lib/soundEffects";

// Target Date: July 21, 2027 at 8:00 AM local time
const TARGET_DATE = new Date(2027, 6, 21, 8, 0, 0);
const MS_PER_DAY = 1000 * 60 * 60 * 24;

interface TimeLeft {
  sleeps: number;
  hours: number;
  minutes: number;
  seconds: number;
  isTripDay: boolean;
}

export default function DisneyCountdownApp() {
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    sleeps: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isTripDay: false,
  });

  // Daily interactive states persisted in localStorage
  const [starsCount, setStarsCount] = useState<number>(0);
  const [checkedInToday, setCheckedInToday] = useState<boolean>(false);
  const [questDoneToday, setQuestDoneToday] = useState<boolean>(false);
  const [packedIds, setPackedIds] = useState<string[]>([]);
  const [todaySurprise, setTodaySurprise] = useState(DAILY_SURPRISES[0]);
  const [todayKey, setTodayKey] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;

    const startOfYearUtc = Date.UTC(now.getFullYear(), 0, 1);
    const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const dayOfYear = Math.floor((todayUtc - startOfYearUtc) / MS_PER_DAY);
    const surpriseForToday = DAILY_SURPRISES[dayOfYear % DAILY_SURPRISES.length];

    // Load saved progress from localStorage
    const savedStars = Number(localStorage.getItem("disney_stars") || "0");
    const lastCheckIn = localStorage.getItem("disney_last_checkin");
    const lastQuest = localStorage.getItem("disney_last_quest");
    const savedPacked = JSON.parse(localStorage.getItem("disney_packed") || "[]");
    const savedMuted = localStorage.getItem("disney_muted") === "true";

    queueMicrotask(() => {
      setTodayKey(currentKey);
      setTodaySurprise(surpriseForToday);
      setStarsCount(savedStars);
      setCheckedInToday(lastCheckIn === currentKey);
      setQuestDoneToday(lastQuest === currentKey);
      setPackedIds(savedPacked);
      setIsMuted(savedMuted);
      soundFX.isMuted = savedMuted;
    });

    const calculateTime = () => {
      const currentNow = new Date();
      const diff = TARGET_DATE.getTime() - currentNow.getTime();

      if (diff <= 0) {
        setTimeLeft({ sleeps: 0, hours: 0, minutes: 0, seconds: 0, isTripDay: true });
        return;
      }

      // Use UTC midnights for calendar day math so Daylight Saving Time never shifts "sleeps"
      const localTodayUtc = Date.UTC(
        currentNow.getFullYear(),
        currentNow.getMonth(),
        currentNow.getDate()
      );
      const tripDayUtc = Date.UTC(2027, 6, 21); // July 21, 2027
      const sleeps = Math.max(0, Math.floor((tripDayUtc - localTodayUtc) / MS_PER_DAY));

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor((totalSeconds / 3600) % 24);
      const minutes = Math.floor((totalSeconds / 60) % 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ sleeps, hours, minutes, seconds, isTripDay: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFX.isMuted = nextMuted;
    localStorage.setItem("disney_muted", String(nextMuted));

    if (!nextMuted) {
      soundFX.playMagicWand();
    }
  };

  const fireMagicConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FF69B4", "#00BFFF", "#A855F7"],
    });
  };

  const handleDailyCheckIn = () => {
    soundFX.playPixieDust();
    fireMagicConfetti();

    if (!checkedInToday && todayKey) {
      const updatedStars = starsCount + 1;
      setStarsCount(updatedStars);
      setCheckedInToday(true);
      localStorage.setItem("disney_stars", String(updatedStars));
      localStorage.setItem("disney_last_checkin", todayKey);
    }
  };

  const handleCompleteQuest = () => {
    soundFX.playQuestComplete();
    fireMagicConfetti();

    if (!questDoneToday && todayKey) {
      const updatedStars = starsCount + 1;
      setStarsCount(updatedStars);
      setQuestDoneToday(true);
      localStorage.setItem("disney_stars", String(updatedStars));
      localStorage.setItem("disney_last_quest", todayKey);
    }
  };

  const togglePackItem = (id: string) => {
    const isAlreadyPacked = packedIds.includes(id);
    const willBePacked = !isAlreadyPacked;

    soundFX.playPopSound(willBePacked);

    const updated = isAlreadyPacked
      ? packedIds.filter((item) => item !== id)
      : [...packedIds, id];

    setPackedIds(updated);
    localStorage.setItem("disney_packed", JSON.stringify(updated));

    if (willBePacked) {
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.75 } });
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      {/* Top Header, Sound Toggle & Star Jar */}
      <header className="mb-8 flex flex-col items-center justify-between gap-4 rounded-3xl border-4 border-white/80 bg-white/75 p-5 shadow-xl backdrop-blur-md sm:flex-row">
        <button
          onClick={() => soundFX.playMagicWand()}
          className="flex cursor-pointer items-center gap-3 text-center transition-transform active:scale-95 sm:text-left"
          title="Tap the castle for magic!"
        >
          <span className="animate-float text-5xl" role="img" aria-label="Castle">
            🏰
          </span>
          <div>
            <h1
              className="text-3xl font-bold tracking-tight text-purple-700 sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Disney Countdown!
            </h1>
            <p className="text-sm font-bold text-pink-600">
              Magical Trip: July 21, 2027 ✨
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          {/* Sound Toggle Button */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border-2 border-purple-200 bg-purple-100 text-purple-700 shadow-sm transition hover:bg-purple-200 active:scale-95"
          >
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </button>

          {/* Star Jar Counter */}
          <button
            onClick={() => soundFX.playMagicWand()}
            className="flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-yellow-400 bg-yellow-100 px-4 py-2.5 shadow-inner transition-transform active:scale-95"
          >
            <Star className="h-7 w-7 fill-yellow-400 text-yellow-500 animate-twinkle" />
            <div className="text-left">
              <p className="text-xs font-extrabold uppercase tracking-wider text-yellow-800">
                Magic Stars
              </p>
              <p
                className="text-2xl font-bold leading-none text-yellow-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {starsCount} {starsCount === 1 ? "Star" : "Stars"}
              </p>
            </div>
          </button>
        </div>
      </header>

      {/* Main Countdown Card */}
      <section className="mb-8 rounded-3xl border-4 border-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 text-center text-white shadow-2xl sm:p-8">
        {timeLeft.isTripDay ? (
          <div className="py-6">
            <p className="mb-3 text-6xl">🎆🏰🎉</p>
            <h2
              className="text-4xl font-bold sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              TODAY IS DISNEY DAY!
            </h2>
          </div>
        ) : (
          <>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-extrabold uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              Count the Sleeps!
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </p>

            {/* Big Sleeps Number */}
            <div className="my-4 rounded-3xl border-4 border-yellow-300 bg-white/15 py-6 backdrop-blur-sm">
              <span
                className="block text-7xl font-bold text-yellow-300 drop-shadow-md sm:text-8xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {timeLeft.sleeps}
              </span>
              <span
                className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {timeLeft.sleeps === 1 ? "More Sleep!" : "More Sleeps!"} 😴
              </span>
            </div>

            {/* Smaller Live Clock Boxes */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm"
                >
                  <div
                    className="text-2xl font-bold sm:text-3xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {String(unit.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-100">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Interactive Daily Magic & Character Surprise */}
      <section className="mb-8 rounded-3xl border-4 border-white bg-white/90 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-2xl font-bold text-purple-800"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Today&apos;s Disney Visitor!
          </h2>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold text-purple-700">
            New Friend Every Day!
          </span>
        </div>

        {/* Tappable Character Card */}
        <div
          onClick={() => soundFX.playMagicWand()}
          className={`cursor-pointer rounded-2xl bg-gradient-to-r ${todaySurprise.bgGradient} p-5 text-white shadow-md transition-transform active:scale-[0.99]`}
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-white/30 text-6xl shadow-inner animate-float">
              {todaySurprise.emoji}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-extrabold uppercase tracking-wider text-white/90">
                {todaySurprise.movie}
              </p>
              <h3
                className="text-2xl font-bold sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {todaySurprise.character}
              </h3>
              <p className="mt-1 text-lg font-bold leading-snug">
                &ldquo;{todaySurprise.greeting}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Daily Check-In Button */}
        <div className="mt-5">
          <button
            onClick={handleDailyCheckIn}
            className={`w-full cursor-pointer rounded-2xl border-b-4 px-6 py-4 text-xl font-bold text-white shadow-lg transition-all active:translate-y-1 active:border-b-0 ${
              checkedInToday
                ? "border-emerald-700 bg-emerald-500 hover:bg-emerald-600"
                : "border-amber-600 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-105"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {checkedInToday ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-7 w-7" />
                Checked In Today! Tap for More Confetti! 🎉
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <PartyPopper className="h-7 w-7" />
                Tap Here for Today&apos;s Magic Star! ✨
              </span>
            )}
          </button>
        </div>

        {/* Daily Quest & Fun Fact */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col justify-between rounded-2xl border-2 border-pink-200 bg-pink-50 p-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-pink-600">
                Today&apos;s Fun Quest 🎯
              </p>
              <p className="mt-1 text-base font-bold text-slate-800">
                {todaySurprise.dailyQuest}
              </p>
            </div>
            <button
              onClick={handleCompleteQuest}
              className={`mt-4 w-full cursor-pointer rounded-xl py-2.5 text-base font-bold text-white transition active:scale-95 ${
                questDoneToday
                  ? "bg-pink-500"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {questDoneToday ? "Quest Complete! ⭐" : "I Did It! (+1 Star)"}
            </button>
          </div>

          <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-sky-600">
              Disney Park Secret 🤫
            </p>
            <p className="mt-1 text-base font-bold text-slate-800">
              {todaySurprise.funFact}
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Suitcase Packing Game */}
      <section className="rounded-3xl border-4 border-white bg-white/90 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Luggage className="h-7 w-7 text-purple-600" />
            <h2
              className="text-2xl font-bold text-purple-800"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pack Your Magic Suitcase!
            </h2>
          </div>
          <span className="rounded-full bg-yellow-200 px-3 py-1 text-sm font-extrabold text-yellow-900">
            {packedIds.length} / {PACKING_ITEMS.length} Packed
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PACKING_ITEMS.map((item) => {
            const isPacked = packedIds.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => togglePackItem(item.id)}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-3 p-4 text-center transition-all active:scale-95 ${
                  isPacked
                    ? "border-emerald-400 bg-emerald-50 scale-[0.98]"
                    : "border-purple-200 bg-purple-50/60 hover:border-purple-400 hover:bg-purple-50"
                }`}
              >
                <span className="mb-1 text-4xl">{item.emoji}</span>
                <span className="text-sm font-extrabold text-slate-800">
                  {item.label}
                </span>
                <span
                  className={`mt-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    isPacked
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-purple-700"
                  }`}
                >
                  {isPacked ? "In Suitcase! ✓" : "Tap to Pack"}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}