// ad.js
(function () {
  "use strict";

  const AD_URL = "https://ggcokara.github.io/PakSigns/";
  const AD_NAME = "PakSigns - Pakistan Traffic Signs";
  const AD_DESC = "Prepare for the official Pakistani computerized driving license e-sign test offline.";
  const AD_ICON = "https://ggcokara.github.io/PakSigns/src/144.png";

  const ad = document.createElement("aside");
  ad.id = "paksigns-sticky-ad";
  ad.setAttribute("role", "region");
  ad.setAttribute("aria-label", "Sponsored PakSigns promotion");

  // Modernized structure matching Google AdSense anchor/banner ads
  ad.innerHTML = `
    <div class="paksigns-ad-shell">
      <!-- Left: Google Ad Indicator -->
      <div class="paksigns-ad-badge-container">
        <span class="paksigns-ad-badge">Ad</span>
        <span class="paksigns-ad-info" title="About this ad">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </span>
      </div>

      <!-- Center: Main Ad Copy (Icon + Text Details) -->
      <a class="paksigns-ad-link" href="${AD_URL}" target="_blank" rel="noopener noreferrer">
        <img class="paksigns-icon" src="${AD_ICON}" alt="${AD_NAME}">
        <div class="paksigns-copy">
          <div class="paksigns-title">${AD_NAME}</div>
          <div class="paksigns-desc">${AD_DESC}</div>
          <div class="paksigns-url">ggcokara.github.io/PakSigns</div>
        </div>
      </a>

      <!-- Right: Call to Action & Close controls -->
      <div class="paksigns-actions">
        <a class="paksigns-btn" href="${AD_URL}" target="_blank" rel="noopener noreferrer">Open</a>
        <button class="paksigns-close" type="button" aria-label="Close advertisement">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #paksigns-sticky-ad {
      /* Google Ad Palette Design Variables */
      --g-blue: #1a73e8;
      --g-blue-hover: #1557b0;
      --g-text-primary: #202124;
      --g-text-secondary: #5f6368;
      --g-border: #dadce0;
      --g-bg: #ffffff;
      --g-badge-bg: #ffffff;
      --g-badge-border: #dadce0;
      --g-badge-text: #3c4043;
      --g-shadow: 0 2px 6px rgba(60,64,67, 0.15);
      
      position: sticky;
      top: 0;
      z-index: 99999;
      width: 100%;
      background: var(--g-bg);
      border-bottom: 1px solid var(--g-border);
      box-shadow: var(--g-shadow);
      font-family: Roboto, Arial, sans-serif;
    }

    /* Prevent parent layout pollution */
    #paksigns-sticky-ad,
    #paksigns-sticky-ad * {
      box-sizing: border-box;
      margin: 0;
    }

    .paksigns-ad-shell {
      max-width: 1240px;
      margin: 0 auto;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    /* Google Style Ad Badge & Info Link */
    .paksigns-ad-badge-container {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 0 0 auto;
    }

    .paksigns-ad-badge {
      font-size: 11px;
      font-weight: 700;
      color: var(--g-badge-text);
      background: var(--g-badge-bg);
      border: 1px solid var(--g-badge-border);
      padding: 2px 6px;
      border-radius: 4px;
      line-height: 1.2;
    }

    .paksigns-ad-info {
      display: inline-flex;
      align-items: center;
      color: var(--g-text-secondary);
      opacity: 0.85;
    }

    .paksigns-ad-info svg {
      width: 14px;
      height: 14px;
    }

    /* Core Link Structure */
    .paksigns-ad-link {
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: inherit;
    }

    .paksigns-icon {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
      flex: 0 0 auto;
      border: 1px solid var(--g-border);
    }

    .paksigns-copy {
      min-width: 0;
      flex: 1 1 auto;
    }

    .paksigns-title {
      font-size: 14px;
      line-height: 1.3;
      font-weight: 600;
      color: var(--g-text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .paksigns-title:hover {
      text-decoration: underline;
    }

    .paksigns-desc {
      font-size: 12px;
      line-height: 1.4;
      color: var(--g-text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 1px;
    }

    .paksigns-url {
      font-size: 11px;
      color: var(--g-text-secondary);
      margin-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Buttons & Actions */
    .paksigns-actions {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .paksigns-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      background: var(--g-blue);
      color: #ffffff;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 4px;
      white-space: nowrap;
      transition: background .15s ease-in-out;
    }

    .paksigns-btn:hover {
      background: var(--g-blue-hover);
    }

    .paksigns-close {
      border: 0;
      background: transparent;
      color: var(--g-text-secondary);
      cursor: pointer;
      width: 28px;
      height: 28px;
      padding: 4px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .15s ease, color .15s ease;
    }

    .paksigns-close svg {
      width: 100%;
      height: 100%;
    }

    .paksigns-close:hover {
      background: rgba(0, 0, 0, 0.06);
      color: var(--g-text-primary);
    }

    /* --- Responsive Behavior --- */
    
    /* Medium Screens (Tablets / Small Laptops) */
    @media (max-width: 768px) {
      .paksigns-desc {
        font-size: 11px;
      }
      .paksigns-ad-shell {
        gap: 10px;
      }
    }

    /* Compact Mobile Display (Maintains layout on small viewports without wrapping rows) */
    @media (max-width: 600px) {
      .paksigns-ad-shell {
        padding: 6px 10px;
      }
      
      .paksigns-desc {
        display: none; /* Hide description to prevent single-row layout overflow */
      }
      
      .paksigns-url {
        display: none; /* Hide structural site path on smaller displays */
      }

      .paksigns-icon {
        width: 36px;
        height: 36px;
        border-radius: 6px;
      }

      .paksigns-title {
        font-size: 13px;
      }

      .paksigns-btn {
        padding: 6px 12px;
        font-size: 12px;
      }
    }

    /* Ultra-narrow mobile screens (320px) */
    @media (max-width: 360px) {
      .paksigns-ad-info {
        display: none; /* Hide tiny info icon to maximize structural title space */
      }
      .paksigns-ad-shell {
        gap: 6px;
      }
      .paksigns-icon {
        display: none; /* Hide icon on extremely narrow layouts */
      }
    }

    /* --- Dark Mode Override --- */
    @media (prefers-color-scheme: dark) {
      #paksigns-sticky-ad {
        --g-bg: #202124;
        --g-border: #3c4043;
        --g-text-primary: #e8eaed;
        --g-text-secondary: #9aa0a6;
        --g-badge-bg: #303134;
        --g-badge-border: #5f6368;
        --g-badge-text: #e8eaed;
        --g-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
      }
      
      .paksigns-close:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }
  `;

  function inject() {
    // Prevent duplicated layouts if loaded multiple times
    if (document.getElementById("paksigns-sticky-ad")) return;

    document.head.appendChild(style);
    document.body.prepend(ad);
  }

  ad.addEventListener("click", (e) => {
    if (e.target.closest(".paksigns-close")) {
      // Discard immediately for current session (reloads will show the ad again)
      ad.remove();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();