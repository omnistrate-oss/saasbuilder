export const cookieConsentInitialObject = {
  consentGiven: false,
  categories: [
    {
      category: "necessary",
      services: [
        {
          type: "auth",
          name: "token",
          cookies: ["token"],
        },
        {
          type: "OAuth_providers",
          name: "OAuth",
        },
      ],
      hide: false,
      editable: false,
      enabled: true,
    },
    {
      category: "analytics",
      services: [
        {
          type: "script",
          src: "https://www.googletagmanager.com/gtag/js?id=G-4VFBWS43ZQ",
          name: "googletagmanager",
          "consent-category": "analytics",
          gtag: "G-4VFBWS43ZQ",
          cookies: ["_ga", "_ga_*", "_gid"],
          handleEnable: "addGoogleAnalytics",
          handleDisable: "removeGoogleAnalyticsScriptsAndCookies",
        },
      ],
      hide: false,
      editable: true,
      enabled: false,
    },
  ],
};

const handlerMap = {
  addGoogleAnalytics,
  removeGoogleAnalyticsScriptsAndCookies,
};

function addGoogleAnalytics() {
  const id = `script-${this.name}`;
  if (document.getElementById(id)) return; // Avoid duplicate scripts

  const script = document.createElement("script");

  script.src = this.src;
  script.id = id;
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    initializeGoogleAnalytics.call(this);
    console.log(`Script ${id} loaded successfully.`);
  };

  script.onerror = () => {
    console.error(`Failed to load script ${id}.`);
  };
}

function initializeGoogleAnalytics() {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", this.gtag);
}

const removeScript = (id) => {
  const script = document.getElementById(id);
  if (script) {
    script.parentNode.removeChild(script);
    console.log(`Script ${id} removed.`);
  }
};

const removeCookies = (cookieNames) => {
  cookieNames.forEach((name) => {
    const allCookies = document.cookie.split("; "); // Get all cookies as an array of "key=value" strings

    if (name.includes("*")) {
      // Handle wildcard pattern
      const regex = new RegExp(`^${name.replace("*", ".*")}`);
      allCookies.forEach((cookie) => {
        const cookieName = cookie.split("=")[0];
        if (regex.test(cookieName)) {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname}`;
        }
      });
    } else {
      // Exact match removal
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname}`;
    }
  });
};

function removeGoogleAnalyticsScriptsAndCookies() {
  removeScript(`script-${this.name}`);
  removeCookies(this.cookies);
  window.dataLayer = undefined; // Clear global state
  window.gaGlobal = undefined;
  window.google_tag_data = undefined;
  window.google_tag_manager = undefined;
}

export const handleConsentChanges = (categories) => {
  categories.forEach((cat) => {
    cat.services?.forEach((srv) => {
      if (srv.type === "script") {
        if (cat.enabled) {
          // Load script dynamically if category is enabled
          if (srv.handleEnable) handlerMap[srv.handleEnable]?.call(srv);
        } else {
          // Remove script and associated cookies if category is disabled
          if (srv.handleDisable) handlerMap[srv.handleDisable]?.call(srv);
        }
      }
    });
  });
};
