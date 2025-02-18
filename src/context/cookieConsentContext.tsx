import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import CookieConsentModal from "src/components/CookieConsent/CookieConsentModal";
import {
  getCookieConsentInitialObject,
  handleConsentChanges,
} from "src/cookieConsentManager";
import {
  CategoryWithoutServices,
  CookieConsent,
} from "src/types/cookieConsent";

type CookieConsentContextType = {
  consentState: CookieConsent;
  updateConsent: (updatedCategories: CategoryWithoutServices[]) => void;
  isConsentModalOpen: boolean;
  setIsConsentModalOpen: (isOpen: boolean) => void;
};

// Default value for context
const defaultContextValue: CookieConsentContextType = {
  consentState: getCookieConsentInitialObject() as CookieConsent,
  updateConsent: () => {},
  isConsentModalOpen: false,
  setIsConsentModalOpen: () => {},
};

export const CookieConsentContext =
  createContext<CookieConsentContextType>(defaultContextValue);

type CookieConsentProviderProps = {
  children: ReactNode;
  googleAnalyticsTagID: string | undefined;
};

export default function CookieConsentProvider({
  children,
  googleAnalyticsTagID,
}: CookieConsentProviderProps) {
  const [consentState, setConsentState] = useState(
    getCookieConsentInitialObject(googleAnalyticsTagID) as CookieConsent
  );
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  const [isInitialLoad, setIsIntialLoad] = useState(true);

  // Runs only on the client after the first render
  useEffect(() => {
    try {
      const storedConsent = localStorage.getItem("cookieConsent");
      const parsedConsent = storedConsent ? JSON.parse(storedConsent) : null;

      if (parsedConsent) {
        //user gave some consent preference
        //check parsed content, if the gtag is undefined and googleAnalyticsTagID has a non undefined value, update the localstorage
        let isGTagSet = false;
        if (parsedConsent) {
          const analyticsSettings = (parsedConsent.categories || []).find(
            (settingsObj) => settingsObj.category === "analytics"
          );
          if (analyticsSettings) {
            const gtagConfig = (analyticsSettings.services || []).find(
              (config) => config.name === "googletagmanager"
            );

            if (
              gtagConfig &&
              gtagConfig.gtag &&
              gtagConfig.gtag?.toLowerCase() !== "undefined"
            ) {
              isGTagSet = true;
            }

            if (!isGTagSet && googleAnalyticsTagID) {
              //update the gtag value in parsedConsentlocal storage
              gtagConfig.gtag = googleAnalyticsTagID;
              gtagConfig.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsTagID}`;
            } else if (isGTagSet && !googleAnalyticsTagID) {
              gtagConfig.gtag = undefined;
              gtagConfig.src =
                "https://www.googletagmanager.com/gtag/js?id=undefined";
            }
          }
          localStorage.setItem("cookieConsent", JSON.stringify(parsedConsent));
        }

        // if there is consent in local storage set it to state
        handleConsentChanges(parsedConsent.categories);
        setConsentState(parsedConsent);
      } else {
        //otherwise set the initial object to consent in local storage
        localStorage.setItem(
          "cookieConsent",
          JSON.stringify(getCookieConsentInitialObject(googleAnalyticsTagID))
        );
      }
      if (!parsedConsent?.consentGiven) setIsConsentModalOpen(true);
    } catch {}
  }, [googleAnalyticsTagID]);

  useEffect(() => {
    // handle changes in consent state
    if (isInitialLoad) {
      setIsIntialLoad(false);
    } else {
      localStorage.setItem("cookieConsent", JSON.stringify(consentState));
      handleConsentChanges(consentState.categories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consentState]);

  const updateConsent = (updatedCategories: CategoryWithoutServices[]) => {
    const newCategories = consentState.categories.map((cat) => {
      const updatedCategory = updatedCategories.find(
        (uc) => uc.category === cat.category
      );
      return updatedCategory
        ? { ...cat, enabled: updatedCategory.enabled }
        : cat;
    });
    setConsentState({
      ...consentState,
      categories: newCategories,
      consentGiven: true,
    });
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consentState,
        updateConsent,
        isConsentModalOpen,
        setIsConsentModalOpen,
      }}
    >
      {children}
      <CookieConsentModal />
    </CookieConsentContext.Provider>
  );
}

export const useCookieConsentContext = () => useContext(CookieConsentContext);
