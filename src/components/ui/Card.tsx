"use client";

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'purple' | 'gold' | 'emerald' | 'blue' | null;
  padding?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable Card component for UI panels, widgets, and items.
 */
export default function Card({
  children,
  className = '',
  glow = null,
  padding = 'md',
}: CardProps) {
  const baseClasses = 'rounded-xl bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden';
  
  const paddings = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  const glows = {
    purple: 'shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)] border-purple-500/30',
    gold: 'shadow-[0_0_15px_-3px_rgba(251,191,36,0.4)] border-amber-500/30',
    emerald: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)] border-emerald-500/30',
    blue: 'shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)] border-blue-500/30',
  };

  const classes = [
    baseClasses,
    paddings[padding],
    glow ? glows[glow] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
}
