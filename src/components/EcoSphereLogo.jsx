/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
export default function EcoSphereLogo({ className = "w-6 h-6", size = 24 }) {
  return <svg
    className={`${className} transition-all duration-300 hover:scale-105`}
    width={size}
    height={size}
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
      {
    /* Outer ambient globe ring with emerald-teal gradient */
  }
      <circle
    cx="22"
    cy="22"
    r="18"
    stroke="url(#ecosphere-globe-grad)"
    strokeWidth="3"
    strokeLinecap="round"
    className="opacity-90"
  />

      {
    /* Decorative clean offset orbital sweep representing community circulation */
  }
      <path
    d="M22 4A18 18 0 0 1 40 22"
    stroke="url(#ecosphere-accent-grad)"
    strokeWidth="3.5"
    strokeLinecap="round"
  />

      {
    /* Modern, elegant minimalist double sprout leaf in the core of the sphere */
  }
      {
    /* Main leaf */
  }
      <path
    d="M22 22C14 22 12 14 14 9C19 9 22 15 22 22Z"
    fill="url(#ecosphere-leaf-grad)"
    stroke="#ffffff"
    strokeWidth="1.5"
  />

      {
    /* Secondary overlay leaf */
  }
      <path
    d="M22 22C28 22 30 16 29 11C25 11 22 16 22 22Z"
    fill="url(#ecosphere-accent-grad)"
    stroke="#ffffff"
    strokeWidth="1.5"
  />

      <defs>
        {
    /* Deep highly visible emerald gradient */
  }
        <linearGradient id="ecosphere-globe-grad" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>

        <linearGradient id="ecosphere-leaf-grad" x1="14" y1="9" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        <linearGradient id="ecosphere-accent-grad" x1="22" y1="11" x2="29" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>
    </svg>;
}
