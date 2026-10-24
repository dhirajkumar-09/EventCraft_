import React from 'react';
import { Utensils } from 'lucide-react';

export default function MenuCourseList({ menu = [], cuisineDiet }) {
  if (!menu || menu.length === 0) return null;

  return (
    <div className="card-glass rounded-2xl p-6 border border-amber-200/60 dark:border-slate-800">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-amber-600" />
          <span>Gastronomic Menu ({cuisineDiet || 'Custom'} Diet)</span>
        </h4>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
          {menu.length} Courses
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {menu.map((course, idx) => (
          <div
            key={course.course || idx}
            className="p-4 rounded-xl bg-amber-50/40 dark:bg-slate-800/50 border border-amber-200/50 dark:border-slate-700/60"
          >
            <div className="font-extrabold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-3 pb-2 border-b border-amber-200 dark:border-slate-700">
              {course.course}
            </div>
            <ul className="space-y-2">
              {(course.items || []).map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5"
                >
                  <span className="text-amber-500 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
