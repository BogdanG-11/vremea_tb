"use client";

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'blue' | 'emerald' | 'amber' | 'red' | 'slate';
  size?: 'sm' | 'md';
}

/**
 * Small pill badge for status, tags, and highlights.
 */
export default function Badge({
  children,
  variant = 'slate',
  size = 'sm',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const variants = {
    purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border border-red-500/30',
    slate: 'bg-slate-700/50 text-slate-300 border border-slate-600/50',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  const classes = [baseClasses, variants[variant], sizes[size]].join(' ');

  return (
    <span className={classes}>
      {children}
    </span>
  );
}
